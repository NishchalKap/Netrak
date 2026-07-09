import { axiosInstance } from './axios';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../store/authStore';

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const token = await SecureStore.getItemAsync('token');
        const res = await axiosInstance.post('/auth/refresh', { token });
        const nextToken = res?.data?.data?.token ?? res?.data?.token;

        if (nextToken) {
          await SecureStore.setItemAsync('token', nextToken);
          originalRequest.headers.Authorization = `Bearer ${nextToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (e) {
        useAuthStore.getState().logout();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);
