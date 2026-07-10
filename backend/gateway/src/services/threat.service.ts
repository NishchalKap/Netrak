import { ThreatRepository } from '../repositories/threat.repository';
import { AppError } from '../common/AppError';

export class ThreatService {
  private threatRepository: ThreatRepository;

  constructor() {
    this.threatRepository = new ThreatRepository();
  }

  async getAllThreats() {
    return this.threatRepository.findAll();
  }

  async getThreatById(id: string) {
    const threat = await this.threatRepository.findById(id);
    if (!threat) throw new AppError('Threat not found', 404);
    return threat;
  }
}
