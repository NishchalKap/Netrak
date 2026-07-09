import axios from 'axios';
import { API_URL, TIMEOUT } from './config';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});
