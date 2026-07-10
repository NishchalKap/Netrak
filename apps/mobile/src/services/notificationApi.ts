import { apiClient } from './apiClient';
import { Notification } from '@/types';

export interface CreateNotificationPayload {
  message: string;
  userId: string;
}

export const notificationApi = {
  getNotifications: () => apiClient.get<Notification[]>('/notifications'),
  createNotification: (data: CreateNotificationPayload) =>
    apiClient.post<Notification, CreateNotificationPayload>('/notifications', data),
};
