import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../../shared/middleware/validation.middleware';
import { CATEGORY_VALIDATION } from '../constants';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const validateCreateCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: CATEGORY_VALIDATION.NAME_MAX_LENGTH })
    .withMessage(`Name must not exceed ${CATEGORY_VALIDATION.NAME_MAX_LENGTH} characters`),
  body('slug')
    .optional()
    .trim()
    .isLength({ max: CATEGORY_VALIDATION.SLUG_MAX_LENGTH })
    .withMessage(`Slug must not exceed ${CATEGORY_VALIDATION.SLUG_MAX_LENGTH} characters`)
    .matches(SLUG_REGEX).withMessage('Slug must be in kebab-case format'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: CATEGORY_VALIDATION.DESCRIPTION_MAX_LENGTH })
    .withMessage(`Description must not exceed ${CATEGORY_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: CATEGORY_VALIDATION.ICON_MAX_LENGTH })
    .withMessage(`Icon must not exceed ${CATEGORY_VALIDATION.ICON_MAX_LENGTH} characters`),
  body('order')
    .optional()
    .isInt().withMessage('Order must be a valid number'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
  handleValidationErrors,
];

export const validateUpdateCategory = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ max: CATEGORY_VALIDATION.NAME_MAX_LENGTH })
    .withMessage(`Name must not exceed ${CATEGORY_VALIDATION.NAME_MAX_LENGTH} characters`),
  body('slug')
    .optional()
    .trim()
    .notEmpty().withMessage('Slug cannot be empty')
    .isLength({ max: CATEGORY_VALIDATION.SLUG_MAX_LENGTH })
    .withMessage(`Slug must not exceed ${CATEGORY_VALIDATION.SLUG_MAX_LENGTH} characters`)
    .matches(SLUG_REGEX).withMessage('Slug must be in kebab-case format'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: CATEGORY_VALIDATION.DESCRIPTION_MAX_LENGTH })
    .withMessage(`Description must not exceed ${CATEGORY_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: CATEGORY_VALIDATION.ICON_MAX_LENGTH })
    .withMessage(`Icon must not exceed ${CATEGORY_VALIDATION.ICON_MAX_LENGTH} characters`),
  body('order')
    .optional()
    .isInt().withMessage('Order must be a valid number'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
  handleValidationErrors,
];

export const validateCategoryId = [
  param('id').isMongoId().withMessage('Invalid category ID'),
  handleValidationErrors,
];

export const validateCategorySlug = [
  param('slug').trim().notEmpty().withMessage('Slug is required'),
  handleValidationErrors,
];
