import { CaseRepository } from '../repositories/case.repository';
import { CaseListQueryDto, CreateCaseDto, UpdateCaseDto } from '../dto/case.dto';
import { AppError } from '../common/AppError';
import { AuthenticatedUser } from '../middleware/auth.middleware';
import { aiPipelineService } from '../ai/services/aiPipeline.service';

export class CaseService {
  private caseRepository: CaseRepository;

  constructor() {
    this.caseRepository = new CaseRepository();
  }

  async getAllCases(actor: AuthenticatedUser, query: CaseListQueryDto) {
    return this.caseRepository.findAll({ ...query, userId: actor.role === 'CITIZEN' ? actor.id : undefined });
  }

  async getCaseById(id: string, actor: AuthenticatedUser) {
    const caseItem = await this.caseRepository.findById(id);
    if (!caseItem) throw new AppError('Case not found', 404);
    this.ensureAccess(caseItem.userId, actor);
    return caseItem;
  }

  async createCase(data: CreateCaseDto, userId: string, options: { audioBuffer?: Buffer; audioMimeType?: string } = {}) {
    const newCase = await this.caseRepository.create({ ...data, userId });

    // Run AI pipeline asynchronously (don't wait for it to complete before returning)
    // This ensures case creation never fails because of AI
    aiPipelineService.runPipelineForCase(newCase.id, options).catch((error) => {
      console.error('AI pipeline failed for case:', newCase.id, error);
    });

    return newCase;
  }

  async updateCase(id: string, data: UpdateCaseDto, actor: AuthenticatedUser) {
    const caseItem = await this.caseRepository.findById(id);
    if (!caseItem) throw new AppError('Case not found', 404);
    this.ensureAccess(caseItem.userId, actor);
    if (actor.role === 'CITIZEN' && data.status) throw new AppError('Only authorized staff can change case workflow status', 403);
    if (actor.role === 'CITIZEN' && caseItem.status !== 'OPEN') throw new AppError('Case details cannot be edited after review begins', 409);

    const statusChanged = Boolean(data.status && data.status !== caseItem.status);
    const detailsChanged = Boolean(data.title || data.description);
    const title = statusChanged && detailsChanged
      ? 'Case status and details updated'
      : statusChanged
        ? 'Case status changed'
        : 'Case details updated';
    const detail = statusChanged
      ? `Workflow moved from ${caseItem.status} to ${data.status} by an authorized ${actor.role.toLowerCase()} account.`
      : `Case details were updated by the ${actor.role.toLowerCase()} account.`;
    return this.caseRepository.update(id, data, { title, detail });
  }

  async deleteCase(id: string, actor: AuthenticatedUser) {
    const caseItem = await this.caseRepository.findById(id);
    if (!caseItem) throw new AppError('Case not found', 404);
    this.ensureAccess(caseItem.userId, actor);
    if (actor.role === 'CITIZEN' && caseItem.status !== 'OPEN') throw new AppError('A case cannot be deleted after review begins', 409);
    return this.caseRepository.delete(id);
  }

  private ensureAccess(ownerId: string, actor: AuthenticatedUser) {
    if (actor.role === 'CITIZEN' && ownerId !== actor.id) throw new AppError('Case not found', 404);
  }
}
