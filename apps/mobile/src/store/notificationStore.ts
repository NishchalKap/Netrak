import { create } from 'zustand';
import { Notification } from '../types';
import { notificationApi } from '@/services/notificationApi';
import { makeLocalId } from '@/utils';

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  setNotifications: (notifications: Notification[]) => void;
  fetchNotifications: () => Promise<Notification[]>;
  addLocalNotification: (message: string, category?: Notification['category']) => Notification;
  createNotification: (message: string, userId: string, category?: Notification['category']) => Promise<Notification>;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: seedNotifications,
  isLoading: false,
  error: null,
  setNotifications: (notifications) => set({ notifications }),
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await notificationApi.getNotifications();
      set({ notifications, isLoading: false });
      return notifications;
    } catch (error) {
      set((state) => ({
        notifications: state.notifications.length ? state.notifications : seedNotifications,
        isLoading: false,
        error: getNotificationErrorMessage(error),
      }));
      return get().notifications;
    }
  },
  addLocalNotification: (message, category = 'system') => {
    const notification = createLocalNotification(message, category);
    set((state) => ({ notifications: [notification, ...state.notifications] }));
    return notification;
  },
  createNotification: async (message, userId, category = 'system') => {
    try {
      const notification = await notificationApi.createNotification({ message, userId });
      const nextNotification = { ...notification, category };
      set((state) => ({ notifications: [nextNotification, ...state.notifications] }));
      return nextNotification;
    } catch {
      const notification = createLocalNotification(message, category, userId);
      set((state) => ({ notifications: [notification, ...state.notifications] }));
      return notification;
    }
  },
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      ),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
    })),
}));

const now = new Date().toISOString();

const seedNotifications: Notification[] = [
  {
    id: 'local-notification-threat',
    message: 'High risk digital arrest scripts are active in metro regions.',
    read: false,
    category: 'threat',
    createdAt: now,
  },
  {
    id: 'local-notification-case',
    message: 'Your recent report is ready for evidence upload.',
    read: false,
    category: 'case',
    createdAt: now,
  },
];

function createLocalNotification(message: string, category: Notification['category'], userId?: string): Notification {
  return {
    id: makeLocalId('notification'),
    message,
    read: false,
    userId,
    category,
    createdAt: new Date().toISOString(),
  };
}

function getNotificationErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Notification service unavailable';
}
