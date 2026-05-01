import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';

export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  body: {},
  params: {},
  query: {},
  ...overrides,
});

export const createMockAuthRequest = (
  userId: string = 'user123',
  overrides: Partial<AuthenticatedRequest> = {}
): Partial<AuthenticatedRequest> => ({
  body: {},
  params: {},
  query: {},
  user: { id: userId, email: 'test@example.com', type: 'Student' },
  ...overrides,
});

export const createMockResponse = (): Partial<Response> => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

export const createMockNext = (): NextFunction => jest.fn();

export const createMockCategory = (overrides = {}) => ({
  _id: 'cat123',
  name: 'Technology',
  slug: 'technology',
  description: 'Tech posts',
  isActive: true,
  ...overrides,
});

export const createMockPost = (overrides = {}) => ({
  _id: { toString: () => 'post123' },
  title: 'Test Post',
  content: 'Test content',
  author: 'user123',
  category: 'cat123',
  status: 'published',
  visibility: 'public',
  likeCount: 0,
  commentCount: 0,
  viewCount: 0,
  images: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockLike = (overrides = {}) => ({
  _id: { toString: () => 'like123' },
  user: 'user123',
  likeable: 'post123',
  likeableType: 'Post',
  createdAt: new Date(),
  ...overrides,
});

export const createMockFeedResult = (overrides = {}) => ({
  posts: [],
  hasMore: false,
  ...overrides,
});
