import { EvidenceRepository } from '../repositories/evidence.repository';
import { CaseRepository } from '../repositories/case.repository';
import { CreateEvidenceDto } from '../dto/evidence.dto';
import { AppError } from '../common/AppError';

export class EvidenceService {
  private evidenceRepository: EvidenceRepository;
  private caseRepository: CaseRepository;

  constructor() {
    this.evidenceRepository = new EvidenceRepository();
    this.caseRepository = new CaseRepository();
  }

  async addEvidence(caseId: string, data: CreateEvidenceDto) {
    const caseItem = await this.caseRepository.findById(caseId);
    if (!caseItem) throw new AppError('Case not found', 404);
    return this.evidenceRepository.create(caseId, data);
  }
}
