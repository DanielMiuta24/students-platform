import { Router } from 'express';
import { postController } from '../controllers/post.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { busboyUploadMiddleware } from '../image/middleware';
import { UPLOAD_VALIDATION } from '../../shared/services/upload';
import {
  validateCreatePost,
  validateUpdatePost,
  validatePostId,
  validateCategoryIdParam,
  validateAuthorId,
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
  '/:postId',
  validatePostId,
  postController.getPostById
);

router.post(
  '/',
  authMiddleware,
  busboyUploadMiddleware({
    maxFiles: UPLOAD_VALIDATION.MAX_FILES_PER_REQUEST,
    maxFileSize: UPLOAD_VALIDATION.MAX_FILE_SIZE,
    allowedMimeTypes: [...UPLOAD_VALIDATION.ALLOWED_MIME_TYPES],
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
    maxFiles: UPLOAD_VALIDATION.MAX_FILES_PER_REQUEST,
    maxFileSize: UPLOAD_VALIDATION.MAX_FILE_SIZE,
    allowedMimeTypes: [...UPLOAD_VALIDATION.ALLOWED_MIME_TYPES],
    filesRequired: false,
  }),
  validateUpdatePost,
  postController.updatePost
);

export default router;
