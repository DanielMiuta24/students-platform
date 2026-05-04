import { Router } from 'express';
import { likeController } from '../controllers';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import {
  validateCreateLike,
  validateLikeableIdParam,
  validateLikeableTypeParam
} from '../validators';

const router = Router();

router.post('/', authMiddleware, validateCreateLike, likeController.like);

router.delete(
  '/:likeableType/:likeableId',
  authMiddleware,
  validateLikeableTypeParam,
  validateLikeableIdParam,
  likeController.unlike
);

router.get(
  '/:likeableType/:likeableId/status',
  authMiddleware,
  validateLikeableTypeParam,
  validateLikeableIdParam,
  likeController.checkLikeStatus
);

router.get(
  '/:likeableType/:likeableId',
  validateLikeableTypeParam,
  validateLikeableIdParam,
  likeController.getLikesByEntity
);

router.get('/user/me', authMiddleware, likeController.getUserLikes);

export default router;
