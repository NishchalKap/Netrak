import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(6).max(128),
});

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(6).max(128),
  role: z.enum(['CITIZEN', 'OFFICER', 'ADMIN']).optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/).optional(),
  district: z.string().trim().min(1).max(120).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
});

export const refreshTokenSchema = z.object({
  token: z.string().min(20).max(4096),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
