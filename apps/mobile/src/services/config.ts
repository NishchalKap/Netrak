export const API_URL = validateApiUrl(process.env.EXPO_PUBLIC_API_URL);
export const TIMEOUT = boundedInteger(process.env.EXPO_PUBLIC_API_TIMEOUT, 10_000, 1_000, 60_000);
export const RETRY_ATTEMPTS = boundedInteger(process.env.EXPO_PUBLIC_API_RETRY_ATTEMPTS, 2, 0, 5);

function validateApiUrl(value: string | undefined) {
  if (!value?.trim()) {
    throw new Error('EXPO_PUBLIC_API_URL is required. Set it in apps/mobile/.env.');
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('EXPO_PUBLIC_API_URL must be a valid absolute URL.');
  }
  const isLoopback = ['localhost', '127.0.0.1', '::1'].includes(url.hostname);
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:' && !isLoopback) {
    throw new Error('EXPO_PUBLIC_API_URL must use HTTPS outside local development.');
  }
  return url.toString().replace(/\/$/, '');
}

function boundedInteger(value: string | undefined, fallback: number, minimum: number, maximum: number) {
  const parsed = value === undefined ? fallback : Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(`Invalid public client configuration. Expected an integer between ${minimum} and ${maximum}.`);
  }
  return parsed;
}
