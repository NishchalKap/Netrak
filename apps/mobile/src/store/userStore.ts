import { create } from 'zustand';
import { User } from '../types';
import { authApi } from '@/services/authApi';

interface UserState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: User | null) => void;
  fetchProfile: () => Promise<User | null>;
  updateLocalProfile: (profile: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  setProfile: (profile) => set({ profile }),
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await authApi.getProfile();
      set({ profile, isLoading: false });
      return profile;
    } catch (error) {
      set({ isLoading: false, error: getUserErrorMessage(error) });
      return null;
    }
  },
  updateLocalProfile: (profile) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...profile } : null,
    })),
}));

function getUserErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Profile unavailable';
}
