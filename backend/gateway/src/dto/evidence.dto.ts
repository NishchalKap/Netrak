import { z } from 'zod';

export const createEvidenceSchema = z.object({
  type: z.enum(['audio', 'image', 'video', 'document', 'chat', 'link', 'note']),
  label: z.string().min(3),
  reference: z.string().min(3),
  notes: z.string().optional(),
});

export type CreateEvidenceDto = z.infer<typeof createEvidenceSchema>;
