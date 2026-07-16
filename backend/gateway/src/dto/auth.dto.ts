import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(128),
}).strict();

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(12).max(128),
  role: z.enum(['CITIZEN', 'OFFICER', 'ADMIN']).optional(),
}).strict();

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(120).nullable().optional(),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/).nullable().optional(),
  district: z.string().trim().min(1).max(120).nullable().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, { message: 'At least one field is required' });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
}).strict();

export const refreshTokenSchema = z.object({
  token: z.string().min(20).max(4096),
}).strict();

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
