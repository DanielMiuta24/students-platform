import { computed } from 'vue';
import { USER_VALIDATION, PasswordStrength, type PasswordValidation } from '../types/user';

export function usePasswordValidation(password: string): PasswordValidation {
  const errors: string[] = [];
  let strength = PasswordStrength.WEAK;

  // Check length
  if (password.length < USER_VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${USER_VALIDATION.PASSWORD_MIN_LENGTH} characters`);
  }

  if (password.length > USER_VALIDATION.PASSWORD_MAX_LENGTH) {
    errors.push(`Password must not exceed ${USER_VALIDATION.PASSWORD_MAX_LENGTH} characters`);
  }

  // Check for various character types
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }

  // Calculate strength
  if (password.length >= USER_VALIDATION.PASSWORD_MIN_LENGTH) {
    let strengthScore = 0;

    if (hasUpperCase) strengthScore++;
    if (hasLowerCase) strengthScore++;
    if (hasNumbers) strengthScore++;
    if (hasSpecialChar) strengthScore++;
    if (password.length >= 12) strengthScore++;

    if (strengthScore >= 4) {
      strength = PasswordStrength.STRONG;
    } else if (strengthScore >= 2) {
      strength = PasswordStrength.MEDIUM;
    }
  }

  return {
    isValid: errors.length === 0 && password.length >= USER_VALIDATION.PASSWORD_MIN_LENGTH,
    strength,
    errors,
  };
}

export function usePasswordMatch(password: string, confirmPassword: string): { matches: boolean; error: string } {
  if (!confirmPassword) {
    return { matches: false, error: '' };
  }

  if (password !== confirmPassword) {
    return { matches: false, error: 'Passwords do not match' };
  }

  return { matches: true, error: '' };
}
