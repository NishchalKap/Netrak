import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { preferencesStorage } from '@/services/preferencesStorage';

export type ThemeMode = 'system' | 'dark' | 'light';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => preferencesStorage),
      partialize: ({ mode }) => ({ mode }),
    }
  )
);
