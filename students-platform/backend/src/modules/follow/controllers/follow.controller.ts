import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { followService } from '../services';
import { FOLLOW_ERROR } from '../constants';

class FollowController {
  follow = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;

      await followService.follow({
        followerId: req.user!.id,
        followingId: userId,
      });

      return res.status(200).json({
        message: 'User followed successfully',
      });
    } catch (err: any) {
      if (err instanceof Error) {
        switch (err.message) {
          case FOLLOW_ERROR.USER_NOT_FOUND:
            return res.status(404).json({ message: 'User not found' });
          case FOLLOW_ERROR.CANNOT_FOLLOW_SELF:
            return res.status(400).json({ message: 'You cannot follow yourself' });
          case FOLLOW_ERROR.ALREADY_FOLLOWING:
            return res.status(409).json({ message: 'You are already following this user' });
        }
      }
      return next(err);
    }
  };

  unfollow = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;

      await followService.unfollow({
        followerId: req.user!.id,
        followingId: userId,
      });

      return res.status(200).json({
        message: 'User unfollowed successfully',
      });
    } catch (err: any) {
      if (err instanceof Error) {
        switch (err.message) {
          case FOLLOW_ERROR.USER_NOT_FOUND:
            return res.status(404).json({ message: 'User not found' });
          case FOLLOW_ERROR.CANNOT_FOLLOW_SELF:
            return res.status(400).json({ message: 'You cannot unfollow yourself' });
          case FOLLOW_ERROR.NOT_FOLLOWING:
            return res.status(409).json({ message: 'You are not following this user' });
        }
      }
      return next(err);
    }
  };

  checkFollowStatus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;

      const status = await followService.checkMutualFollow(req.user!.id, userId);

      return res.status(200).json(status);
    } catch (err: any) {
      return next(err);
    }
  };

  getFollowers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await followService.getFollowers(userId, page, limit);

      return res.status(200).json(result);
    } catch (err: any) {
      if (err instanceof Error && err.message === FOLLOW_ERROR.USER_NOT_FOUND) {
        return res.status(404).json({ message: 'User not found' });
      }
      return next(err);
    }
  };

  getFollowing = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await followService.getFollowing(userId, page, limit);

      return res.status(200).json(result);
    } catch (err: any) {
      if (err instanceof Error && err.message === FOLLOW_ERROR.USER_NOT_FOUND) {
        return res.status(404).json({ message: 'User not found' });
      }
      return next(err);
    }
  };

  getStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;

      const stats = await followService.getStats(userId);

      return res.status(200).json(stats);
    } catch (err: any) {
      if (err instanceof Error && err.message === FOLLOW_ERROR.USER_NOT_FOUND) {
        return res.status(404).json({ message: 'User not found' });
      }
      return next(err);
    }
  };

  getFriends = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await followService.getFriends(userId, page, limit);

      return res.status(200).json(result);
    } catch (err: any) {
      if (err instanceof Error && err.message === FOLLOW_ERROR.USER_NOT_FOUND) {
        return res.status(404).json({ message: 'User not found' });
      }
      return next(err);
    }
  };
}

export const followController = new FollowController();
