import { createApiClient, setAuthToken } from './client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshRequest,
  RefreshResponse,
} from '../../shared/types/api';

export async function loginUser(payload: LoginRequest): Promise<string> {
  const client = createApiClient();
  const response = await client.post<LoginResponse>('/auth/login', payload);
  const { token, user } = response.data.data;
  console.log(`User logged in successfully: ${user.email} (Role: ${user.role})`);
  return token;
}

export async function registerUser(payload: RegisterRequest): Promise<string> {
  const client = createApiClient();
  const response = await client.post<RegisterResponse>('/auth/register', payload);
  const { token, user } = response.data.data;
  console.log(`User registered successfully: ${user.email}`);
  return token;
}

export async function refreshToken(existingToken: string): Promise<string> {
  const client = createApiClient();
  const payload: RefreshRequest = { token: existingToken };
  const response = await client.post<RefreshResponse>('/auth/refresh', payload);
  return response.data.data.token;
}

export async function createAuthenticatedClient(token: string) {
  const client = createApiClient(token);
  setAuthToken(client, token);
  return client;
}
