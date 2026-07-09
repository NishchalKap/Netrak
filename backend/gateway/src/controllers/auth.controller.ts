import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../common/response';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.login(req.body);
      sendSuccess(res, data, 'Logged in successfully');
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.register(req.body);
      sendSuccess(res, data, 'Registered successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.body.token;
      const data = await this.authService.refresh(token);
      sendSuccess(res, data, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  };

  profile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.getProfile(req.user.id);
      sendSuccess(res, data, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
