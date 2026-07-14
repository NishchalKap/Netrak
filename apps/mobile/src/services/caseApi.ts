import { apiClient } from './apiClient';
import { Case, CreateCaseInput, Evidence, UpdateCaseInput } from '@/types';

type BackendCreateCaseInput = Pick<CreateCaseInput, 'title' | 'description'>;

export const caseApi = {
  getCases: () => apiClient.get<Case[]>('/cases'),
  getCaseById: (id: string) => apiClient.get<Case>(`/cases/${id}`),
  createCase: (data: BackendCreateCaseInput) => apiClient.post<Case, BackendCreateCaseInput>('/cases', data),
  updateCase: (id: string, data: UpdateCaseInput) => apiClient.patch<Case, UpdateCaseInput>(`/cases/${id}`, data),
  deleteCase: (id: string) => apiClient.delete<null>(`/cases/${id}`),
  addEvidence: (id: string, data: Omit<Evidence, 'id' | 'createdAt'>) => apiClient.post<Evidence, Omit<Evidence, 'id' | 'createdAt'>>(`/cases/${id}/evidence`, data),
};
