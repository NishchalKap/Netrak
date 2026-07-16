import { z } from 'zod';

const filterValue = z.string().trim().min(1).max(100);

export const threatListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).optional(),
  offset: z.coerce.number().int().min(0).max(100_000).optional(),
  category: filterValue.optional(),
  level: filterValue.optional(),
  region: filterValue.optional(),
}).strict();

export type ThreatListQueryDto = z.infer<typeof threatListQuerySchema>;
