import { create } from 'zustand';
import { User } from '../types';
import { authApi, ProfileUpdatePayload } from '@/services/authApi';
import { getApiErrorMessage } from '@/services/apiError';

interface UserState {
  profile: User | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  setProfile: (profile: User | null) => void;
  fetchProfile: () => Promise<User | null>;
  updateProfile: (profile: ProfileUpdatePayload) => Promise<User | null>;
  clearError: () => void;
}

let profileRequest: Promise<User | null> | null = null;

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,
  isSaving: false,
  error: null,
  setProfile: (profile) => set({ profile }),
  fetchProfile: async () => {
    if (profileRequest) return profileRequest;
    set({ isLoading: true, error: null });
    profileRequest = authApi.getProfile()
      .then((profile) => {
        set({ profile, isLoading: false });
        return profile;
      })
      .catch((error) => {
        set({ isLoading: false, error: getApiErrorMessage(error, 'Profile is unavailable. Pull to retry.') });
        return null;
      })
      .finally(() => { profileRequest = null; });
    return profileRequest;
  },
  updateProfile: async (input) => {
    set({ isSaving: true, error: null });
    try {
      const profile = await authApi.updateProfile(input);
      set({ profile, isSaving: false });
      return profile;
    } catch (error) {
      set({ isSaving: false, error: getApiErrorMessage(error, 'Unable to save your profile. Please retry.') });
      return null;
    }
  },
  clearError: () => set({ error: null }),
}));
