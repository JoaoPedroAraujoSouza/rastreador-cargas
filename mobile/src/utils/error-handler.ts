import { AxiosError } from 'axios';
import { MESSAGES } from '../constants/config';

export interface ApiErrorResponse {
  error?: string;
  messages?: string[];
  message?: string;
  status?: number;
}

const isApiErrorResponse = (data: unknown): data is ApiErrorResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    ('messages' in data || 'message' in data || 'error' in data)
  );
};

const hasIsAxiosError = (error: unknown): error is { isAxiosError: boolean } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error
  );
};

export const isAxiosError = (error: unknown): error is AxiosError => {
  return hasIsAxiosError(error) && error.isAxiosError === true;
};

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response;

      if (isApiErrorResponse(data)) {
        if (data.messages && data.messages.length > 0) return data.messages[0];
        if (data.message) return data.message;
      }

      if (status === 401 || status === 403) return MESSAGES.AUTH.INVALID_CREDENTIALS;
      return MESSAGES.AUTH.UNEXPECTED_ERROR;
    }
    if (error.request) {
      return MESSAGES.AUTH.CONNECTION_ERROR;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return MESSAGES.AUTH.UNEXPECTED_ERROR;
};
