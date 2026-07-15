import { NotificationRepository } from '../repositories/notification.repository';
import { CreateNotificationDto } from '../dto/notification.dto';
import { AuthenticatedUser } from '../middleware/auth.middleware';

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  async getAllNotifications(actor: AuthenticatedUser) {
    return this.notificationRepository.findAll(actor.role === 'CITIZEN' ? actor.id : undefined);
  }

  async createNotification(data: CreateNotificationDto) {
    return this.notificationRepository.create(data);
  }
}
