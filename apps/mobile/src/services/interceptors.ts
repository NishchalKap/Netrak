import { AxiosError, InternalAxiosRequestConfig, create } from 'axios';
import { axiosInstance } from './axios';
import { API_URL, RETRY_ATTEMPTS, TIMEOUT } from './config';
import { tokenStorage } from './tokenStorage';
import { notifySessionExpired } from './sessionEvents';

interface RetryConfig extends InternalAxiosRequestConfig {
  _authRetried?: boolean;
  _retryCount?: number;
}

const refreshClient = create({ baseURL: API_URL, timeout: TIMEOUT, headers: { 'Content-Type': 'application/json' } });
let refreshPromise: Promise<string | null> | null = null;

axiosInstance.interceptors.request.use(async (config) => {
  const token = await tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryConfig | undefined;
    if (!request) return Promise.reject(error);

    if (error.response?.status === 401 && !request._authRetried && !request.url?.includes('/auth/refresh')) {
      request._authRetried = true;
      try {
        refreshPromise ??= refreshToken();
        const token = await refreshPromise;
        refreshPromise = null;
        if (!token) throw error;
        request.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(request);
      } catch (refreshError) {
        refreshPromise = null;
        await tokenStorage.remove();
        notifySessionExpired();
        return Promise.reject(refreshError);
      }
    }

    const method = request.method?.toLowerCase() ?? 'get';
    const retryableMethod = ['get', 'head', 'options', 'put'].includes(method);
    const retryable = retryableMethod && (!error.response || error.response.status >= 500);
    const retryCount = request._retryCount ?? 0;
    if (retryable && retryCount < RETRY_ATTEMPTS) {
      request._retryCount = retryCount + 1;
      await delay(300 * 2 ** retryCount);
      return axiosInstance(request);
    }

    return Promise.reject(error);
  }
);

async function refreshToken() {
  const token = await tokenStorage.get();
  if (!token) return null;
  const response = await refreshClient.post('/auth/refresh', { token });
  const nextToken = response.data?.data?.token ?? response.data?.token ?? null;
  if (nextToken) await tokenStorage.set(nextToken);
  return nextToken;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
