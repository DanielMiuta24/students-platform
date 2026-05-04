import type { Request, Response, NextFunction } from 'express';


export function validateCommentContent(content?: string): boolean {
  if (!content) return false;
  const trimmedContent = content.trim();
  return trimmedContent.length > 0 && trimmedContent.length <= 2000;
}

export function validateObjectId(id?: string): boolean {
  if (!id) return false;
  // MongoDB ObjectId is 24 hex characters
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export function parsePaginationParams(pageParam?: string, limitParam?: string): { page: number; limit: number } {
  const page = parseInt(pageParam || '1', 10);
  const limit = parseInt(limitParam || '10', 10);

  return {
    page: !isNaN(page) && page > 0 ? page : 1,
    limit: !isNaN(limit) && limit > 0 && limit <= 100 ? limit : 10
  };
}


export const validateCreateComment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId, content, parentCommentId } = req.body;

  if (!validateObjectId(postId)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  if (!validateCommentContent(content)) {
    return res.status(400).json({
      message: 'Comment content is required and must be between 1 and 2000 characters'
    });
  }

  if (parentCommentId && !validateObjectId(parentCommentId)) {
    return res.status(400).json({ message: 'Invalid parent comment ID' });
  }

  next();
};

export const validateUpdateComment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { content } = req.body;

  if (!validateCommentContent(content)) {
    return res.status(400).json({
      message: 'Comment content is required and must be between 1 and 2000 characters'
    });
  }

  next();
};

export const validateCommentId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { commentId } = req.params;

  if (!validateObjectId(commentId)) {
    return res.status(400).json({ message: 'Invalid comment ID' });
  }

  next();
};

export const validatePostId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;

  if (!validateObjectId(postId)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  next();
};

export const validateParentCommentId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { parentCommentId } = req.query;

  if (parentCommentId && !validateObjectId(parentCommentId as string)) {
    return res.status(400).json({ message: 'Invalid parent comment ID' });
  }

  next();
};
