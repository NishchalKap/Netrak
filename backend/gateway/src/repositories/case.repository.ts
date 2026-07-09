import { prisma } from '../database/prisma';

export class CaseRepository {
  async findAll() {
    return prisma.case.findMany();
  }

  async findById(id: string) {
    return prisma.case.findUnique({ where: { id } });
  }

  async create(data: { title: string; description: string; status?: string; userId: string }) {
    return prisma.case.create({ data });
  }

  async update(id: string, data: { title?: string; description?: string; status?: string }) {
    return prisma.case.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.case.delete({ where: { id } });
  }
}
