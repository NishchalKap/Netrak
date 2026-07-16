import { z } from 'zod';

export const createNotificationSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  userId: z.string().uuid(),
}).strict();

export const notificationListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).optional(),
  offset: z.coerce.number().int().min(0).max(100_000).optional(),
  read: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
}).strict();

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;
export type NotificationListQueryDto = z.infer<typeof notificationListQuerySchema>;
