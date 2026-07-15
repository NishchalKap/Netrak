import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { threatApi } from '@/services/threatApi';
import { preferencesStorage } from '@/services/preferencesStorage';
import { getApiErrorMessage } from '@/services/apiError';
import { ThreatItem } from '@/types';

type DataSource = 'idle' | 'online' | 'cached';

interface ThreatState {
  threats: ThreatItem[];
  isLoading: boolean;
  error: string | null;
  lastSyncedAt: string | null;
  source: DataSource;
  fetchThreats: (force?: boolean) => Promise<ThreatItem[]>;
}

let activeRequest: Promise<ThreatItem[]> | null = null;
const THREATS_TTL_MS = 60000;

export const useThreatStore = create<ThreatState>()(
  persist(
    (set, get) => ({
      threats: [],
      isLoading: false,
      error: null,
      lastSyncedAt: null,
      source: 'idle',
      fetchThreats: async (force = false) => {
        if (activeRequest) return activeRequest;
        const { threats, lastSyncedAt } = get();
        if (!force && threats.length && isFresh(lastSyncedAt, THREATS_TTL_MS)) return threats;
        set({ isLoading: true, error: null });
        activeRequest = threatApi.getThreats()
          .then((threats) => {
            const normalized = threats.map(normalizeThreat);
            set({ threats: normalized, isLoading: false, source: 'online', lastSyncedAt: new Date().toISOString() });
            return normalized;
          })
          .catch((error) => {
            const cached = get().threats;
            set({ isLoading: false, source: cached.length ? 'cached' : 'idle', error: getApiErrorMessage(error, 'Threat intelligence is unavailable. Pull to retry.') });
            return cached;
          })
          .finally(() => { activeRequest = null; });
        return activeRequest;
      },
    }),
    {
      name: 'threat-cache',
      storage: createJSONStorage(() => preferencesStorage),
      partialize: ({ threats, lastSyncedAt }) => ({ threats, lastSyncedAt, source: threats.length ? 'cached' : 'idle' }),
    }
  )
);

function normalizeThreat(threat: ThreatItem): ThreatItem {
  return {
    ...threat,
    indicators: Array.isArray(threat.indicators) ? threat.indicators : [],
    updatedAt: threat.updatedAt ?? new Date().toISOString(),
  };
}

function isFresh(timestamp: string | null, ttl: number) {
  return Boolean(timestamp && Date.now() - new Date(timestamp).getTime() < ttl);
}
