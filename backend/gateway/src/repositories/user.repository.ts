import { prisma } from '../database/prisma';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, name: true, phone: true, district: true, createdAt: true, updatedAt: true },
    });
  }

  async create(data: { id?: string; email: string; password: string; role?: string }) {
    return prisma.user.create({ data });
  }

  async update(id: string, data: { name?: string | null; phone?: string | null; district?: string | null }) {
    return prisma.user.update({ where: { id }, data });
  }

  async updatePassword(id: string, password: string) {
    return prisma.user.update({ where: { id }, data: { password } });
  }
}
