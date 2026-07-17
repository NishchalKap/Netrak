import { z } from 'zod';

export const createUploadUrlSchema = z.object({
  kind: z.enum(['evidence', 'image', 'document']),
  objectPath: z.string().trim().min(1).max(1024),
  contentType: z.string().trim().min(3).max(255).regex(/^[^\s/]+\/[^\s/]+$/, 'contentType must be a MIME type'),
}).strict();

export type CreateUploadUrlDto = z.infer<typeof createUploadUrlSchema>;
