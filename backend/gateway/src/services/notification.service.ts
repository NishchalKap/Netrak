import { NotificationRepository } from '../repositories/notification.repository';
import { CreateNotificationDto } from '../dto/notification.dto';

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  async getAllNotifications() {
    return this.notificationRepository.findAll();
  }

  async createNotification(data: CreateNotificationDto) {
    return this.notificationRepository.create(data);
  }
}
