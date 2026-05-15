import { ref, reactive } from 'vue';
import type { FormErrors, ParsedError } from '../types/errors';
import { parseApiError, getFieldError } from '../utils/errorHandler';

export const useFormErrors = () => {
  const globalError = ref<string | null>(null);
  const fieldErrors = reactive<FormErrors>({});

  const clearErrors = () => {
    globalError.value = null;
    Object.keys(fieldErrors).forEach((key) => {
      fieldErrors[key] = '';
    });
  };

  const clearFieldError = (fieldName: string) => {
    fieldErrors[fieldName] = '';
  };

  const setFieldErrors = (errors: FormErrors) => {
    Object.keys(errors).forEach((key) => {
      fieldErrors[key] = errors[key];
    });
  };

  const setGlobalError = (message: string) => {
    globalError.value = message;
  };

  const handleApiError = (error: unknown): ParsedError => {
    clearErrors();
    const parsedError = parseApiError(error);

    if (parsedError.field && parsedError.message) {
      fieldErrors[parsedError.field] = parsedError.message;
    } else {
      globalError.value = parsedError.message;
    }

    return parsedError;
  };

  const hasFieldErrors = (): boolean => {
    return Object.values(fieldErrors).some((error) => error !== '');
  };

  return {
    globalError,
    fieldErrors,
    clearErrors,
    clearFieldError,
    setFieldErrors,
    setGlobalError,
    handleApiError,
    hasFieldErrors,
  };
};
