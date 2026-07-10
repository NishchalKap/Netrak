import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRepository } from '../repositories/user.repository';
import { LoginDto, RegisterDto, UpdateProfileDto } from '../dto/auth.dto';
import { AppError } from '../common/AppError';
import { env } from '../config/env';
import { logger } from '../common/logger';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user || user.password !== data.password) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '1h' });
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
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('Email already exists', 400);
    }

    // Using raw password since requirement is mock auth
    const user = await this.userRepository.create({
      email: data.email,
      password: data.password,
      role: data.role,
    });

    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '1h' });
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
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: string };
      const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, env.JWT_SECRET, {
        expiresIn: '1h',
      });
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

    const resetToken = crypto.randomBytes(32).toString('hex');

    if (env.NODE_ENV === 'development') {
      logger.info('[forgot-password] reset token', { email, resetToken });
    }

    // TODO: integrate email provider here — send resetToken via link to user email.

    return { queued: true };
  }
}
