import { apiClient } from './apiClient';
import { ThreatItem } from '@/types';

export const threatApi = {
  getThreats: () => apiClient.get<ThreatItem[]>('/threats'),
  getThreatById: (id: string) => apiClient.get<ThreatItem>(`/threats/${id}`),
};
