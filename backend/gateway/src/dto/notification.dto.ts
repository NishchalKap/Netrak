import { z } from 'zod';

export const createNotificationSchema = z.object({
  message: z.string().min(1),
  userId: z.string().uuid(),
});

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;
