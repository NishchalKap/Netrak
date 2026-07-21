import { prisma } from '../database/prisma';
import { env } from '../config/env';

export class CaseRepository {
  async findAll({ userId, status, limit, offset }: { userId?: string; status?: string; limit?: number; offset?: number } = {}) {
    return prisma.case.findMany({
      where: { ...(userId ? { userId } : {}), ...(status ? { status } : {}) },
      include: {
        evidence: { orderBy: { createdAt: 'desc' } },
        timeline: { orderBy: { createdAt: 'desc' } },
        transcriptions: { orderBy: { createdAt: 'desc' } },
        entities: { orderBy: { createdAt: 'desc' } },
        aiResults: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit ?? env.MAX_LIST_RESULTS,
      skip: offset,
    });
  }

  async findById(id: string) {
    return prisma.case.findUnique({
      where: { id },
      include: {
        evidence: { orderBy: { createdAt: 'desc' } },
        timeline: { orderBy: { createdAt: 'desc' } },
        transcriptions: { orderBy: { createdAt: 'desc' } },
        entities: { orderBy: { createdAt: 'desc' } },
        aiResults: { orderBy: { createdAt: 'desc' } },
      },
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
      data: {
        ...data,
        timeline: {
          create: {
            title: 'Case created',
            detail: 'The report was submitted to Netrak.',
          },
        },
      },
      include: {
        evidence: { orderBy: { createdAt: 'desc' } },
        timeline: { orderBy: { createdAt: 'desc' } },
        transcriptions: { orderBy: { createdAt: 'desc' } },
        entities: { orderBy: { createdAt: 'desc' } },
        aiResults: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async update(
    id: string,
    data: { title?: string; description?: string; status?: string },
    event: { title: string; detail: string }
  ) {
    return prisma.$transaction(async (transaction) => {
      await transaction.case.update({ where: { id }, data });
      await transaction.caseTimelineEvent.create({ data: { ...event, caseId: id } });
      return transaction.case.findUniqueOrThrow({
        where: { id },
        include: {
          evidence: { orderBy: { createdAt: 'desc' } },
          timeline: { orderBy: { createdAt: 'desc' } },
        },
      });
    });
  }

  async delete(id: string) {
    return prisma.case.delete({ where: { id } });
  }
}
