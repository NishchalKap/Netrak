import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['CITIZEN', 'OFFICER', 'ADMIN']).optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  district: z.string().min(1).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
