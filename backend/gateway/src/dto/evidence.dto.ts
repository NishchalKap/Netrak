import { z } from 'zod';

export const createEvidenceSchema = z.object({
  type: z.enum(['audio', 'image', 'video', 'document', 'chat', 'link', 'note']),
  label: z.string().trim().min(3).max(200),
  reference: z.string().trim().min(3).max(2048).refine(
    (value) => Array.from(value).every((character) => character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127),
    { message: 'Reference contains unsupported control characters' }
  ),
  notes: z.string().trim().max(5000).optional(),
}).strict();

export type CreateEvidenceDto = z.infer<typeof createEvidenceSchema>;
