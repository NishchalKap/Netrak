import { prisma } from '../database/prisma';

export class CaseRepository {
  async findAll() {
    return prisma.case.findMany({
      include: { evidence: true, timeline: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.case.findUnique({
      where: { id },
      include: { evidence: true, timeline: true },
    });
  }

  async create(data: {
    title: string;
    description: string;
    status?: string;
    category?: string;
    riskLevel?: string;
    location?: string;
    userId: string;
  }) {
    return prisma.case.create({
      data,
      include: { evidence: true, timeline: true },
    });
  }

  async update(id: string, data: { title?: string; description?: string; status?: string }) {
    return prisma.case.update({
      where: { id },
      data,
      include: { evidence: true, timeline: true },
    });
  }

  async delete(id: string) {
    return prisma.case.delete({ where: { id } });
  }
}
