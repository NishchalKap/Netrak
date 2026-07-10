import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authApi, LoginPayload, RegisterPayload } from '@/services/authApi';
import { AuthResponse } from '@/types';
import { useUserStore } from './userStore';

interface AuthState {
  isHydrated: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  hydrate: () => Promise<void>;
  login: (token?: string) => Promise<void>;
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
    const token = await SecureStore.getItemAsync('token');
    set({ isHydrated: true, isAuthenticated: Boolean(token), token });
  },
  login: async (token?: string) => {
    const nextToken = token ?? 'demo-token';
    await SecureStore.setItemAsync('token', nextToken);
    set({ isAuthenticated: true, token: nextToken, error: null });
  },
  loginWithCredentials: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(data);
      await SecureStore.setItemAsync('token', response.token);
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
      await SecureStore.setItemAsync('token', response.token);
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
    await SecureStore.deleteItemAsync('token');
    useUserStore.getState().setProfile(null);
    set({ isAuthenticated: false, token: null, error: null });
  },
  clearError: () => set({ error: null }),
}));

function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Authentication failed';
}
