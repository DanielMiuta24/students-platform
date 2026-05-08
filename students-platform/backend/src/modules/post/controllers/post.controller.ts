import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { postService } from '../services/post.service';
import { parseCursorParams } from '../validators/post.validation';
import { PostMapper } from '../mappers';
import { POST_ERROR, POST_VALIDATION } from '../constants/post.constants';
import type { UploadRequest } from '../../image/services';

class PostController {
  private static readonly HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
  } as const;

  private static readonly ERROR_RESPONSES: Record<string, { status: number; message: string }> = {
    [POST_ERROR.NOT_FOUND]: {
      status: 404,
      message: 'Post not found',
    },
    [POST_ERROR.UNAUTHORIZED]: {
      status: 403,
      message: 'You are not authorized to update this post',
    },
    [POST_ERROR.CATEGORY_NOT_FOUND]: {
      status: 404,
      message: 'Category not found or inactive',
    },
    [POST_ERROR.INVALID_IMAGES]: {
      status: 403,
      message: 'One or more images do not belong to you',
    },
  };

  private handleError(err: unknown, res: Response, next: NextFunction): Response | void {
    if (!(err instanceof Error)) {
      return next(err);
    }

    const errorResponse = PostController.ERROR_RESPONSES[err.message];

    if (!errorResponse) {
      return next(err);
    }

    return res.status(errorResponse.status).json({
      message: errorResponse.message,
    });
  }

  createPost = async (
    req: AuthenticatedRequest & UploadRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const post = await postService.createPost(
        {
          ...req.body,
          authorId: req.user!.id,
        },
        req.files
      );

      return res.status(PostController.HTTP_STATUS.CREATED).json({
        message: 'Post created successfully',
        post: PostMapper.toSafePost(post),
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { postId } = req.params;
      const post = await postService.getPostById(postId);

      if (!post) {
        return res.status(PostController.HTTP_STATUS.NOT_FOUND).json({ message: 'Post not found' });
      }

      if (req.query.incrementView === 'true') {
        const userId = (req as AuthenticatedRequest).user?.id;
        await postService.incrementViewCount(postId, userId);
        if (!userId || !(post as any).viewedBy?.includes(userId)) {
          post.viewCount += 1;
        }
      }

      return res.status(PostController.HTTP_STATUS.OK).json({
        post: PostMapper.toSafePost(post),
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getPostBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { slug } = req.params;
      const post = await postService.getPostBySlug(slug);

      if (!post) {
        return res.status(PostController.HTTP_STATUS.NOT_FOUND).json({ message: 'Post not found' });
      }

      if (req.query.incrementView === 'true') {
        const userId = (req as AuthenticatedRequest).user?.id;
        await postService.incrementViewCount(post._id.toString(), userId);
        if (!userId || !(post as any).viewedBy?.includes(userId)) {
          post.viewCount += 1;
        }
      }

      return res.status(PostController.HTTP_STATUS.OK).json({
        post: PostMapper.toSafePost(post),
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  updatePost = async (
    req: AuthenticatedRequest & UploadRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const updatedPost = await postService.updatePost(
        req.params.postId,
        req.body,
        req.user!.id,
        req.files
      );

      return res.status(PostController.HTTP_STATUS.OK).json({
        message: 'Post updated successfully',
        post: PostMapper.toSafePost(updatedPost!),
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getFeed = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { cursor, limit } = parseCursorParams(
        req.query.cursor as string,
        req.query.limit as string
      );
      const result = await postService.getFeed({ cursor, limit });

      return res.status(PostController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getPostsByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { cursor, limit } = parseCursorParams(
        req.query.cursor as string,
        req.query.limit as string
      );
      const result = await postService.getPostsByCategory(
        req.params.categoryId,
        cursor,
        limit
      );

      return res.status(PostController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getPostsByAuthor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { cursor, limit } = parseCursorParams(
        req.query.cursor as string,
        req.query.limit as string
      );
      const result = await postService.getPostsByAuthor(
        req.params.authorId,
        cursor,
        limit
      );

      return res.status(PostController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getScoredFeed = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const limitQuery = req.query.limit as string;
      const limit = parseInt(limitQuery || String(POST_VALIDATION.DEFAULT_PAGINATION_LIMIT), 10);
      const safeLimit = Number.isNaN(limit) || limit <= 0
        ? POST_VALIDATION.DEFAULT_PAGINATION_LIMIT
        : limit;

      const preferredCategories = req.query.preferredCategories as string;
      const categories = preferredCategories ? preferredCategories.split(',') : [];

      const userId = req.query.userId as string | undefined;
      const cursor = req.query.cursor as string | undefined;

      const result = await postService.getScoredFeed({
        cursor,
        limit: safeLimit,
        preferredCategories: categories,
        userId,
      });

      return res.status(PostController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  deletePost = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await postService.deletePost(req.params.postId, req.user!.id);

      return res.status(PostController.HTTP_STATUS.OK).json({
        message: 'Post deleted successfully',
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  updateVisibility = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const updatedPost = await postService.updateVisibility(
        req.params.postId,
        req.body.visibility,
        req.user!.id
      );

      return res.status(PostController.HTTP_STATUS.OK).json({
        message: 'Post visibility updated successfully',
        post: PostMapper.toSafePost(updatedPost),
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };
}

export const postController = new PostController();