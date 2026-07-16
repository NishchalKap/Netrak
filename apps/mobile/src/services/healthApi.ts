import { apiClient } from './apiClient';

export interface HealthStatus {
  status: string;
}

export const healthApi = {
  check: () => apiClient.get<HealthStatus>('/health'),
};
