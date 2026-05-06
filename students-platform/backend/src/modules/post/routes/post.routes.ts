import { Router } from 'express';
import { postController } from '../controllers/post.controller';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import { busboyUploadMiddleware } from '../../image/middleware';
import { IMAGE_VALIDATION } from '../../image/services';
import {
  validateCreatePost,
  validateUpdatePost,
  validatePostId,
  validateCategoryIdParam,
  validateAuthorId,
  validateVisibility,
} from '../validators/post.validation';

const router = Router();

router.get('/feed', postController.getFeed);

router.get('/feed/scored', postController.getScoredFeed);

router.get(
  '/category/:categoryId',
  validateCategoryIdParam,
  postController.getPostsByCategory
);

router.get(
  '/author/:authorId',
  validateAuthorId,
  postController.getPostsByAuthor
);

router.get(
  '/slug/:slug',
  postController.getPostBySlug
);

router.get(
  '/:postId',
  validatePostId,
  postController.getPostById
);

router.post(
  '/',
  authMiddleware,
  busboyUploadMiddleware({
    maxFiles: IMAGE_VALIDATION.MAX_FILES_PER_REQUEST,
    maxFileSize: IMAGE_VALIDATION.MAX_FILE_SIZE,
    allowedMimeTypes: [...IMAGE_VALIDATION.ALLOWED_MIME_TYPES],
    filesRequired: false,
  }),
  validateCreatePost,
  postController.createPost
);

router.put(
  '/:postId',
  authMiddleware,
  validatePostId,
  busboyUploadMiddleware({
    maxFiles: IMAGE_VALIDATION.MAX_FILES_PER_REQUEST,
    maxFileSize: IMAGE_VALIDATION.MAX_FILE_SIZE,
    allowedMimeTypes: [...IMAGE_VALIDATION.ALLOWED_MIME_TYPES],
    filesRequired: false,
  }),
  validateUpdatePost,
  postController.updatePost
);

router.patch(
  '/:postId/visibility',
  authMiddleware,
  validatePostId,
  validateVisibility,
  postController.updateVisibility
);

router.delete(
  '/:postId',
  authMiddleware,
  validatePostId,
  postController.deletePost
);

export default router;
