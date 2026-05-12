import { body, param, query } from 'express-validator';
import { handleValidationErrors } from '../../../shared/middleware/validation.middleware';
import { COMMUNITY_VALIDATION } from '../constants';

const validateName = () =>
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({
      min: COMMUNITY_VALIDATION.NAME_MIN_LENGTH,
      max: COMMUNITY_VALIDATION.NAME_MAX_LENGTH
    })
    .withMessage(`Name must be between ${COMMUNITY_VALIDATION.NAME_MIN_LENGTH} and ${COMMUNITY_VALIDATION.NAME_MAX_LENGTH} characters`);

const validateDescription = () =>
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({
      min: COMMUNITY_VALIDATION.DESCRIPTION_MIN_LENGTH,
      max: COMMUNITY_VALIDATION.DESCRIPTION_MAX_LENGTH
    })
    .withMessage(`Description must be between ${COMMUNITY_VALIDATION.DESCRIPTION_MIN_LENGTH} and ${COMMUNITY_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`);

const validateCategory = () =>
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID');

const validateOptionalDescription = () =>
  body('description')
    .optional()
    .trim()
    .isLength({
      min: COMMUNITY_VALIDATION.DESCRIPTION_MIN_LENGTH,
      max: COMMUNITY_VALIDATION.DESCRIPTION_MAX_LENGTH
    })
    .withMessage(`Description must be between ${COMMUNITY_VALIDATION.DESCRIPTION_MIN_LENGTH} and ${COMMUNITY_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`);

const validateOptionalCategory = () =>
  body('category')
    .optional()
    .trim()
    .isMongoId().withMessage('Invalid category ID');

const validateIdParam = () =>
  param('id').isMongoId().withMessage('Invalid community ID');

export const validateCreateCommunity = [
  validateName(),
  validateDescription(),
  validateCategory(),
  handleValidationErrors,
];

export const validateUpdateCommunity = [
  validateName().optional(),
  validateOptionalDescription(),
  validateOptionalCategory(),
  handleValidationErrors,
];

export const validateCommunityId = [
  validateIdParam(),
  handleValidationErrors,
];

export const parseCursorParams = (cursorParam?: string, limitParam?: string) => {
  const cursor = cursorParam && cursorParam !== 'undefined' ? cursorParam : undefined;
  const limit = limitParam ? parseInt(limitParam, 10) : 10;
  return { cursor, limit };
};
