import { z } from 'zod';

export const createCaseSchema = z.object({
  title: z.coerce.string().trim().min(3).max(200),
  description: z.coerce.string().trim().min(10).max(10000),
  category: z.enum(['digital_arrest', 'upi_fraud', 'investment_scam', 'counterfeit_currency', 'loan_app', 'sim_swap', 'other']).optional(),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  location: z.coerce.string().trim().min(1).max(200).optional(),
}).strict();

export const updateCaseSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().min(10).max(10000).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'ESCALATED']).optional(),
}).strict().refine((value) => Object.keys(value).length > 0, { message: 'At least one field is required' });

export const caseListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).optional(),
  offset: z.coerce.number().int().min(0).max(100_000).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'ESCALATED']).optional(),
}).strict();

export type CreateCaseDto = z.infer<typeof createCaseSchema>;
export type UpdateCaseDto = z.infer<typeof updateCaseSchema>;
export type CaseListQueryDto = z.infer<typeof caseListQuerySchema>;
