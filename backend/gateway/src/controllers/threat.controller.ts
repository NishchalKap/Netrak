import { Request, Response, NextFunction } from 'express';
import { ThreatService } from '../services/threat.service';
import { sendSuccess } from '../common/response';
import { ThreatListQueryDto } from '../dto/threat.dto';

export class ThreatController {
  private threatService: ThreatService;

  constructor() {
    this.threatService = new ThreatService();
  }

  getThreats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.threatService.getAllThreats(req.query as ThreatListQueryDto);
      sendSuccess(res, data, 'Threats retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getThreatById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.threatService.getThreatById(req.params.id as string);
      sendSuccess(res, data, 'Threat retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
