import { prisma } from '../database/prisma';
import { env } from '../config/env';

export class NotificationRepository {
  async findAll(userId?: string) {
    return prisma.notification.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: env.MAX_LIST_RESULTS,
    });
  }

  async create(data: { message: string; userId: string }) {
    return prisma.notification.create({ data });
  }
}
