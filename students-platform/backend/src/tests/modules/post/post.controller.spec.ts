import { Request, Response, NextFunction } from 'express';
import { postController } from '../../../modules/post/controllers/post.controller';
import { postService } from '../../../modules/post/services/post.service';
import { POST_ERROR } from '../../../modules/post/constants/post.constants';
import { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { createMockRequest, createMockAuthRequest, createMockResponse, createMockNext, createMockPost, createMockFeedResult } from '../../helpers';
import { expectErrorResponse } from '../../helpers';

jest.mock('../../../modules/post/services/post.service');

describe('PostController', () => {
  let mockRequest: Partial<Request | AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = createMockAuthRequest();
    mockResponse = createMockResponse();
    mockNext = createMockNext();
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create post successfully and return 201', async () => {
      const mockPost = createMockPost();

      mockRequest.body = {
        title: 'Test Post',
        content: 'Test content',
        category: 'cat123',
      };

      (postService.createPost as jest.Mock).mockResolvedValue(mockPost);

      await postController.createPost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(postService.createPost).toHaveBeenCalledWith({
        title: 'Test Post',
        content: 'Test content',
        category: 'cat123',
        authorId: 'user123',
      }, undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Post created successfully',
        post: expect.objectContaining({
          id: 'post123',
          title: 'Test Post',
        }),
      });
    });

    it('should return 404 when category not found', async () => {
      mockRequest.body = {
        title: 'Test Post',
        content: 'Test content',
        category: 'nonexistent',
      };

      const error = new Error(POST_ERROR.CATEGORY_NOT_FOUND);
      (postService.createPost as jest.Mock).mockRejectedValue(error);

      await postController.createPost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expectErrorResponse(mockResponse, 404, 'Category not found or inactive');
    });
  });

  describe('getPostById', () => {
    it('should return post successfully', async () => {
      const mockPost = createMockPost({ likeCount: 5, commentCount: 3, viewCount: 100 });

      mockRequest.params = { postId: 'post123' };
      mockRequest.query = {};
      (postService.getPostById as jest.Mock).mockResolvedValue(mockPost);

      await postController.getPostById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(postService.getPostById).toHaveBeenCalledWith('post123', 'user123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        post: expect.objectContaining({
          id: 'post123',
          title: 'Test Post',
        }),
      });
    });

    it('should increment view count when requested', async () => {
      const mockPost = createMockPost({ viewCount: 100 });

      mockRequest.params = { postId: 'post123' };
      mockRequest.query = { incrementView: 'true' };
      (postService.getPostById as jest.Mock).mockResolvedValue(mockPost);
      (postService.incrementViewCount as jest.Mock).mockResolvedValue(undefined);

      await postController.getPostById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(postService.incrementViewCount).toHaveBeenCalledWith('post123', 'user123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 when post not found', async () => {
      mockRequest.params = { postId: 'nonexistent' };
      (postService.getPostById as jest.Mock).mockResolvedValue(null);

      await postController.getPostById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expectErrorResponse(mockResponse, 404, 'Post not found');
    });
  });

  describe('updatePost', () => {
    it('should update post successfully', async () => {
      const mockPost = createMockPost({ title: 'Updated Post', content: 'Updated content' });

      mockRequest.params = { postId: 'post123' };
      mockRequest.body = { title: 'Updated Post', content: 'Updated content' };
      (postService.updatePost as jest.Mock).mockResolvedValue(mockPost);

      await postController.updatePost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(postService.updatePost).toHaveBeenCalledWith(
        'post123',
        { title: 'Updated Post', content: 'Updated content' },
        'user123',
        undefined
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Post updated successfully',
        post: expect.objectContaining({
          id: 'post123',
          title: 'Updated Post',
        }),
      });
    });

    it('should return 404 when post not found', async () => {
      mockRequest.params = { postId: 'nonexistent' };
      mockRequest.body = { title: 'Updated Post' };

      const error = new Error(POST_ERROR.NOT_FOUND);
      (postService.updatePost as jest.Mock).mockRejectedValue(error);

      await postController.updatePost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expectErrorResponse(mockResponse, 404, 'Post not found');
    });

    it('should return 403 when user is not authorized', async () => {
      mockRequest.params = { postId: 'post123' };
      mockRequest.body = { title: 'Updated Post' };

      const error = new Error(POST_ERROR.UNAUTHORIZED);
      (postService.updatePost as jest.Mock).mockRejectedValue(error);

      await postController.updatePost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expectErrorResponse(mockResponse, 403, 'You are not authorized to update this post');
    });

    it('should return 404 when category not found', async () => {
      mockRequest.params = { postId: 'post123' };
      mockRequest.body = { category: 'nonexistent' };

      const error = new Error(POST_ERROR.CATEGORY_NOT_FOUND);
      (postService.updatePost as jest.Mock).mockRejectedValue(error);

      await postController.updatePost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expectErrorResponse(mockResponse, 404, 'Category not found or inactive');
    });
  });

  describe('getFeed', () => {
    it('should return feed successfully', async () => {
      const mockResult = createMockFeedResult();

      mockRequest.query = { limit: '10' };
      (postService.getFeed as jest.Mock).mockResolvedValue(mockResult);

      await postController.getFeed(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(postService.getFeed).toHaveBeenCalledWith({
        cursor: undefined,
        limit: 10,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('getPostsByCategory', () => {
    it('should return posts by category', async () => {
      const mockResult = createMockFeedResult();

      mockRequest.params = { categoryId: 'cat123' };
      mockRequest.query = { limit: '10' };
      (postService.getPostsByCategory as jest.Mock).mockResolvedValue(mockResult);

      await postController.getPostsByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(postService.getPostsByCategory).toHaveBeenCalledWith(
        'cat123',
        undefined,
        10
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('getPostsByAuthor', () => {
    it('should return posts by author', async () => {
      const mockResult = createMockFeedResult();

      mockRequest.params = { authorId: 'user123' };
      mockRequest.query = { limit: '10' };
      (postService.getPostsByAuthor as jest.Mock).mockResolvedValue(mockResult);

      await postController.getPostsByAuthor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(postService.getPostsByAuthor).toHaveBeenCalledWith(
        'user123',
        'user123',
        undefined,
        10
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('getScoredFeed', () => {
    it('should return scored feed with default limit', async () => {
      const mockResult = createMockFeedResult();

      mockRequest.query = {};
      (postService.getScoredFeed as jest.Mock).mockResolvedValue(mockResult);

      await postController.getScoredFeed(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(postService.getScoredFeed).toHaveBeenCalledWith({
        limit: 10,
        preferredCategories: [],
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return scored feed with preferred categories', async () => {
      const mockResult = createMockFeedResult();

      mockRequest.query = {
        limit: '20',
        preferredCategories: 'cat1,cat2,cat3',
      };
      (postService.getScoredFeed as jest.Mock).mockResolvedValue(mockResult);

      await postController.getScoredFeed(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(postService.getScoredFeed).toHaveBeenCalledWith({
        limit: 20,
        preferredCategories: ['cat1', 'cat2', 'cat3'],
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle invalid limit gracefully', async () => {
      const mockResult = createMockFeedResult();

      mockRequest.query = { limit: 'invalid' };
      (postService.getScoredFeed as jest.Mock).mockResolvedValue(mockResult);

      await postController.getScoredFeed(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(postService.getScoredFeed).toHaveBeenCalledWith({
        limit: 10,
        preferredCategories: [],
      });
    });
  });
});
