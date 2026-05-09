import { Router } from 'express';
import { commentController } from '../controllers';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import {
  validateCreateComment,
  validateUpdateComment,
  validateCommentId,
  validatePostId,
  validateParentCommentId,
} from '../validators';

const router = Router();


router.post(
  '/',
  authMiddleware,
  validateCreateComment,
  commentController.createComment
);

router.get(
  '/post/:postId',
  validatePostId,
  validateParentCommentId,
  commentController.getCommentsByPost
);


router.get(
  '/post/:postId/count',
  validatePostId,
  commentController.getCommentCount
);

router.post(
  '/post/:postId/typing',
  authMiddleware,
  validatePostId,
  commentController.notifyTyping
);


router.get(
  '/:commentId',
  validateCommentId,
  commentController.getCommentById
);


router.get(
  '/:commentId/replies/count',
  validateCommentId,
  commentController.getRepliesCount
);


router.put(
  '/:commentId',
  authMiddleware,
  validateCommentId,
  validateUpdateComment,
  commentController.updateComment
);


router.delete(
  '/:commentId',
  authMiddleware,
  validateCommentId,
  commentController.deleteComment
);

export default router;
