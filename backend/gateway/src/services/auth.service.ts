import { UserRepository } from '../repositories/user.repository';
import { LoginDto, RegisterDto, UpdateProfileDto } from '../dto/auth.dto';
import { AppError } from '../common/AppError';
import { env } from '../config/env';
import { logger } from '../common/logger';
import { Prisma } from '@prisma/client';
import { supabaseClient } from '../config/supabase';

const USER_ROLES = new Set(['CITIZEN', 'OFFICER', 'ADMIN']);

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(data: LoginDto) {
    const { data: authData, error } = await supabaseClient.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !authData.user || !authData.session) {
      throw new AppError('Invalid credentials', 401);
    }

    const supabaseUser = authData.user;
    
    // Sync user with Prisma
    let user = await this.userRepository.findByEmail(supabaseUser.email!);
    if (!user) {
      // If user exists in Supabase but not Prisma, sync them (default to CITIZEN if unknown)
      // This happens if created directly in Supabase dashboard
      user = await this.userRepository.create({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        password: 'supabase-managed',
        role: 'CITIZEN',
      });
    }

    if (!USER_ROLES.has(user.role)) {
      logger.error('Account has an invalid persisted role', { userId: user.id });
      throw new AppError('Account is not available', 403);
    }

    return {
      token: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
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

    // Create user in Supabase
    const { data: authData, error } = await supabaseClient.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new AppError(error.message, 400);
    }

    if (!authData.user) {
      throw new AppError('Account creation failed', 400);
    }

    const supabaseUser = authData.user;

    let user;
    try {
      user = await this.userRepository.create({
        id: supabaseUser.id, // Ensure Prisma ID matches Supabase ID
        email: data.email,
        password: 'supabase-managed',
        role,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new AppError('Account could not be created with these details', 409);
      }
      throw err;
    }

    // If auto-confirm is OFF in Supabase, session might be null.
    // If so, we might not be able to return a token immediately.
    const token = authData.session?.access_token || '';
    const refreshToken = authData.session?.refresh_token || '';

    return {
      token,
      refreshToken,
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
    const { data, error } = await supabaseClient.auth.refreshSession({ refresh_token: token });
    if (error || !data.session) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
    
    return { token: data.session.access_token, refreshToken: data.session.refresh_token };
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
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
    if (error) {
      logger.info('[forgot-password] error from Supabase', { email, error: error.message });
      // We might throw or silently succeed for security. Let's throw for now to match.
      throw new AppError(error.message, 400);
    }
  }
}
