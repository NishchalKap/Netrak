import { create } from 'axios';
import { API_URL, TIMEOUT } from './config';

export const axiosInstance = create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});
