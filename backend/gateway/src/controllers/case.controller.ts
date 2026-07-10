import { Request, Response, NextFunction } from 'express';
import { CaseService } from '../services/case.service';
import { sendSuccess } from '../common/response';
import { AuthRequest } from '../middleware/auth.middleware';

export class CaseController {
  private caseService: CaseService;

  constructor() {
    this.caseService = new CaseService();
  }

  createCase = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.caseService.createCase(req.body, req.user.id);
      sendSuccess(res, data, 'Case created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  getCases = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.caseService.getAllCases();
      sendSuccess(res, data, 'Cases retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getCaseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.caseService.getCaseById(req.params.id as string);
      sendSuccess(res, data, 'Case retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  updateCase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.caseService.updateCase(req.params.id as string, req.body);
      sendSuccess(res, data, 'Case updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteCase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.caseService.deleteCase(req.params.id as string);
      sendSuccess(res, null, 'Case deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  };
}
