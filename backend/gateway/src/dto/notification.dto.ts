import { z } from 'zod';

export const createNotificationSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  userId: z.string().uuid(),
});

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;
