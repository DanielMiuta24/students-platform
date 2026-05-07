import { Router } from 'express';
import { followController } from '../controllers';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import { param, query } from 'express-validator';
import { handleValidationErrors } from '../../../shared/middleware/validation.middleware';

const router = Router();

const validateUserIdParam = [
  param('userId').isMongoId().withMessage('Invalid user ID'),
  handleValidationErrors,
];

const validatePaginationQuery = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];

// Follow a user
router.post(
  '/:userId',
  authMiddleware,
  validateUserIdParam,
  followController.follow
);

// Unfollow a user
router.delete(
  '/:userId',
  authMiddleware,
  validateUserIdParam,
  followController.unfollow
);

// Check if current user follows target user
router.get(
  '/:userId/status',
  authMiddleware,
  validateUserIdParam,
  followController.checkFollowStatus
);

// Get user's followers list with pagination
router.get(
  '/:userId/followers',
  validateUserIdParam,
  validatePaginationQuery,
  followController.getFollowers
);

// Get user's following list with pagination
router.get(
  '/:userId/following',
  validateUserIdParam,
  validatePaginationQuery,
  followController.getFollowing
);

// Get follower/following counts
router.get(
  '/:userId/stats',
  validateUserIdParam,
  followController.getStats
);

// Get user's friends (mutual follows) with pagination
router.get(
  '/:userId/friends',
  validateUserIdParam,
  validatePaginationQuery,
  followController.getFriends
);

export default router;
