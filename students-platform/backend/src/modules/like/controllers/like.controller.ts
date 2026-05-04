import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { likeService } from '../services';
import { LIKE_ERROR } from '../constants';
import { LikeMapper } from '../mappers';
import type { LikeableType } from '../models';

class LikeController {
  like = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const like = await likeService.like({
        userId: req.user!.id,
        likeableId: req.body.likeableId,
        likeableType: req.body.likeableType,
      });

      const safeLike = LikeMapper.toSafeLike(like);

      return res.status(201).json({
        message: 'Liked successfully',
        like: safeLike,
      });
    } catch (err: any) {
      if (err instanceof Error) {
        switch (err.message) {
          case LIKE_ERROR.POST_NOT_FOUND:
            return res.status(404).json({ message: 'Entity not found' });
          case LIKE_ERROR.ALREADY_LIKED:
            return res.status(409).json({ message: 'You have already liked this' });
        }
      }
      return next(err);
    }
  };

  unlike = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { likeableId, likeableType } = req.params;

      await likeService.unlike({
        userId: req.user!.id,
        likeableId,
        likeableType: likeableType as LikeableType,
      });

      return res.status(200).json({
        message: 'Unliked successfully',
      });
    } catch (err: any) {
      if (err instanceof Error && err.message === LIKE_ERROR.LIKE_NOT_FOUND) {
        return res.status(404).json({ message: 'Like not found' });
      }
      return next(err);
    }
  };

  checkLikeStatus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { likeableId, likeableType } = req.params;

      const hasLiked = await likeService.hasUserLiked({
        userId: req.user!.id,
        likeableId,
        likeableType: likeableType as LikeableType,
      });

      return res.status(200).json({
        hasLiked,
      });
    } catch (err: any) {
      return next(err);
    }
  };

  getLikesByEntity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { likeableId, likeableType } = req.params;

      const likes = await likeService.getLikesByEntity({
        likeableId,
        likeableType: likeableType as LikeableType,
      });
      const safeLikes = LikeMapper.toSafeLikes(likes);

      return res.status(200).json({
        likes: safeLikes,
        count: safeLikes.length,
      });
    } catch (err: any) {
      return next(err);
    }
  };

  getUserLikes = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const likes = await likeService.getLikesByUser({ userId: req.user!.id });
      const safeLikes = LikeMapper.toSafeLikes(likes);

      return res.status(200).json({
        likes: safeLikes,
        count: safeLikes.length,
      });
    } catch (err: any) {
      return next(err);
    }
  };
}

export const likeController = new LikeController();
