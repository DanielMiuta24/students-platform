import type { FormErrors } from '../types/errors';
import type { RegisterForm, LoginForm } from '../types/auth';

const EMAIL_MAX_LENGTH = 255;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

export interface ValidationRule {
  validate: () => boolean;
  message: string;
}

export const validateEmail = (email: string): string => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Must be a valid email address';
  }

  if (email.length > EMAIL_MAX_LENGTH) {
    return `Email must not exceed ${EMAIL_MAX_LENGTH} characters`;
  }

  return '';
};

export const validatePassword = (password: string): string => {
  if (!password || password.trim() === '') {
    return 'Password is required';
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`;
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must not exceed ${PASSWORD_MAX_LENGTH} characters`;
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }

  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }

  return '';
};

export const validateName = (name: string): string => {
  if (!name || name.trim() === '') {
    return 'Name is required';
  }

  const trimmedName = name.trim();

  if (trimmedName.length < NAME_MIN_LENGTH) {
    return `Name must be at least ${NAME_MIN_LENGTH} characters`;
  }

  if (trimmedName.length > NAME_MAX_LENGTH) {
    return `Name must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters`;
  }

  return '';
};

export const validateUsername = (username: string): string => {
  if (!username || username.trim() === '') {
    return 'Username is required';
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    return `Username must be at least ${USERNAME_MIN_LENGTH} characters`;
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return `Username must not exceed ${USERNAME_MAX_LENGTH} characters`;
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }

  return '';
};

export const validateLoginForm = (form: LoginForm): FormErrors => {
  const errors: FormErrors = {};

  const emailError = validateEmail(form.email);
  if (emailError) {
    errors.email = emailError;
  }

  if (!form.password || form.password.trim() === '') {
    errors.password = 'Password is required';
  }

  return errors;
};

export const validateRegisterForm = (form: RegisterForm): FormErrors => {
  const errors: FormErrors = {};

  const nameError = validateName(form.name);
  if (nameError) {
    errors.name = nameError;
  }

  const usernameError = validateUsername(form.username);
  if (usernameError) {
    errors.username = usernameError;
  }

  const emailError = validateEmail(form.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(form.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};

export const hasErrors = (errors: FormErrors): boolean => {
  return Object.values(errors).some((error) => error !== '');
};
