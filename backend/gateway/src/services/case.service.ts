import { CaseRepository } from '../repositories/case.repository';
import { CreateCaseDto, UpdateCaseDto } from '../dto/case.dto';
import { AppError } from '../common/AppError';

export class CaseService {
  private caseRepository: CaseRepository;

  constructor() {
    this.caseRepository = new CaseRepository();
  }

  async getAllCases() {
    return this.caseRepository.findAll();
  }

  async getCaseById(id: string) {
    const caseItem = await this.caseRepository.findById(id);
    if (!caseItem) throw new AppError('Case not found', 404);
    return caseItem;
  }

  async createCase(data: CreateCaseDto, userId: string) {
    return this.caseRepository.create({ ...data, userId });
  }

  async updateCase(id: string, data: UpdateCaseDto) {
    const caseItem = await this.caseRepository.findById(id);
    if (!caseItem) throw new AppError('Case not found', 404);
    return this.caseRepository.update(id, data);
  }

  async deleteCase(id: string) {
    const caseItem = await this.caseRepository.findById(id);
    if (!caseItem) throw new AppError('Case not found', 404);
    return this.caseRepository.delete(id);
  }
}
