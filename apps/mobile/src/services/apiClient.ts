import { axiosInstance } from './axios';
import './interceptors';

export const apiClient = {
  get: <T = any>(url: string, params?: any): Promise<T> => axiosInstance.get<T>(url, { params }).then((res) => res.data),
  post: <T = any>(url: string, data?: any): Promise<T> => axiosInstance.post<T>(url, data).then((res) => res.data),
  put: <T = any>(url: string, data?: any): Promise<T> => axiosInstance.put<T>(url, data).then((res) => res.data),
  patch: <T = any>(url: string, data?: any): Promise<T> => axiosInstance.patch<T>(url, data).then((res) => res.data),
  delete: <T = any>(url: string): Promise<T> => axiosInstance.delete<T>(url).then((res) => res.data),
};
