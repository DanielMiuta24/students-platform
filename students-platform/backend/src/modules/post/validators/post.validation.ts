import { body, param } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { handleValidationErrors } from '../../../shared/middleware/validation.middleware';
import { POST_STATUS, POST_VISIBILITY } from '../../../shared/constants';
import { POST_VALIDATION } from '../constants/post.constants';
import { ContentValidator } from './post-content.validator';
import type { UploadRequest } from '../../image/services/image.types';

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

const validateOptionalCategory = () =>
  body('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID');

const validateCategoryOrCommunity = () =>
  body('category')
    .custom((value, { req }) => {
      // If communityId is provided, category is optional (backend will use community's category)
      if (req.body.communityId) {
        return true;
      }
      // Otherwise, category is required
      if (!value) {
        throw new Error('Category is required when communityId is not provided');
      }
      // Validate it's a valid MongoDB ObjectId
      if (!MONGO_ID_PATTERN.test(value)) {
        throw new Error('Invalid category ID');
      }
      return true;
    });

const validateImages = () =>
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array')
    .custom(validateImageList);


const validateExistingImages = () =>
  body('existingImages')
    .optional()
    .isArray().withMessage('Existing images must be an array')
    .custom(validateImageList);

const validateStatus = () =>
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(VALID_STATUSES).withMessage(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);

const validateOptionalStatus = () =>
  body('status')
    .optional()
    .isIn(VALID_STATUSES).withMessage(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);

const validateVisibilityField = () =>
  body('visibility')
    .notEmpty().withMessage('Visibility is required')
    .isIn(VALID_VISIBILITIES).withMessage(`Invalid visibility. Must be one of: ${VALID_VISIBILITIES.join(', ')}`);

const validateOptionalVisibility = () =>
  body('visibility')
    .optional()
    .isIn(VALID_VISIBILITIES).withMessage(`Invalid visibility. Must be one of: ${VALID_VISIBILITIES.join(', ')}`);

const validateOptionalCommunityId = () =>
  body('communityId')
    .optional()
    .isMongoId().withMessage('Invalid community ID');

export const validateTotalImageCount = (req: UploadRequest, res: Response, next: NextFunction) => {
  const existingImagesCount = Array.isArray(req.body.existingImages) ? req.body.existingImages.length : 0;
  const newFilesCount = req.files ? req.files.length : 0;
  const totalImages = existingImagesCount + newFilesCount;

  if (totalImages > POST_VALIDATION.MAX_IMAGES) {
    return res.status(400).json({
      message: `Maximum ${POST_VALIDATION.MAX_IMAGES} images allowed. You have ${existingImagesCount} existing images and ${newFilesCount} new uploads.`,
    });
  }

  next();
};

export const validateCreatePost = [
  validateTitle(),
  validateContent(),
  validateCategoryOrCommunity(),
  validateOptionalCommunityId(),
  validateOptionalStatus(),
  validateOptionalVisibility(),
  validateImages(),
  validateExistingImages(),
  handleValidationErrors,
];

export const validateUpdatePost = [
  validateTitle(),
  validateContent(),
  validateCategory(),
  validateStatus(),
  validateVisibilityField(),
  validateImages(),
  validateExistingImages(),
  handleValidationErrors,
  validateTotalImageCount,
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

export const validateVisibility = [
  validateVisibilityField(),
  handleValidationErrors,
];