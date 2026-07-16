import { Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { sendSuccess } from '../common/response';
import { AuthRequest } from '../middleware/auth.middleware';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  createNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.notificationService.createNotification(req.body);
      sendSuccess(res, data, 'Notification created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.notificationService.getAllNotifications(req.user!);
      sendSuccess(res, data, 'Notifications retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
