import { AxiosError } from 'axios';
import { MESSAGES } from '../constants/config';

export interface ApiErrorResponse {
  message?: string;
  status?: number;
}

const isApiErrorResponse = (data: unknown): data is ApiErrorResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    ('message' in data || 'status' in data)
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
      const data = error.response.data;
      if (isApiErrorResponse(data) && data.message) {
        return data.message;
      }
      return MESSAGES.AUTH.INVALID_CREDENTIALS;
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
