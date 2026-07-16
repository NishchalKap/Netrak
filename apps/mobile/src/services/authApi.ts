import { apiClient } from './apiClient';
import { AuthResponse, User, UserRole } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  role?: UserRole;
}

export type ProfileUpdatePayload = { name?: string | null; phone?: string | null; district?: string | null };

export const authApi = {
  login: (data: LoginPayload) => apiClient.post<AuthResponse, LoginPayload>('/auth/login', data),
  register: (data: RegisterPayload) => apiClient.post<AuthResponse, RegisterPayload>('/auth/register', data),
  refresh: (token: string) => apiClient.post<{ token: string }, { token: string }>('/auth/refresh', { token }),
  getProfile: () => apiClient.get<User>('/auth/profile'),
  updateProfile: (data: ProfileUpdatePayload) => apiClient.patch<User, ProfileUpdatePayload>('/auth/profile', data),
};
