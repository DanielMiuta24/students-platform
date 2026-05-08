import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import type { UserType } from '../types/domain';

interface JwtPayload {
  sub: string;
  email: string;
  type: UserType;
  iat: number;
  exp: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  type: UserType;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      type: decoded.type,
    };

    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const optionalAuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      type: decoded.type,
    };

    next();
  } catch {
    next();
  }
};
