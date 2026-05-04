import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../shared/middleware/validation.middleware';
import { POST_STATUS, POST_VISIBILITY } from '../../shared/constants';
import { POST_VALIDATION } from './post.constants';
import { ContentValidator } from './post-content.validator';

const VALID_STATUSES = Object.values(POST_STATUS);
const VALID_VISIBILITIES = Object.values(POST_VISIBILITY);
const MONGO_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

const isValidObjectId = (id?: string): boolean =>
  Boolean(id && MONGO_ID_PATTERN.test(id));

export const parseCursorParams = (
  cursorParam?: string,
  limitParam?: string
): { cursor?: string; limit: number } => {
  const limit = parseInt(limitParam || String(POST_VALIDATION.DEFAULT_PAGINATION_LIMIT), 10);
  const isValidLimit = !isNaN(limit) && limit > 0 && limit <= POST_VALIDATION.MAX_PAGINATION_LIMIT;

  return {
    cursor: isValidObjectId(cursorParam) ? cursorParam : undefined,
    limit: isValidLimit ? limit : POST_VALIDATION.DEFAULT_PAGINATION_LIMIT
  };
};

const validateContentLength = (value: unknown): boolean => {
  const validation = ContentValidator.validate(value);

  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid content');
  }

  return true;
};

const validateImageList = (images: any[]): boolean => {
  if (images.length > POST_VALIDATION.MAX_IMAGES) {
    throw new Error(`Maximum ${POST_VALIDATION.MAX_IMAGES} images allowed`);
  }

  for (const img of images) {
    if (!img.url || typeof img.url !== 'string') {
      throw new Error('Each image must have a valid URL');
    }

    try {
      new URL(img.url);
    } catch {
      throw new Error('Each image must have a valid URL');
    }

    if (img.alt && typeof img.alt === 'string' && img.alt.length > POST_VALIDATION.ALT_TEXT_MAX_LENGTH) {
      throw new Error(`Image alt text must not exceed ${POST_VALIDATION.ALT_TEXT_MAX_LENGTH} characters`);
    }
  }

  return true;
};

const validateTitle = () =>
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: POST_VALIDATION.TITLE_MIN_LENGTH, max: POST_VALIDATION.TITLE_MAX_LENGTH })
    .withMessage(`Title must be between ${POST_VALIDATION.TITLE_MIN_LENGTH} and ${POST_VALIDATION.TITLE_MAX_LENGTH} characters`);

const validateContent = () =>
  body('content')
    .notEmpty().withMessage('Content is required')
    .custom(validateContentLength);

const validateCategory = () =>
  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID');

const validateImages = () =>
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array')
    .custom(validateImageList);

export const validateCreatePost = [
  validateTitle(),
  validateContent(),
  validateCategory(),
  body('status')
    .optional()
    .isIn(VALID_STATUSES).withMessage(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`),
  body('visibility')
    .optional()
    .isIn(VALID_VISIBILITIES).withMessage(`Invalid visibility. Must be one of: ${VALID_VISIBILITIES.join(', ')}`),
  validateImages(),
  handleValidationErrors,
];

export const validateUpdatePost = [
  validateTitle(),
  validateContent(),
  validateCategory(),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(VALID_STATUSES).withMessage(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`),
  body('visibility')
    .notEmpty().withMessage('Visibility is required')
    .isIn(VALID_VISIBILITIES).withMessage(`Invalid visibility. Must be one of: ${VALID_VISIBILITIES.join(', ')}`),
  validateImages(),
  handleValidationErrors,
];

export const validatePostId = [
  param('postId').isMongoId().withMessage('Invalid post ID'),
  handleValidationErrors,
];

export const validateCategoryIdParam = [
  param('categoryId').isMongoId().withMessage('Invalid category ID'),
  handleValidationErrors,
];

export const validateAuthorId = [
  param('authorId').isMongoId().withMessage('Invalid author ID'),
  handleValidationErrors,
];