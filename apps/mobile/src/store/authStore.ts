import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  isHydrated: boolean;
  isAuthenticated: boolean;
  token: string | null;
  hydrate: () => Promise<void>;
  login: (token?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isHydrated: false,
  isAuthenticated: false,
  token: null,
  hydrate: async () => {
    const token = await SecureStore.getItemAsync('token');
    set({ isHydrated: true, isAuthenticated: Boolean(token), token });
  },
  login: async (token?: string) => {
    const nextToken = token ?? 'demo-token';
    await SecureStore.setItemAsync('token', nextToken);
    set({ isAuthenticated: true, token: nextToken });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    set({ isAuthenticated: false, token: null });
  },
}));
