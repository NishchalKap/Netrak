import { apiClient } from './apiClient';

export const caseApi = {
  getCases: () => apiClient.get('/cases'),
  getCaseById: (id: string) => apiClient.get(`/cases/${id}`),
  createCase: (data: any) => apiClient.post('/cases', data),
  updateCase: (id: string, data: any) => apiClient.patch(`/cases/${id}`, data),
  deleteCase: (id: string) => apiClient.delete(`/cases/${id}`),
};
