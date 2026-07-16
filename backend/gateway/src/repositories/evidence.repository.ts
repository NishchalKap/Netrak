import { prisma } from '../database/prisma';

export class EvidenceRepository {
  async create(caseId: string, data: { type: string; label: string; reference: string; notes?: string }) {
    return prisma.caseEvidence.create({
      data: { ...data, caseId },
    });
  }
}
