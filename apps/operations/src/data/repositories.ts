import { api } from '@/lib/apiClient';
import type { AuthResponse, CaseRecord, CaseStatus, Evidence, EvidenceType, HealthStatus, NotificationRecord, ThreatRecord, User } from '@/types';
import { FALLBACK_CASES, FALLBACK_NOTIFICATIONS, FALLBACK_THREATS } from './fallbackData';

let localCases = [...FALLBACK_CASES];

export const authRepository = {
  login: (email: string, password: string) => api.post<AuthResponse, { email: string; password: string }>('/auth/login', { email, password }),
  registerCitizen: (email: string, password: string) => api.post<AuthResponse, { email: string; password: string; role: 'CITIZEN' }>('/auth/register', { email, password, role: 'CITIZEN' }),
  profile: (signal?: AbortSignal) => api.get<User>('/auth/profile', { signal }),
  updateProfile: (data: { name?: string | null; phone?: string | null; district?: string | null }) => api.patch<User, typeof data>('/auth/profile', data),
};

export const caseRepository = {
  list: async (signal?: AbortSignal): Promise<CaseRecord[]> => {
    try {
      const data = await api.get<CaseRecord[]>('/cases', { signal });
      if (Array.isArray(data) && data.length > 0) return data;
      return localCases;
    } catch (error) {
      if (signal?.aborted) throw error;
      return localCases;
    }
  },
  detail: async (id: string, signal?: AbortSignal): Promise<CaseRecord> => {
    try {
      return await api.get<CaseRecord>(`/cases/${id}`, { signal });
    } catch (error) {
      if (signal?.aborted) throw error;
      const found = localCases.find((c) => c.id === id);
      if (found) return found;
      throw error;
    }
  },
  create: async (data: { title: string; description: string }): Promise<CaseRecord> => {
    try {
      return await api.post<CaseRecord, typeof data>('/cases', data);
    } catch {
      const newCase: CaseRecord = {
        id: `CASE-2026-${String(localCases.length + 1).padStart(3, '0')}`,
        title: data.title,
        description: data.description,
        status: 'OPEN',
        category: 'Citizen Report',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        evidence: [],
      };
      localCases = [newCase, ...localCases];
      return newCase;
    }
  },
  update: async (id: string, data: { title?: string; description?: string; status?: CaseStatus }): Promise<CaseRecord> => {
    try {
      return await api.patch<CaseRecord, typeof data>(`/cases/${id}`, data);
    } catch {
      const index = localCases.findIndex((c) => c.id === id);
      if (index !== -1) {
        localCases[index] = { ...localCases[index], ...data, updatedAt: new Date().toISOString() };
        return localCases[index];
      }
      throw new Error('Case not found');
    }
  },
  addEvidence: async (id: string, data: { type: EvidenceType; label: string; reference: string; notes?: string }): Promise<Evidence> => {
    try {
      return await api.post<Evidence, typeof data>(`/cases/${id}/evidence`, data);
    } catch {
      const index = localCases.findIndex((c) => c.id === id);
      const newEvidence: Evidence = {
        id: `EVD-${Math.floor(100 + Math.random() * 900)}`,
        type: data.type,
        label: data.label,
        reference: data.reference,
        notes: data.notes,
        createdAt: new Date().toISOString(),
      };
      if (index !== -1) {
        const updatedEv = [...(localCases[index].evidence ?? []), newEvidence];
        localCases[index] = { ...localCases[index], evidence: updatedEv, updatedAt: new Date().toISOString() };
      }
      return newEvidence;
    }
  },
};

const THREAT_CACHE_KEY = 'netrak.operations.threat-cache';
export const threatRepository = {
  list: async (signal?: AbortSignal) => {
    try {
      const items = await api.get<ThreatRecord[]>('/threats', { signal });
      if (Array.isArray(items) && items.length > 0) {
        localStorage.setItem(THREAT_CACHE_KEY, JSON.stringify({ items, syncedAt: new Date().toISOString() }));
        return { items, source: 'online' as const, syncedAt: new Date().toISOString() };
      }
      return { items: FALLBACK_THREATS, source: 'online' as const, syncedAt: new Date().toISOString() };
    } catch (error) {
      if (signal?.aborted) throw error;
      const cached = localStorage.getItem(THREAT_CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as { items: ThreatRecord[]; syncedAt: string };
          if (Array.isArray(parsed.items) && typeof parsed.syncedAt === 'string') return { ...parsed, source: 'cached' as const };
        } catch {
          localStorage.removeItem(THREAT_CACHE_KEY);
        }
      }
      return { items: FALLBACK_THREATS, source: 'cached' as const, syncedAt: new Date().toISOString() };
    }
  },
  detail: (id: string, signal?: AbortSignal) => api.get<ThreatRecord>(`/threats/${id}`, { signal }),
};

export const notificationRepository = {
  list: async (signal?: AbortSignal): Promise<NotificationRecord[]> => {
    try {
      const items = await api.get<NotificationRecord[]>('/notifications', { signal });
      if (Array.isArray(items) && items.length > 0) return items;
      return FALLBACK_NOTIFICATIONS;
    } catch (error) {
      if (signal?.aborted) throw error;
      return FALLBACK_NOTIFICATIONS;
    }
  },
};

export const systemRepository = {
  health: async (signal?: AbortSignal): Promise<HealthStatus> => {
    try {
      return await api.get<HealthStatus>('/health', { signal });
    } catch {
      return { status: 'degraded' };
    }
  },
};
