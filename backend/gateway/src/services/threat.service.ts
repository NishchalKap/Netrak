import { ThreatRepository } from '../repositories/threat.repository';
import { AppError } from '../common/AppError';
import { ThreatListQueryDto } from '../dto/threat.dto';

export class ThreatService {
  private threatRepository: ThreatRepository;

  constructor() {
    this.threatRepository = new ThreatRepository();
  }

  async getAllThreats(query: ThreatListQueryDto) {
    return this.threatRepository.findAll(query);
  }

  async getThreatById(id: string) {
    const threat = await this.threatRepository.findById(id);
    if (!threat) throw new AppError('Threat not found', 404);
    return threat;
  }
}
