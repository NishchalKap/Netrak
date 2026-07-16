import axios, { AxiosError, CanceledError, InternalAxiosRequestConfig, create, isAxiosError } from 'axios';
import type { ApiEnvelope } from '@/types';
import { API_RETRY_ATTEMPTS, API_TIMEOUT, API_URL } from './config';

const TOKEN_KEY = 'netrak.operations.token';

interface RetryConfig extends InternalAxiosRequestConfig {
  _authRetried?: boolean;
  _retryCount?: number;
}

interface ErrorPayload {
  message?: string;
  errors?: { message?: string }[];
}

interface RequestOptions {
  params?: Record<string, unknown>;
  signal?: AbortSignal;
}

export const tokenStorage = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (token: string) => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  },
};

const client = create({ baseURL: API_URL, timeout: API_TIMEOUT, headers: { 'Content-Type': 'application/json' } });
const refreshClient = axios.create({ baseURL: API_URL, timeout: API_TIMEOUT, headers: { 'Content-Type': 'application/json' } });
let refreshPromise: Promise<string | null> | null = null;

client.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryConfig | undefined;
    if (!request) return Promise.reject(error);
    if (error.code === 'ERR_CANCELED' || request.signal?.aborted) return Promise.reject(error);

    if (error.response?.status === 401 && !request._authRetried && !request.url?.includes('/auth/refresh')) {
      request._authRetried = true;
      try {
        refreshPromise ??= refreshToken();
        const token = await refreshPromise;
        refreshPromise = null;
        if (!token) throw error;
        request.headers.Authorization = `Bearer ${token}`;
        return client(request);
      } catch (refreshError) {
        refreshPromise = null;
        tokenStorage.clear();
        window.dispatchEvent(new Event('netrak:session-expired'));
        return Promise.reject(refreshError);
      }
    }

    const method = request.method?.toLowerCase() ?? 'get';
    const retryable = ['get', 'head', 'options', 'put'].includes(method) && (!error.response || error.response.status >= 500);
    const retryCount = request._retryCount ?? 0;
    if (retryable && retryCount < API_RETRY_ATTEMPTS) {
      request._retryCount = retryCount + 1;
      await delay(300 * 2 ** retryCount, request.signal);
      return client(request);
    }
    return Promise.reject(error);
  }
);

async function refreshToken() {
  const token = tokenStorage.get();
  if (!token) return null;
  const response = await refreshClient.post<ApiEnvelope<{ token: string }> | { token: string }>('/auth/refresh', { token });
  const payload = unwrap(response.data);
  if (payload.token) tokenStorage.set(payload.token);
  return payload.token ?? null;
}

function unwrap<T>(payload: ApiEnvelope<T> | T): T {
  if (typeof payload === 'object' && payload !== null && 'status' in payload && 'data' in payload) return (payload as ApiEnvelope<T>).data;
  return payload as T;
}

export const api = {
  get: <T>(url: string, options: RequestOptions = {}) => client.get<ApiEnvelope<T> | T>(url, options).then((response) => unwrap(response.data)),
  post: <T, Body = unknown>(url: string, body?: Body) => client.post<ApiEnvelope<T> | T>(url, body).then((response) => unwrap(response.data)),
  patch: <T, Body = unknown>(url: string, body?: Body) => client.patch<ApiEnvelope<T> | T>(url, body).then((response) => unwrap(response.data)),
};

export function getErrorMessage(error: unknown, fallback = 'The request could not be completed.') {
  if (isAxiosError<ErrorPayload>(error)) {
    const validation = error.response?.data?.errors?.find((item) => item.message)?.message;
    if (validation) return validation;
    if (error.response?.data?.message) return error.response.data.message;
    if (error.code === 'ECONNABORTED') return 'The request timed out. Try again.';
    if (!error.response) return 'Netrak services are unreachable. Check the network and retry.';
  }
  return fallback;
}

export function isNetworkError(error: unknown) {
  return isAxiosError(error) && !error.response;
}

function delay(ms: number, signal?: InternalAxiosRequestConfig['signal']) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new CanceledError('Request cancelled'));
    const onAbort = () => {
      window.clearTimeout(timeout);
      reject(new CanceledError('Request cancelled'));
    };
    const timeout = window.setTimeout(() => {
      signal?.removeEventListener?.('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener?.('abort', onAbort, { once: true });
  });
}
