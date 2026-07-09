import { prisma } from '../database/prisma';

export class NotificationRepository {
  async findAll() {
    return prisma.notification.findMany();
  }

  async create(data: { message: string; userId: string }) {
    return prisma.notification.create({ data });
  }
}
