import { apiClient } from './apiClient';

export const notificationApi = {
  getNotifications: () => apiClient.get('/notifications'),
  createNotification: (data: any) => apiClient.post('/notifications', data),
};
