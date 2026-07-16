import { prisma } from '../database/prisma';
import { env } from '../config/env';

export class NotificationRepository {
  async findAll({ userId, read, limit, offset }: { userId?: string; read?: boolean; limit?: number; offset?: number } = {}) {
    return prisma.notification.findMany({
      where: { ...(userId ? { userId } : {}), ...(read === undefined ? {} : { read }) },
      orderBy: { createdAt: 'desc' },
      take: limit ?? env.MAX_LIST_RESULTS,
      skip: offset,
    });
  }

  async create(data: { message: string; userId: string }) {
    return prisma.notification.create({ data });
  }
}
