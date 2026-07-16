import { create } from 'zustand';
import { Notification } from '../types';
import { notificationApi } from '@/services/notificationApi';
import { getApiErrorMessage } from '@/services/apiError';
import { createJSONStorage, persist } from 'zustand/middleware';
import { preferencesStorage } from '@/services/preferencesStorage';
import { useUserStore } from './userStore';

type DataSource = 'idle' | 'online' | 'cached';

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  source: DataSource;
  lastSyncedAt: string | null;
  readIds: string[];
  fetchNotifications: (force?: boolean) => Promise<Notification[]>;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

let activeRequest: Promise<Notification[]> | null = null;
const NOTIFICATIONS_TTL_MS = 30000;

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      isLoading: false,
      error: null,
      source: 'idle',
      lastSyncedAt: null,
      readIds: [],
      fetchNotifications: async (force = false) => {
        if (activeRequest) return activeRequest;
        const { notifications, lastSyncedAt } = get();
        if (!force && notifications.length && isFresh(lastSyncedAt, NOTIFICATIONS_TTL_MS)) return notifications;
        set({ isLoading: true, error: null });
        activeRequest = notificationApi.getNotifications()
          .then(async (notifications) => {
            const profile = useUserStore.getState().profile ?? await useUserStore.getState().fetchProfile();
            const visibleNotifications = profile
              ? notifications.filter((item) => item.userId === profile.id)
              : [];
            const localReadIds = new Set(get().readIds);
            const synchronized = visibleNotifications.map((item) => ({ ...item, read: item.read || localReadIds.has(item.id) }));
            set({ notifications: synchronized, isLoading: false, source: 'online', lastSyncedAt: new Date().toISOString() });
            return synchronized;
          })
          .catch((error) => {
            const cached = get().notifications;
            set({ isLoading: false, source: cached.length ? 'cached' : 'idle', error: getApiErrorMessage(error, 'Notifications are unavailable. Pull to retry.') });
            return cached;
          })
          .finally(() => { activeRequest = null; });
        return activeRequest;
      },
      markRead: (id) => set((state) => ({
        notifications: state.notifications.map((item) => item.id === id ? { ...item, read: true } : item),
        readIds: state.readIds.includes(id) ? state.readIds : [...state.readIds, id].slice(-100),
      })),
      markAllRead: () => set((state) => ({
        notifications: state.notifications.map((item) => ({ ...item, read: true })),
        readIds: Array.from(new Set([...state.readIds, ...state.notifications.map((item) => item.id)])).slice(-100),
      })),
    }),
    {
      name: 'notification-read-state',
      storage: createJSONStorage(() => preferencesStorage),
      partialize: ({ readIds }) => ({ readIds }),
      merge: (persisted, current) => {
        const readIds = (persisted as Partial<NotificationState>)?.readIds ?? current.readIds;
        const readSet = new Set(readIds);
        return {
          ...current,
          readIds,
          notifications: current.notifications.map((item) => ({ ...item, read: item.read || readSet.has(item.id) })),
        };
      },
    }
  )
);

function isFresh(timestamp: string | null, ttl: number) {
  return Boolean(timestamp && Date.now() - new Date(timestamp).getTime() < ttl);
}
