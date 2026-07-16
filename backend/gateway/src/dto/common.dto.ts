import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().uuid(),
}).strict();

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).optional(),
  offset: z.coerce.number().int().min(0).max(100_000).optional(),
}).strict();

export type PaginationQueryDto = z.infer<typeof paginationQuerySchema>;
