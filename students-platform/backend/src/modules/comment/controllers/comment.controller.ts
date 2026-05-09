import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { commentService, type CreateCommentDTO, type UpdateCommentDTO } from '../services';
import { parsePaginationParams } from '../validators';
import { User } from '../../user/models';

class CommentController {
  createComment = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { postId, content, parentCommentId } = req.body;

      const commentData: CreateCommentDTO = {
        postId,
        authorId: req.user!.id,
        content,
        parentCommentId,
      };

      const comment = await commentService.createComment(commentData);
      const safeComment = commentService.toSafeComment(comment);

      return res.status(201).json({
        message: 'Comment created successfully',
        comment: safeComment,
      });
    } catch (err: any) {
      if (err.message === 'POST_NOT_FOUND') {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (err.message === 'PARENT_COMMENT_NOT_FOUND') {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
      return next(err);
    }
  };

  getCommentsByPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { postId } = req.params;
      const { page: pageParam, limit: limitParam, parentCommentId } = req.query;

      const { page, limit } = parsePaginationParams(
        pageParam as string,
        limitParam as string
      );

      const { comments, total } = await commentService.getCommentsByPost({
        postId,
        page,
        limit,
        parentCommentId: parentCommentId as string | undefined,
      });

      const safeComments = comments.map((comment) =>
        commentService.toSafeComment(comment)
      );

      return res.status(200).json({
        comments: safeComments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err: any) {
      return next(err);
    }
  };

  getCommentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { commentId } = req.params;

      const comment = await commentService.getCommentById(commentId);

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      const safeComment = commentService.toSafeComment(comment);

      return res.status(200).json({ comment: safeComment });
    } catch (err: any) {
      return next(err);
    }
  };

  updateComment = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;

      const existingComment = await commentService.getCommentById(commentId);

      if (!existingComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      if (!commentService.verifyCommentOwnership(existingComment, req.user!.id)) {
        return res.status(403).json({ message: 'You are not authorized to update this comment' });
      }

      const updateData: UpdateCommentDTO = { content };
      const updatedComment = await commentService.updateComment(commentId, updateData);

      const safeComment = commentService.toSafeComment(updatedComment!);

      return res.status(200).json({
        message: 'Comment updated successfully',
        comment: safeComment,
      });
    } catch (err: any) {
      return next(err);
    }
  };

  deleteComment = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { commentId } = req.params;

      const comment = await commentService.getCommentById(commentId);

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      const canDelete = await commentService.canDeleteComment(comment, req.user!.id);

      if (!canDelete) {
        return res.status(403).json({ message: 'You are not authorized to delete this comment' });
      }

      await commentService.deleteComment(commentId);

      return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err: any) {
      return next(err);
    }
  };

  getCommentCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { postId } = req.params;

      const count = await commentService.getCommentCount(postId);

      return res.status(200).json({ count });
    } catch (err: any) {
      return next(err);
    }
  };

  getRepliesCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { commentId } = req.params;

      const count = await commentService.getRepliesCount(commentId);

      return res.status(200).json({ count });
    } catch (err: any) {
      return next(err);
    }
  };

  notifyTyping = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { postId } = req.params;
      const { isTyping, parentCommentId } = req.body;

      const user = await User.findById(req.user!.id).select('name avatar');

      commentService.broadcastTypingIndicator(
        postId,
        req.user!.id,
        user?.name || req.user!.email.split('@')[0],
        user?.avatar,
        isTyping === true,
        parentCommentId
      );

      return res.status(200).json({ message: 'Typing status broadcasted' });
    } catch (err: any) {
      return next(err);
    }
  };
}

export const commentController = new CommentController();
