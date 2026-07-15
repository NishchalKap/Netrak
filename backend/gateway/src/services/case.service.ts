import { CaseRepository } from '../repositories/case.repository';
import { CreateCaseDto, UpdateCaseDto } from '../dto/case.dto';
import { AppError } from '../common/AppError';
import { AuthenticatedUser } from '../middleware/auth.middleware';

export class CaseService {
  private caseRepository: CaseRepository;

  constructor() {
    this.caseRepository = new CaseRepository();
  }

  async getAllCases(actor: AuthenticatedUser) {
    return this.caseRepository.findAll(actor.role === 'CITIZEN' ? actor.id : undefined);
  }

  async getCaseById(id: string, actor: AuthenticatedUser) {
    const caseItem = await this.caseRepository.findById(id);
    if (!caseItem) throw new AppError('Case not found', 404);
    this.ensureAccess(caseItem.userId, actor);
    return caseItem;
  }

  async createCase(data: CreateCaseDto, userId: string) {
    return this.caseRepository.create({ ...data, userId });
  }

  async updateCase(id: string, data: UpdateCaseDto, actor: AuthenticatedUser) {
    const caseItem = await this.caseRepository.findById(id);
    if (!caseItem) throw new AppError('Case not found', 404);
    this.ensureAccess(caseItem.userId, actor);
    return this.caseRepository.update(id, data);
  }

  async deleteCase(id: string, actor: AuthenticatedUser) {
    const caseItem = await this.caseRepository.findById(id);
    if (!caseItem) throw new AppError('Case not found', 404);
    this.ensureAccess(caseItem.userId, actor);
    return this.caseRepository.delete(id);
  }

  private ensureAccess(ownerId: string, actor: AuthenticatedUser) {
    if (actor.role === 'CITIZEN' && ownerId !== actor.id) throw new AppError('Case not found', 404);
  }
}
