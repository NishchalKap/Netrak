import { create } from 'zustand';
import { authApi, LoginPayload, RegisterPayload } from '@/services/authApi';
import { AuthResponse } from '@/types';
import { useUserStore } from './userStore';
import { tokenStorage } from '@/services/tokenStorage';
import { getApiErrorMessage } from '@/services/apiError';
import { setSessionExpiredHandler } from '@/services/sessionEvents';
import { decodeJwt } from '@/utils';
import { useCaseStore } from './caseStore';
import { useNotificationStore } from './notificationStore';

interface AuthState {
  isHydrated: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  hydrate: () => Promise<void>;
  loginWithCredentials: (data: LoginPayload) => Promise<AuthResponse>;
  registerWithCredentials: (data: RegisterPayload) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isHydrated: false,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
  hydrate: async () => {
    try {
      const token = await tokenStorage.get();
      const claims = token ? decodeJwt(token) as { exp?: number } | null : null;
      if (token && claims?.exp && claims.exp * 1000 <= Date.now()) {
        await tokenStorage.remove();
        clearSessionData();
        set({ isHydrated: true, isAuthenticated: false, token: null, error: 'Your session expired. Please sign in again.' });
        return;
      }
      set({ isHydrated: true, isAuthenticated: Boolean(token), token });
    } catch {
      set({ isHydrated: true, isAuthenticated: false, token: null, error: 'Unable to restore your session.' });
    }
  },
  loginWithCredentials: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(data);
      await tokenStorage.set(response.token);
      useUserStore.getState().setProfile(response.user);
      set({ isAuthenticated: true, token: response.token, isLoading: false });
      return response;
    } catch (error) {
      const message = getAuthErrorMessage(error);
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  registerWithCredentials: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(data);
      await tokenStorage.set(response.token);
      useUserStore.getState().setProfile(response.user);
      set({ isAuthenticated: true, token: response.token, isLoading: false });
      return response;
    } catch (error) {
      const message = getAuthErrorMessage(error);
      set({ isLoading: false, error: message });
      throw error;
    }
  },
  logout: async () => {
    await tokenStorage.remove();
    clearSessionData();
    set({ isAuthenticated: false, token: null, error: null });
  },
  clearError: () => set({ error: null }),
}));

function getAuthErrorMessage(error: unknown) {
  return getApiErrorMessage(error, 'Authentication failed. Check your connection and try again.');
}

setSessionExpiredHandler(() => {
  clearSessionData();
  useAuthStore.setState({ isAuthenticated: false, token: null, error: 'Your session expired. Please sign in again.' });
});

function clearSessionData() {
  useUserStore.getState().setProfile(null);
  useCaseStore.setState({ cases: [], selectedCase: null, error: null, mutationError: null, source: 'idle', lastSyncedAt: null });
  useNotificationStore.setState({ notifications: [], readIds: [], error: null, source: 'idle', lastSyncedAt: null });
}
