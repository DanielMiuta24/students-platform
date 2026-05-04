import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../../shared/middleware/validation.middleware';

const VALID_LIKEABLE_TYPES = ['Post', 'Comment'];

export const validateCreateLike = [
  body('likeableId')
    .notEmpty().withMessage('Likeable ID is required')
    .isMongoId().withMessage('Invalid likeable ID'),
  body('likeableType')
    .notEmpty().withMessage('Likeable type is required')
    .isIn(VALID_LIKEABLE_TYPES).withMessage(`Likeable type must be one of: ${VALID_LIKEABLE_TYPES.join(', ')}`),
  handleValidationErrors,
];

export const validateLikeableIdParam = [
  param('likeableId').isMongoId().withMessage('Invalid likeable ID'),
  handleValidationErrors,
];

export const validateLikeableTypeParam = [
  param('likeableType')
    .isIn(VALID_LIKEABLE_TYPES).withMessage(`Likeable type must be one of: ${VALID_LIKEABLE_TYPES.join(', ')}`),
  handleValidationErrors,
];
