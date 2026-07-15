import { prisma } from '../database/prisma';

export class NotificationRepository {
  async findAll(userId?: string) {
    return prisma.notification.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { message: string; userId: string }) {
    return prisma.notification.create({ data });
  }
}
