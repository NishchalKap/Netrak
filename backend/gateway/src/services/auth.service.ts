import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { promisify } from 'util';
import { UserRepository } from '../repositories/user.repository';
import { LoginDto, RegisterDto, UpdateProfileDto } from '../dto/auth.dto';
import { AppError } from '../common/AppError';
import { env } from '../config/env';
import { logger } from '../common/logger';

const scryptAsync = promisify(crypto.scrypt);
const PASSWORD_HASH_PREFIX = 'scrypt-v1';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user || !(await verifyPassword(data.password, user.password))) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.password.startsWith(`${PASSWORD_HASH_PREFIX}$`)) {
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
      throw new AppError('Email already exists', 400);
    }

    const user = await this.userRepository.create({
      email: data.email,
      password: await hashPassword(data.password),
      role,
    });

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
      }) as { id?: unknown; role?: unknown };
      if (typeof decoded.id !== 'string' || typeof decoded.role !== 'string') throw new Error('Invalid token payload');
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
    // Always return success to prevent email enumeration.
    // In development, log the token so it can be used without email infrastructure.
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Do not reveal that the email does not exist.
      return { queued: true };
    }

    if (env.NODE_ENV === 'development') {
      logger.info('[forgot-password] reset requested', { userId: user.id });
    }

    // Delivery is delegated to deployment-specific identity infrastructure.

    return { queued: true };
  }

  private signToken(id: string, role: string) {
    return jwt.sign({ id, role }, env.JWT_SECRET, {
      algorithm: 'HS256',
      audience: env.JWT_AUDIENCE,
      issuer: env.JWT_ISSUER,
      expiresIn: '1h',
    });
  }
}

async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
  return `${PASSWORD_HASH_PREFIX}$${salt}$${derivedKey.toString('hex')}`;
}

async function verifyPassword(password: string, stored: string) {
  const [prefix, salt, expectedHex] = stored.split('$');
  if (prefix === PASSWORD_HASH_PREFIX && salt && expectedHex) {
    const expected = Buffer.from(expectedHex, 'hex');
    const actual = await scryptAsync(password, salt, expected.length) as Buffer;
    return expected.length > 0 && crypto.timingSafeEqual(expected, actual);
  }

  const suppliedDigest = crypto.createHash('sha256').update(password).digest();
  const storedDigest = crypto.createHash('sha256').update(stored).digest();
  return crypto.timingSafeEqual(suppliedDigest, storedDigest);
}
