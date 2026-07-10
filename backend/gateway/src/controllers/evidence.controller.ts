import { Response, NextFunction } from 'express';
import { EvidenceService } from '../services/evidence.service';
import { sendSuccess } from '../common/response';
import { AuthRequest } from '../middleware/auth.middleware';

export class EvidenceController {
  private evidenceService: EvidenceService;

  constructor() {
    this.evidenceService = new EvidenceService();
  }

  addEvidence = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.evidenceService.addEvidence(req.params.id as string, req.body);
      sendSuccess(res, data, 'Evidence added successfully', 201);
    } catch (error) {
      next(error);
    }
  };
}
