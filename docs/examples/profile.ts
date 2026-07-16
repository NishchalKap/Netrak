import { createApiClient } from './client';
import {
  User,
  GetProfileResponse,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
} from '../../shared/types/api';

export async function fetchProfile(token: string): Promise<User> {
  const client = createApiClient(token);
  const response = await client.get<GetProfileResponse>('/auth/profile');
  return response.data.data;
}

export async function updateProfile(token: string, payload: ProfileUpdateRequest): Promise<User> {
  const client = createApiClient(token);
  const response = await client.patch<ProfileUpdateResponse>('/auth/profile', payload);
  return response.data.data;
}
