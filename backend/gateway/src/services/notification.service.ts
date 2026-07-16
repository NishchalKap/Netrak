import { NotificationRepository } from '../repositories/notification.repository';
import { CreateNotificationDto, NotificationListQueryDto } from '../dto/notification.dto';
import { AuthenticatedUser } from '../middleware/auth.middleware';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../common/AppError';

export class NotificationService {
  private notificationRepository: NotificationRepository;
  private userRepository: UserRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.userRepository = new UserRepository();
  }

  async getAllNotifications(actor: AuthenticatedUser, query: NotificationListQueryDto) {
    return this.notificationRepository.findAll({ ...query, userId: actor.role === 'CITIZEN' ? actor.id : undefined });
  }

  async createNotification(data: CreateNotificationDto) {
    if (!(await this.userRepository.findById(data.userId))) throw new AppError('Notification recipient not found', 404);
    return this.notificationRepository.create(data);
  }
}
