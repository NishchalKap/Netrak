import { axiosInstance } from './axios';
import './interceptors';
import { ApiEnvelope } from '@/types';

export const apiClient = {
  get: <T>(url: string, params?: Record<string, unknown>): Promise<T> =>
    axiosInstance.get<ApiEnvelope<T> | T>(url, { params }).then((res) => unwrapResponse(res.data)),
  post: <T, TBody = unknown>(url: string, data?: TBody): Promise<T> =>
    axiosInstance.post<ApiEnvelope<T> | T>(url, data).then((res) => unwrapResponse(res.data)),
  patch: <T, TBody = unknown>(url: string, data?: TBody): Promise<T> =>
    axiosInstance.patch<ApiEnvelope<T> | T>(url, data).then((res) => unwrapResponse(res.data)),
  delete: <T>(url: string): Promise<T> =>
    axiosInstance.delete<ApiEnvelope<T> | T>(url).then((res) => unwrapResponse(res.data)),
};

function unwrapResponse<T>(payload: ApiEnvelope<T> | T): T {
  if (isApiEnvelope(payload)) {
    return payload.data;
  }

  return payload;
}

function isApiEnvelope<T>(payload: ApiEnvelope<T> | T): payload is ApiEnvelope<T> {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'status' in payload &&
    'message' in payload &&
    'data' in payload
  );
}
