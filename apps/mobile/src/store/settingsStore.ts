import { create } from 'zustand';
import { AppSettings } from '@/types';

interface SettingsState extends AppSettings {
  setLocationSharing: (enabled: boolean) => void;
  setVoiceAlerts: (enabled: boolean) => void;
  setEmergencyContact: (value: string) => void;
  setPreferredLanguage: (value: string) => void;
  setCompactMode: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  locationSharing: true,
  voiceAlerts: true,
  emergencyContact: '1930',
  preferredLanguage: 'English',
  compactMode: false,
  setLocationSharing: (locationSharing) => set({ locationSharing }),
  setVoiceAlerts: (voiceAlerts) => set({ voiceAlerts }),
  setEmergencyContact: (emergencyContact) => set({ emergencyContact }),
  setPreferredLanguage: (preferredLanguage) => set({ preferredLanguage }),
  setCompactMode: (compactMode) => set({ compactMode }),
}));
