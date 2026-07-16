import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRepository } from '../repositories/user.repository';
import { LoginDto, RegisterDto, UpdateProfileDto } from '../dto/auth.dto';
import { AppError } from '../common/AppError';
import { env } from '../config/env';
import { logger } from '../common/logger';
import { Prisma } from '@prisma/client';

const PASSWORD_HASH_PREFIX = 'scrypt-v1';
const TOKEN_LIFETIME_SECONDS = 60 * 60;
const SCRYPT_OPTIONS: crypto.ScryptOptions = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const consumedRefreshTokens = new Map<string, number>();
const dummyPasswordHash = hashPassword(crypto.randomBytes(32).toString('base64url'));
const USER_ROLES = new Set(['CITIZEN', 'OFFICER', 'ADMIN']);

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);
    const storedPassword = user?.password ?? await dummyPasswordHash;
    if (!user || !(await verifyPassword(data.password, storedPassword))) {
      throw new AppError('Invalid credentials', 401);
    }
    if (!USER_ROLES.has(user.role)) {
      logger.error('Account has an invalid persisted role', { userId: user.id });
      throw new AppError('Account is not available', 403);
    }

    if (!user.password.startsWith(`${PASSWORD_HASH_PREFIX}$`)) {
      if (!env.ALLOW_LEGACY_PASSWORD_MIGRATION) throw new AppError('Invalid credentials', 401);
      await this.userRepository.updatePassword(user.id, await hashPassword(data.password));
    }

    const token = this.signToken(user.id, user.role);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name ?? undefined,
        phone: user.phone ?? undefined,
        district: user.district ?? undefined,
      },
    };
  }

  async register(data: RegisterDto) {
    const role = data.role ?? 'CITIZEN';
    if (role !== 'CITIZEN' && !env.ALLOW_PRIVILEGED_REGISTRATION) {
      throw new AppError('Privileged accounts must be provisioned by an administrator', 403);
    }

    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('Account could not be created with these details', 409);
    }

    let user;
    try {
      user = await this.userRepository.create({
        email: data.email,
        password: await hashPassword(data.password),
        role,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppError('Account could not be created with these details', 409);
      }
      throw error;
    }

    const token = this.signToken(user.id, user.role);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name ?? undefined,
        phone: user.phone ?? undefined,
        district: user.district ?? undefined,
      },
    };
  }

  async refresh(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET, {
        algorithms: ['HS256'],
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
        ignoreExpiration: true,
      }) as jwt.JwtPayload;
      if (typeof decoded.id !== 'string' || typeof decoded.role !== 'string' || !USER_ROLES.has(decoded.role) || typeof decoded.exp !== 'number') {
        throw new Error('Invalid token payload');
      }
      const now = Math.floor(Date.now() / 1000);
      if (decoded.sub !== decoded.id || typeof decoded.iat !== 'number' || decoded.exp - decoded.iat > TOKEN_LIFETIME_SECONDS + 5) throw new Error('Invalid token lifetime');
      if (now > decoded.exp + env.JWT_REFRESH_GRACE_SECONDS) throw new Error('Refresh grace period expired');
      consumeRefreshToken(token, decoded.exp + env.JWT_REFRESH_GRACE_SECONDS);
      const newToken = this.signToken(decoded.id, decoded.role);
      return { token: newToken };
    } catch {
      throw new AppError('Invalid token', 401);
    }
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name ?? undefined,
      phone: user.phone ?? undefined,
      district: user.district ?? undefined,
    };
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const updated = await this.userRepository.update(userId, data);
    return {
      id: updated.id,
      email: updated.email,
      role: updated.role,
      name: updated.name ?? undefined,
      phone: updated.phone ?? undefined,
      district: updated.district ?? undefined,
    };
  }

  async forgotPassword(email: string) {
    // Keep the endpoint enumeration-safe without pretending that delivery occurred.
    logger.info('[forgot-password] unavailable delivery requested', { emailSupplied: Boolean(email) });
    throw new AppError('Password reset delivery is not configured for this deployment', 503);
  }

  private signToken(id: string, role: string) {
    return jwt.sign({ id, role }, env.JWT_SECRET, {
      algorithm: 'HS256',
      audience: env.JWT_AUDIENCE,
      issuer: env.JWT_ISSUER,
      subject: id,
      jwtid: crypto.randomUUID(),
      expiresIn: TOKEN_LIFETIME_SECONDS,
    });
  }
}

async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await derivePasswordKey(password, salt, 64);
  return `${PASSWORD_HASH_PREFIX}$${salt}$${derivedKey.toString('hex')}`;
}

async function verifyPassword(password: string, stored: string) {
  const [prefix, salt, expectedHex] = stored.split('$');
  if (prefix === PASSWORD_HASH_PREFIX && salt && expectedHex) {
    const expected = Buffer.from(expectedHex, 'hex');
    if (expected.length !== 64) return false;
    const actual = await derivePasswordKey(password, salt, expected.length);
    return expected.length > 0 && crypto.timingSafeEqual(expected, actual);
  }

  if (!env.ALLOW_LEGACY_PASSWORD_MIGRATION) return false;
  const suppliedDigest = crypto.createHash('sha256').update(password).digest();
  const storedDigest = crypto.createHash('sha256').update(stored).digest();
  return crypto.timingSafeEqual(suppliedDigest, storedDigest);
}

function derivePasswordKey(password: string, salt: string, length: number) {
  return new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, length, SCRYPT_OPTIONS, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

function consumeRefreshToken(token: string, expiresAt: number) {
  const now = Math.floor(Date.now() / 1000);
  for (const [fingerprint, expiry] of consumedRefreshTokens) {
    if (expiry < now) consumedRefreshTokens.delete(fingerprint);
  }
  const fingerprint = crypto.createHash('sha256').update(token).digest('base64url');
  if (consumedRefreshTokens.has(fingerprint)) throw new Error('Refresh token replay detected');
  if (consumedRefreshTokens.size >= 50_000) throw new Error('Refresh replay cache capacity exceeded');
  consumedRefreshTokens.set(fingerprint, expiresAt);
}
