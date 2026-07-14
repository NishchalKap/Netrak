import { isAxiosError } from 'axios';

interface ApiErrorPayload {
  message?: string;
  errors?: { field?: string; message?: string }[];
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<ApiErrorPayload>(error)) {
    const fieldMessage = error.response?.data?.errors?.find((item) => item.message)?.message;
    return fieldMessage ?? error.response?.data?.message ?? (error.code === 'ECONNABORTED' ? 'The request timed out. Please try again.' : fallback);
  }
  return error instanceof Error ? error.message : fallback;
}

export function isNetworkError(error: unknown) {
  return isAxiosError(error) && !error.response;
}
