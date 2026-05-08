import { body } from 'express-validator';
import { handleValidationErrors } from '../../../shared/middleware/validation.middleware';
import { USER_VALIDATION, PASSWORD_REQUIREMENTS } from '../constants';

/**
 * Custom password validator
 */
const validatePasswordStrength = (password: string): boolean => {
  const errors: string[] = [];

  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters long`);
  }

  if (password.length > PASSWORD_REQUIREMENTS.MAX_LENGTH) {
    errors.push(`Password must not exceed ${PASSWORD_REQUIREMENTS.MAX_LENGTH} characters`);
  }

  if (PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (PASSWORD_REQUIREMENTS.REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (PASSWORD_REQUIREMENTS.REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  if (errors.length > 0) {
    throw new Error(errors[0]);
  }

  return true;
};

/**
 * Validation rules for change password
 */
const validateCurrentPassword = () =>
  body('currentPassword')
    .trim()
    .notEmpty().withMessage('Current password is required')
    .isLength({ min: 1 }).withMessage('Current password is required');

const validateNewPassword = () =>
  body('newPassword')
    .trim()
    .notEmpty().withMessage('New password is required')
    .isLength({
      min: USER_VALIDATION.PASSWORD_MIN_LENGTH,
      max: USER_VALIDATION.PASSWORD_MAX_LENGTH
    })
    .withMessage(`New password must be between ${USER_VALIDATION.PASSWORD_MIN_LENGTH} and ${USER_VALIDATION.PASSWORD_MAX_LENGTH} characters`)
    .custom(validatePasswordStrength);

const validateConfirmPassword = () =>
  body('confirmPassword')
    .trim()
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New password and confirm password do not match');
      }
      return true;
    });

const validatePasswordsNotSame = () =>
  body('newPassword')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    });

/**
 * Combined validation middleware for change password
 */
export const validateChangePassword = [
  validateCurrentPassword(),
  validateNewPassword(),
  validateConfirmPassword(),
  validatePasswordsNotSame(),
  handleValidationErrors,
];

/**
 * Validation rules for user registration
 */
const validateName = () =>
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({
      min: USER_VALIDATION.NAME_MIN_LENGTH,
      max: USER_VALIDATION.NAME_MAX_LENGTH
    })
    .withMessage(`Name must be between ${USER_VALIDATION.NAME_MIN_LENGTH} and ${USER_VALIDATION.NAME_MAX_LENGTH} characters`);

const validateUsername = () =>
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({
      min: USER_VALIDATION.USERNAME_MIN_LENGTH,
      max: USER_VALIDATION.USERNAME_MAX_LENGTH
    })
    .withMessage(`Username must be between ${USER_VALIDATION.USERNAME_MIN_LENGTH} and ${USER_VALIDATION.USERNAME_MAX_LENGTH} characters`)
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores');

const validateEmail = () =>
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .isLength({ max: USER_VALIDATION.EMAIL_MAX_LENGTH })
    .withMessage(`Email must not exceed ${USER_VALIDATION.EMAIL_MAX_LENGTH} characters`)
    .normalizeEmail();

const validatePassword = () =>
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({
      min: USER_VALIDATION.PASSWORD_MIN_LENGTH,
      max: USER_VALIDATION.PASSWORD_MAX_LENGTH
    })
    .withMessage(`Password must be between ${USER_VALIDATION.PASSWORD_MIN_LENGTH} and ${USER_VALIDATION.PASSWORD_MAX_LENGTH} characters`)
    .custom(validatePasswordStrength);

const validateUserType = () =>
  body('type')
    .optional()
    .isIn(['Student', 'StudySeeker', 'Admin'])
    .withMessage('User type must be Student, StudySeeker, or Admin');

/**
 * Combined validation middleware for user registration
 */
export const validateRegister = [
  validateUserType(),
  validateName(),
  validateUsername(),
  validateEmail(),
  validatePassword(),
  handleValidationErrors,
];

/**
 * Combined validation middleware for user login
 */
export const validateLogin = [
  validateEmail(),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

/**
 * Validation rules for update profile
 */
const validateOptionalName = () =>
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({
      min: USER_VALIDATION.NAME_MIN_LENGTH,
      max: USER_VALIDATION.NAME_MAX_LENGTH
    })
    .withMessage(`Name must be between ${USER_VALIDATION.NAME_MIN_LENGTH} and ${USER_VALIDATION.NAME_MAX_LENGTH} characters`);

const validateOptionalBio = () =>
  body('bio')
    .optional()
    .isLength({ max: USER_VALIDATION.BIO_MAX_LENGTH })
    .withMessage(`Bio must not exceed ${USER_VALIDATION.BIO_MAX_LENGTH} characters`);

const validateOptionalLocation = () =>
  body('location')
    .optional()
    .isLength({ max: USER_VALIDATION.LOCATION_MAX_LENGTH })
    .withMessage(`Location must not exceed ${USER_VALIDATION.LOCATION_MAX_LENGTH} characters`);

/**
 * Combined validation middleware for update profile
 */
export const validateUpdateProfile = [
  validateOptionalName(),
  validateOptionalBio(),
  validateOptionalLocation(),
  handleValidationErrors,
];
