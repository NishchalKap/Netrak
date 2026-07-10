import { createApiClient } from './client';
import { Threat, GetThreatsResponse, GetThreatByIdResponse } from '../../shared/types/api';

export async function fetchThreats(): Promise<Threat[]> {
  const client = createApiClient();
  const response = await client.get<GetThreatsResponse>('/threats');
  return response.data.data;
}

export async function fetchThreatById(id: string): Promise<Threat> {
  const client = createApiClient();
  const response = await client.get<GetThreatByIdResponse>(`/threats/${id}`);
  return response.data.data;
}
