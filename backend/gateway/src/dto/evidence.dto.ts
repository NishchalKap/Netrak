import { z } from 'zod';

export const createEvidenceSchema = z.object({
  type: z.enum(['audio', 'image', 'video', 'document', 'chat', 'link', 'note']),
  label: z.string().trim().min(3).max(200),
  reference: z.string().trim().min(3).max(2048),
  notes: z.string().trim().max(5000).optional(),
});

export type CreateEvidenceDto = z.infer<typeof createEvidenceSchema>;
