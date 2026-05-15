import { ref, watch } from 'vue';
import type { FormErrors } from '../types/errors';

export interface ValidationFunction {
  (value: string): string;
}

export interface FieldValidator {
  [fieldName: string]: ValidationFunction;
}

export const useRealtimeValidation = (
  formData: Record<string, any>,
  fieldValidators: FieldValidator,
  options: { debounceMs?: number; validateOnMount?: boolean } = {}
) => {
  const { debounceMs = 300, validateOnMount = false } = options;

  const fieldErrors = ref<FormErrors>({});
  const touchedFields = ref<Set<string>>(new Set());
  const isValidating = ref(false);

  const validateField = (fieldName: string, value: string): string => {
    const validator = fieldValidators[fieldName];
    if (!validator) return '';

    return validator(value);
  };

  const validateSingleField = (fieldName: string) => {
    if (!touchedFields.value.has(fieldName) && !validateOnMount) {
      return;
    }

    const value = formData[fieldName];
    const error = validateField(fieldName, value);
    fieldErrors.value[fieldName] = error;
  };

  const validateAllFields = (): FormErrors => {
    const errors: FormErrors = {};

    Object.keys(fieldValidators).forEach((fieldName) => {
      const value = formData[fieldName];
      const error = validateField(fieldName, value);
      errors[fieldName] = error;
      fieldErrors.value[fieldName] = error;
    });

    Object.keys(fieldValidators).forEach((fieldName) => {
      touchedFields.value.add(fieldName);
    });

    return errors;
  };

  const markFieldAsTouched = (fieldName: string) => {
    touchedFields.value.add(fieldName);
  };

  const clearFieldError = (fieldName: string) => {
    fieldErrors.value[fieldName] = '';
  };

  const clearAllErrors = () => {
    Object.keys(fieldErrors.value).forEach((key) => {
      fieldErrors.value[key] = '';
    });
  };

  const resetTouchedFields = () => {
    touchedFields.value.clear();
  };

  const hasErrors = (): boolean => {
    return Object.values(fieldErrors.value).some((error) => error !== '');
  };

  const setupWatchers = () => {
    Object.keys(fieldValidators).forEach((fieldName) => {
      let debounceTimer: NodeJS.Timeout | null = null;

      watch(
        () => formData[fieldName],
        (newValue) => {
          if (!touchedFields.value.has(fieldName)) {
            return;
          }

          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }

          isValidating.value = true;

          debounceTimer = setTimeout(() => {
            validateSingleField(fieldName);
            isValidating.value = false;
          }, debounceMs);
        }
      );
    });
  };

  setupWatchers();

  if (validateOnMount) {
    Object.keys(fieldValidators).forEach((fieldName) => {
      touchedFields.value.add(fieldName);
    });
  }

  return {
    fieldErrors,
    touchedFields,
    isValidating,
    validateField,
    validateSingleField,
    validateAllFields,
    markFieldAsTouched,
    clearFieldError,
    clearAllErrors,
    resetTouchedFields,
    hasErrors,
  };
};
