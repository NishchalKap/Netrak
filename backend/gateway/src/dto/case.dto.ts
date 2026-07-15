import { z } from 'zod';

export const createCaseSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(10000),
  category: z.string().trim().min(1).max(80).optional(),
  riskLevel: z.string().trim().min(1).max(40).optional(),
  location: z.string().trim().min(1).max(200).optional(),
});

export const updateCaseSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().min(10).max(10000).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'ESCALATED']).optional(),
}).refine((value) => Object.keys(value).length > 0, { message: 'At least one field is required' });

export type CreateCaseDto = z.infer<typeof createCaseSchema>;
export type UpdateCaseDto = z.infer<typeof updateCaseSchema>;
