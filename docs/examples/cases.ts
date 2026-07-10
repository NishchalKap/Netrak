import { createApiClient } from './client';
import {
  Case,
  GetCasesResponse,
  CaseCreateRequest,
  CaseCreateResponse,
  GetCaseByIdResponse,
  CaseUpdateRequest,
  CaseUpdateResponse,
  EvidenceCreateRequest,
  EvidenceCreateResponse,
  Evidence,
  ApiResponse,
} from '../../shared/types/api';

export async function fetchCases(token: string): Promise<Case[]> {
  const client = createApiClient(token);
  const response = await client.get<GetCasesResponse>('/cases');
  return response.data.data;
}

export async function createCase(token: string, payload: CaseCreateRequest): Promise<Case> {
  const client = createApiClient(token);
  const response = await client.post<CaseCreateResponse>('/cases', payload);
  return response.data.data;
}

export async function fetchCaseById(token: string, id: string): Promise<Case> {
  const client = createApiClient(token);
  const response = await client.get<GetCaseByIdResponse>(`/cases/${id}`);
  return response.data.data;
}

export async function updateCase(token: string, id: string, payload: CaseUpdateRequest): Promise<Case> {
  const client = createApiClient(token);
  const response = await client.patch<CaseUpdateResponse>(`/cases/${id}`, payload);
  return response.data.data;
}

export async function deleteCase(token: string, id: string): Promise<void> {
  const client = createApiClient(token);
  await client.delete<ApiResponse<null>>(`/cases/${id}`);
}

export async function uploadEvidence(
  token: string,
  caseId: string,
  payload: EvidenceCreateRequest
): Promise<Evidence> {
  const client = createApiClient(token);
  const response = await client.post<EvidenceCreateResponse>(`/cases/${caseId}/evidence`, payload);
  return response.data.data;
}
