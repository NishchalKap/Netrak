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
}
