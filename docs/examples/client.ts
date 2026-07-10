import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiError } from '../../shared/types/api';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';
const API_TIMEOUT = Number(process.env.EXPO_PUBLIC_API_TIMEOUT ?? 10000);
const MAX_RETRIES = Number(process.env.EXPO_PUBLIC_API_RETRY_ATTEMPTS ?? 2);

function isRetryable(error: AxiosError): boolean {
  if (!error.response) return true;
  const status = error.response.status;
  return status >= 500 || status === 429;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createApiClient(token?: string): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
      const config = error.config as (typeof error.config & { __retryCount?: number }) | undefined;
      if (!config) throw error;

      config.__retryCount = config.__retryCount ?? 0;
      if (config.__retryCount < MAX_RETRIES && isRetryable(error)) {
        config.__retryCount += 1;
        await sleep(300 * config.__retryCount);
        return client.request(config);
      }

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  );

  return client;
}

export function setAuthToken(client: AxiosInstance, token: string): void {
  client.defaults.headers.common.Authorization = `Bearer ${token}`;
}
