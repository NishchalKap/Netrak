import { Response, NextFunction } from 'express';
import { CaseService } from '../services/case.service';
import { sendSuccess } from '../common/response';
import { AuthRequest } from '../middleware/auth.middleware';
import { CaseListQueryDto } from '../dto/case.dto';

export class CaseController {
  private caseService: CaseService;

  constructor() {
    this.caseService = new CaseService();
  }

  createCase = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.caseService.createCase(req.body, req.user!.id, {
        audioBuffer: req.file?.buffer,
        audioMimeType: req.file?.mimetype,
      });
      sendSuccess(res, data, 'Case created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  getCases = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.caseService.getAllCases(req.user!, req.query as CaseListQueryDto);
      sendSuccess(res, data, 'Cases retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getCaseById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.caseService.getCaseById(req.params.id as string, req.user!);
      sendSuccess(res, data, 'Case retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  updateCase = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.caseService.updateCase(req.params.id as string, req.body, req.user!);
      sendSuccess(res, data, 'Case updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteCase = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.caseService.deleteCase(req.params.id as string, req.user!);
      sendSuccess(res, null, 'Case deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  };
}
