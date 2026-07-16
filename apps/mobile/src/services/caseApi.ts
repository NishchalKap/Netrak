import { apiClient } from './apiClient';
import { Case, CreateCaseInput, Evidence } from '@/types';

export const caseApi = {
  getCases: () => apiClient.get<Case[]>('/cases'),
  getCaseById: (id: string) => apiClient.get<Case>(`/cases/${id}`),
  createCase: (data: CreateCaseInput) => apiClient.post<Case, CreateCaseInput>('/cases', data),
  deleteCase: (id: string) => apiClient.delete<null>(`/cases/${id}`),
  addEvidence: (id: string, data: Omit<Evidence, 'id' | 'createdAt'>) => apiClient.post<Evidence, Omit<Evidence, 'id' | 'createdAt'>>(`/cases/${id}/evidence`, data),
};
