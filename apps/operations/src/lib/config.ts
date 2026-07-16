const DEFAULT_API_URL = 'http://localhost:3000/api';

export const API_URL = validateApiUrl(import.meta.env.VITE_API_URL || DEFAULT_API_URL);
export const API_TIMEOUT = boundedInteger(import.meta.env.VITE_API_TIMEOUT, 10_000, 1_000, 60_000);
export const API_RETRY_ATTEMPTS = boundedInteger(import.meta.env.VITE_API_RETRY_ATTEMPTS, 2, 0, 5);
export const POLL_INTERVAL = boundedInteger(import.meta.env.VITE_POLL_INTERVAL, 60_000, 15_000, 15 * 60_000);

function validateApiUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('VITE_API_URL must be a valid absolute URL.');
  }
  const isLoopback = ['localhost', '127.0.0.1', '::1'].includes(url.hostname);
  if (import.meta.env.PROD && url.protocol !== 'https:' && !isLoopback) {
    throw new Error('VITE_API_URL must use HTTPS outside local development.');
  }
  return url.toString().replace(/\/$/, '');
}

function boundedInteger(value: unknown, fallback: number, minimum: number, maximum: number) {
  const parsed = value === undefined ? fallback : Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(`Invalid operations configuration. Expected an integer between ${minimum} and ${maximum}.`);
  }
  return parsed;
}
