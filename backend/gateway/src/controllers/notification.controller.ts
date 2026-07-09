import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { sendSuccess } from '../common/response';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  createNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.notificationService.createNotification(req.body);
      sendSuccess(res, data, 'Notification created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.notificationService.getAllNotifications();
      sendSuccess(res, data, 'Notifications retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
