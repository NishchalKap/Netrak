import { prisma } from '../database/prisma';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: { email: string; password: string; role?: string }) {
    return prisma.user.create({ data });
  }

  async update(id: string, data: { name?: string; phone?: string; district?: string }) {
    return prisma.user.update({ where: { id }, data });
  }
}
