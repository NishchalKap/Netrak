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
      const claims = token ? decodeJwt(token) as { exp?: number; id?: string; sub?: string; role?: string } | null : null;
      const structurallyValid = Boolean(token && claims && typeof claims.exp === 'number' && typeof claims.id === 'string' && claims.sub === claims.id && claims.role === 'CITIZEN');
      if (!structurallyValid) {
        if (token) await tokenStorage.remove();
        clearSessionData();
        set({ isHydrated: true, isAuthenticated: false, token: null, error: token ? 'Your session is invalid. Please sign in again.' : null });
        return;
      }
      if (claims!.exp! * 1000 <= Date.now()) {
        try {
          const refreshed = await authApi.refresh(token!);
          await tokenStorage.set(refreshed.token);
          set({ isHydrated: true, isAuthenticated: true, token: refreshed.token, error: null });
          return;
        } catch {
          await tokenStorage.remove();
          clearSessionData();
          set({ isHydrated: true, isAuthenticated: false, token: null, error: 'Your session expired. Please sign in again.' });
          return;
        }
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
      if (response.user.role !== 'CITIZEN') {
        throw new Error('Officer and administrator accounts must use the Netrak Operations workspace.');
      }
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
      if (response.user.role !== 'CITIZEN') throw new Error('Unexpected account role');
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
