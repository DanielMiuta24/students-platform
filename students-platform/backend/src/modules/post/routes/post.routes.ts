import { Router } from 'express';
import { postController } from '../controllers/post.controller';
import { authMiddleware, optionalAuthMiddleware } from '../../../shared/middleware/auth.middleware';
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

router.get('/my-posts/count', authMiddleware, postController.getPostsCountByAuthor);

router.get('/my-drafts', authMiddleware, postController.getDraftsByAuthor);

router.get('/feed', authMiddleware, postController.getFeed);

router.get('/feed/scored', authMiddleware, postController.getScoredFeed);

router.get('/community/:communityId/feed', optionalAuthMiddleware, postController.getCommunityScoredFeed);

router.get(
  '/category/:categoryId',
  authMiddleware,
  validateCategoryIdParam,
  postController.getPostsByCategory
);

router.get(
  '/author/:authorId',
  authMiddleware,
  validateAuthorId,
  postController.getPostsByAuthor
);

router.get(
  '/slug/:slug',
  authMiddleware,
  postController.getPostBySlug
);

router.get(
  '/:postId',
  authMiddleware,
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

router.patch(
  '/:postId/pin',
  authMiddleware,
  validatePostId,
  postController.togglePinPost
);

router.delete(
  '/:postId',
  authMiddleware,
  validatePostId,
  postController.deletePost
);

export default router;
