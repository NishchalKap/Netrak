import { LoginDto, RegisterDto, UpdateProfileDto } from '../dto/auth.dto';
import { AppError } from '../common/AppError';
import { env } from '../config/env';
import { logger } from '../common/logger';
import { supabaseClient, supabaseAdmin } from '../config/supabase';

const USER_ROLES = new Set(['CITIZEN', 'OFFICER', 'ADMIN']);

export class AuthService {
  constructor() {}

  async login(data: LoginDto) {
    const { data: authData, error } = await supabaseClient.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !authData.user || !authData.session) {
      throw new AppError('Invalid credentials', 401);
    }

    const supabaseUser = authData.user;
    const role = (supabaseUser.user_metadata?.role as string) || 'CITIZEN';
    const name = supabaseUser.user_metadata?.name as string | undefined;

    if (!USER_ROLES.has(role)) {
      logger.error('Account has an invalid persisted role', { userId: supabaseUser.id });
      throw new AppError('Account is not available', 403);
    }

    return {
      token: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      user: {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        role,
        name,
        phone: undefined,
        district: undefined,
      },
    };
  }

  async register(data: RegisterDto) {
    const role = data.role ?? 'CITIZEN';
    if (role !== 'CITIZEN' && !env.ALLOW_PRIVILEGED_REGISTRATION) {
      throw new AppError('Privileged accounts must be provisioned by an administrator', 403);
    }

    const { data: authData, error } = await supabaseClient.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { role }
      } as any
    });

    if (error) {
      throw new AppError(error.message, 400);
    }

    if (!authData.user) {
      throw new AppError('Account creation failed', 400);
    }

    const supabaseUser = authData.user;

    const token = authData.session?.access_token || '';
    const refreshToken = authData.session?.refresh_token || '';

    return {
      token,
      refreshToken,
      user: {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        role,
        name: undefined,
        phone: undefined,
        district: undefined,
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
    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (error || !user) throw new AppError('User not found', 404);
    
    const role = (user.user_metadata?.role as string) || 'CITIZEN';
    const name = user.user_metadata?.name as string | undefined;

    return {
      id: user.id,
      email: user.email!,
      role,
      name,
      phone: undefined,
      district: undefined,
    };
  }

  async forgotPassword(email: string) {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
    if (error) {
      logger.info('[forgot-password] error from Supabase', { email, error: error.message });
      throw new AppError(error.message, 400);
    }
  }
}
