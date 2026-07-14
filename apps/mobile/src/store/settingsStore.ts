import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AppSettings } from '@/types';
import { preferencesStorage } from '@/services/preferencesStorage';

interface SettingsState extends AppSettings {
  setLocationSharing: (enabled: boolean) => void;
  setVoiceAlerts: (enabled: boolean) => void;
  setCaseUpdateAlerts: (enabled: boolean) => void;
  setThreatAlerts: (enabled: boolean) => void;
  setEmergencyContact: (value: string) => void;
  setPreferredLanguage: (value: string) => void;
  setCompactMode: (enabled: boolean) => void;
  setReduceMotion: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      locationSharing: true,
      voiceAlerts: true,
      caseUpdateAlerts: true,
      threatAlerts: true,
      emergencyContact: '1930',
      preferredLanguage: 'English',
      compactMode: false,
      reduceMotion: false,
      setLocationSharing: (locationSharing) => set({ locationSharing }),
      setVoiceAlerts: (voiceAlerts) => set({ voiceAlerts }),
      setCaseUpdateAlerts: (caseUpdateAlerts) => set({ caseUpdateAlerts }),
      setThreatAlerts: (threatAlerts) => set({ threatAlerts }),
      setEmergencyContact: (emergencyContact) => set({ emergencyContact }),
      setPreferredLanguage: (preferredLanguage) => set({ preferredLanguage }),
      setCompactMode: (compactMode) => set({ compactMode }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => preferencesStorage),
      partialize: ({ locationSharing, voiceAlerts, caseUpdateAlerts, threatAlerts, emergencyContact, preferredLanguage, compactMode, reduceMotion }) => ({
        locationSharing,
        voiceAlerts,
        caseUpdateAlerts,
        threatAlerts,
        emergencyContact,
        preferredLanguage,
        compactMode,
        reduceMotion,
      }),
    }
  )
);
