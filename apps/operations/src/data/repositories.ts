import { api } from '@/lib/apiClient';
import type { AuthResponse, CaseRecord, CaseStatus, Evidence, EvidenceType, HealthStatus, NotificationRecord, ThreatRecord, User } from '@/types';

export const authRepository = {
  login: (email: string, password: string) => api.post<AuthResponse, { email: string; password: string }>('/auth/login', { email, password }),
  registerCitizen: (email: string, password: string) => api.post<AuthResponse, { email: string; password: string; role: 'CITIZEN' }>('/auth/register', { email, password, role: 'CITIZEN' }),
  profile: (signal?: AbortSignal) => api.get<User>('/auth/profile', { signal }),
  updateProfile: (data: { name?: string | null; phone?: string | null; district?: string | null }) => api.patch<User, typeof data>('/auth/profile', data),
};

export const caseRepository = {
  list: (signal?: AbortSignal) => api.get<CaseRecord[]>('/cases', { signal }),
  detail: (id: string, signal?: AbortSignal) => api.get<CaseRecord>(`/cases/${id}`, { signal }),
  create: (data: { title: string; description: string }) => api.post<CaseRecord, typeof data>('/cases', data),
  update: (id: string, data: { title?: string; description?: string; status?: CaseStatus }) => api.patch<CaseRecord, typeof data>(`/cases/${id}`, data),
  addEvidence: (id: string, data: { type: EvidenceType; label: string; reference: string; notes?: string }) => api.post<Evidence, typeof data>(`/cases/${id}/evidence`, data),
};

const THREAT_CACHE_KEY = 'netrak.operations.threat-cache';
export const threatRepository = {
  list: async (signal?: AbortSignal) => {
    try {
      const items = await api.get<ThreatRecord[]>('/threats', { signal });
      localStorage.setItem(THREAT_CACHE_KEY, JSON.stringify({ items, syncedAt: new Date().toISOString() }));
      return { items, source: 'online' as const, syncedAt: new Date().toISOString() };
    } catch (error) {
      if (signal?.aborted) throw error;
      const cached = localStorage.getItem(THREAT_CACHE_KEY);
      if (!cached) throw error;
      try {
        const parsed = JSON.parse(cached) as { items: ThreatRecord[]; syncedAt: string };
        if (!Array.isArray(parsed.items) || typeof parsed.syncedAt !== 'string') throw new Error('Invalid threat cache', { cause: error });
        return { ...parsed, source: 'cached' as const };
      } catch {
        localStorage.removeItem(THREAT_CACHE_KEY);
        throw error;
      }
    }
  },
  detail: (id: string, signal?: AbortSignal) => api.get<ThreatRecord>(`/threats/${id}`, { signal }),
};

export const notificationRepository = {
  list: (signal?: AbortSignal) => api.get<NotificationRecord[]>('/notifications', { signal }),
};

export const systemRepository = {
  health: (signal?: AbortSignal) => api.get<HealthStatus>('/health', { signal }),
};
