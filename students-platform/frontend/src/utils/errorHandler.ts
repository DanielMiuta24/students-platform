import { AxiosError } from 'axios';
import type { ApiErrorResponse, ParsedError, AuthErrorType } from '../types/errors';

export const parseApiError = (error: unknown): ParsedError => {
  if (!error) {
    return {
      type: 'UNKNOWN_ERROR' as AuthErrorType,
      message: 'An unknown error occurred',
    };
  }

  const axiosError = error as AxiosError<ApiErrorResponse>;

  if (!axiosError.response) {
    if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
      return {
        type: 'TIMEOUT' as AuthErrorType,
        message: 'Request timeout. Please check your connection and try again.',
      };
    }

    if (axiosError.message === 'Network Error') {
      return {
        type: 'NETWORK_ERROR' as AuthErrorType,
        message: 'Unable to connect to server. Please check your internet connection.',
      };
    }

    return {
      type: 'NETWORK_ERROR' as AuthErrorType,
      message: 'Unable to connect to server. Please try again later.',
    };
  }

  const statusCode = axiosError.response.status;
  const responseData = axiosError.response.data;
  const message = responseData?.message || 'An error occurred';
  const field = responseData?.field;

  switch (statusCode) {
    case 400:
      return {
        type: 'VALIDATION_ERROR' as AuthErrorType,
        message,
        field,
        statusCode,
      };
    case 401:
      return {
        type: 'AUTHENTICATION_ERROR' as AuthErrorType,
        message,
        statusCode,
      };
    case 403:
      return {
        type: 'AUTHORIZATION_ERROR' as AuthErrorType,
        message,
        statusCode,
      };
    case 409:
      return {
        type: 'VALIDATION_ERROR' as AuthErrorType,
        message,
        field,
        statusCode,
      };
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        type: 'SERVER_ERROR' as AuthErrorType,
        message: 'Server error. Please try again later.',
        statusCode,
      };
    default:
      return {
        type: 'UNKNOWN_ERROR' as AuthErrorType,
        message,
        statusCode,
      };
  }
};

export const getFieldError = (error: ParsedError, fieldName: string): string => {
  if (error.field === fieldName) {
    return error.message;
  }
  return '';
};

export const shouldRetry = (error: ParsedError): boolean => {
  return error.type === 'TIMEOUT' || error.type === 'NETWORK_ERROR';
};
