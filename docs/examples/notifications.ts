import { createApiClient } from './client';
import {
  Notification,
  GetNotificationsResponse,
  NotificationCreateRequest,
  NotificationCreateResponse,
} from '../../shared/types/api';

export async function fetchNotifications(token: string): Promise<Notification[]> {
  const client = createApiClient(token);
  const response = await client.get<GetNotificationsResponse>('/notifications');
  return response.data.data;
}

export async function createNotification(
  token: string,
  payload: NotificationCreateRequest
): Promise<Notification> {
  const client = createApiClient(token);
  const response = await client.post<NotificationCreateResponse>('/notifications', payload);
  return response.data.data;
}
