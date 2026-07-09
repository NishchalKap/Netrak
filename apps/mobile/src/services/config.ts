export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
export const TIMEOUT = Number(process.env.EXPO_PUBLIC_API_TIMEOUT || '10000');
export const RETRY_ATTEMPTS = Number(process.env.EXPO_PUBLIC_API_RETRY_ATTEMPTS || '2');
