import { apiClient } from './apiClient';
import { AuthResponse, User, UserRole } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  role?: UserRole;
}

export const authApi = {
  login: (data: LoginPayload) => apiClient.post<AuthResponse, LoginPayload>('/auth/login', data),
  register: (data: RegisterPayload) => apiClient.post<AuthResponse, RegisterPayload>('/auth/register', data),
  getProfile: () => apiClient.get<User>('/auth/profile'),
};
