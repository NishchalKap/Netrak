import { z } from 'zod';

export const createCaseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
});

export const updateCaseSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'ESCALATED']).optional(),
});

export type CreateCaseDto = z.infer<typeof createCaseSchema>;
export type UpdateCaseDto = z.infer<typeof updateCaseSchema>;
