/**
 * User profile and account management types
 */

import type { SafeUser } from './auth';

export interface UpdateProfilePayload {
  name: string;
  bio: string;
  location: string;
  avatar?: File;
  removeAvatar?: boolean;
}

export interface UpdateProfileResponse {
  user: SafeUser;
  message: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

/**
 * Validation constraints for user profile
 */
export const USER_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 160,
  LOCATION_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
} as const;

/**
 * Password strength levels
 */
export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong',
}

export interface PasswordValidation {
  isValid: boolean;
  strength: PasswordStrength;
  errors: string[];
}
