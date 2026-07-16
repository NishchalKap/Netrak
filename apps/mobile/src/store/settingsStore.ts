import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AppSettings } from '@/types';
import { preferencesStorage } from '@/services/preferencesStorage';

interface SettingsState extends AppSettings {
  setEmergencyContact: (value: string) => void;
  setReduceMotion: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      emergencyContact: '1930',
      reduceMotion: false,
      setEmergencyContact: (emergencyContact) => set({ emergencyContact }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => preferencesStorage),
      partialize: ({ emergencyContact, reduceMotion }) => ({
        emergencyContact,
        reduceMotion,
      }),
    }
  )
);
