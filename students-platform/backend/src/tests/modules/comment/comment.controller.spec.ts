import { commentController } from '../../../modules/comment/controllers';
import { commentService } from '../../../modules/comment/services';
import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';

jest.mock('../../../modules/comment/services');

describe('CommentController', () => {
  let mockRequest: Partial<Request | AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('createComment', () => {
    beforeEach(() => {
      (mockRequest as AuthenticatedRequest).user = {
        id: '507f1f77bcf86cd799439012',
        email: 'user@test.com',
        type: 'Student',
      };
    });

    it('should create a comment successfully', async () => {
      const mockComment = {
        _id: '507f1f77bcf86cd799439013',
        post: '507f1f77bcf86cd799439011',
        author: '507f1f77bcf86cd799439012',
        content: 'Test comment',
        parentComment: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSafeComment = {
        id: '507f1f77bcf86cd799439013',
        postId: '507f1f77bcf86cd799439011',
        authorId: '507f1f77bcf86cd799439012',
        content: 'Test comment',
        parentCommentId: null,
        createdAt: mockComment.createdAt,
        updatedAt: mockComment.updatedAt,
      };

      mockRequest.body = {
        postId: '507f1f77bcf86cd799439011',
        content: 'Test comment',
      };

      (commentService.createComment as jest.Mock).mockResolvedValue(mockComment);
      (commentService.toSafeComment as jest.Mock).mockReturnValue(mockSafeComment);

      await commentController.createComment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(commentService.createComment).toHaveBeenCalledWith({
        postId: '507f1f77bcf86cd799439011',
        authorId: '507f1f77bcf86cd799439012',
        content: 'Test comment',
        parentCommentId: undefined,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Comment created successfully',
        comment: mockSafeComment,
      });
    });

    it('should create a comment with parent comment', async () => {
      const mockComment = {
        _id: '507f1f77bcf86cd799439013',
        post: '507f1f77bcf86cd799439011',
        author: '507f1f77bcf86cd799439012',
        content: 'Reply comment',
        parentComment: '507f1f77bcf86cd799439014',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = {
        postId: '507f1f77bcf86cd799439011',
        content: 'Reply comment',
        parentCommentId: '507f1f77bcf86cd799439014',
      };

      (commentService.createComment as jest.Mock).mockResolvedValue(mockComment);
      (commentService.toSafeComment as jest.Mock).mockReturnValue({});

      await commentController.createComment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(commentService.createComment).toHaveBeenCalledWith({
        postId: '507f1f77bcf86cd799439011',
        authorId: '507f1f77bcf86cd799439012',
        content: 'Reply comment',
        parentCommentId: '507f1f77bcf86cd799439014',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should return 404 when post not found', async () => {
      mockRequest.body = {
        postId: '507f1f77bcf86cd799439011',
        content: 'Test comment',
      };

      (commentService.createComment as jest.Mock).mockRejectedValue(
        new Error('POST_NOT_FOUND')
      );

      await commentController.createComment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Post not found' });
    });

    it('should return 404 when parent comment not found', async () => {
      mockRequest.body = {
        postId: '507f1f77bcf86cd799439011',
        content: 'Reply comment',
        parentCommentId: '507f1f77bcf86cd799439014',
      };

      (commentService.createComment as jest.Mock).mockRejectedValue(
        new Error('PARENT_COMMENT_NOT_FOUND')
      );

      await commentController.createComment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Parent comment not found' });
    });

    it('should call next for unexpected errors', async () => {
      mockRequest.body = {
        postId: '507f1f77bcf86cd799439011',
        content: 'Test comment',
      };

      const unexpectedError = new Error('Unexpected error');
      (commentService.createComment as jest.Mock).mockRejectedValue(unexpectedError);

      await commentController.createComment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(unexpectedError);
    });
  });

  describe('getCommentsByPost', () => {
    it('should return comments for a post with pagination', async () => {
      mockRequest.params = { postId: '507f1f77bcf86cd799439011' };
      mockRequest.query = { page: '1', limit: '10' };

      const mockComments = [
        { _id: '1', content: 'Comment 1' },
        { _id: '2', content: 'Comment 2' },
      ];

      (commentService.getCommentsByPost as jest.Mock).mockResolvedValue({
        comments: mockComments,
        total: 2,
        page: 1,
        limit: 10,
      });
      (commentService.toSafeComment as jest.Mock).mockImplementation((comment) => comment);

      await commentController.getCommentsByPost(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(commentService.getCommentsByPost).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        comments: mockComments,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      });
    });

    it('should handle pagination with multiple pages', async () => {
      mockRequest.params = { postId: '507f1f77bcf86cd799439011' };
      mockRequest.query = { page: '2', limit: '10' };

      (commentService.getCommentsByPost as jest.Mock).mockResolvedValue({
        comments: [],
        total: 25,
        page: 2,
        limit: 10,
      });
      (commentService.toSafeComment as jest.Mock).mockImplementation((comment) => comment);

      await commentController.getCommentsByPost(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: expect.objectContaining({
            totalPages: 3,
          }),
        })
      );
    });

    it('should call next for errors', async () => {
      mockRequest.params = { postId: '507f1f77bcf86cd799439011' };
      const error = new Error('Database error');
      (commentService.getCommentsByPost as jest.Mock).mockRejectedValue(error);

      await commentController.getCommentsByPost(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getCommentById', () => {
    it('should return a comment by ID', async () => {
      mockRequest.params = { commentId: '507f1f77bcf86cd799439013' };

      const mockComment = {
        _id: '507f1f77bcf86cd799439013',
        content: 'Test comment',
      };

      const mockSafeComment = {
        id: '507f1f77bcf86cd799439013',
        content: 'Test comment',
      };

      (commentService.getCommentById as jest.Mock).mockResolvedValue(mockComment);
      (commentService.toSafeComment as jest.Mock).mockReturnValue(mockSafeComment);

      await commentController.getCommentById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(commentService.getCommentById).toHaveBeenCalledWith('507f1f77bcf86cd799439013');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ comment: mockSafeComment });
    });

    it('should return 404 when comment not found', async () => {
      mockRequest.params = { commentId: '507f1f77bcf86cd799439999' };

      (commentService.getCommentById as jest.Mock).mockResolvedValue(null);

      await commentController.getCommentById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Comment not found' });
    });

    it('should call next for errors', async () => {
      mockRequest.params = { commentId: '507f1f77bcf86cd799439013' };
      const error = new Error('Database error');
      (commentService.getCommentById as jest.Mock).mockRejectedValue(error);

      await commentController.getCommentById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateComment', () => {
    beforeEach(() => {
      (mockRequest as AuthenticatedRequest).user = {
        id: '507f1f77bcf86cd799439012',
        email: 'user@test.com',
        type: 'Student',
      };
    });

    it('should update a comment successfully', async () => {
      mockRequest.params = { commentId: '507f1f77bcf86cd799439013' };
      mockRequest.body = { content: 'Updated content' };

      const mockExistingComment = {
        _id: '507f1f77bcf86cd799439013',
        author: {
          toString: () => '507f1f77bcf86cd799439012',
        },
        content: 'Old content',
      };

      const mockUpdatedComment = {
        _id: '507f1f77bcf86cd799439013',
        content: 'Updated content',
      };

      (commentService.getCommentById as jest.Mock).mockResolvedValue(mockExistingComment);
      (commentService.verifyCommentOwnership as jest.Mock).mockReturnValue(true);
      (commentService.updateComment as jest.Mock).mockResolvedValue(mockUpdatedComment);
      (commentService.toSafeComment as jest.Mock).mockReturnValue(mockUpdatedComment);

      await commentController.updateComment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(commentService.updateComment).toHaveBeenCalledWith('507f1f77bcf86cd799439013', {
        content: 'Updated content',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Comment updated successfully',
        comment: mockUpdatedComment,
      });
    });

    it('should return 404 when comment not found', async () => {
      mockRequest.params = { commentId: '507f1f77bcf86cd799439999' };
      mockRequest.body = { content: 'Updated content' };

      (commentService.getCommentById as jest.Mock).mockResolvedValue(null);

      await commentController.updateComment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Comment not found' });
    });

    it('should return 403 when user is not the owner', async () => {
      mockRequest.params = { commentId: '507f1f77bcf86cd799439013' };
      mockRequest.body = { content: 'Updated content' };

      const mockComment = {
        _id: '507f1f77bcf86cd799439013',
        author: {
          toString: () => '507f1f77bcf86cd799439099',
        },
      };

      (commentService.getCommentById as jest.Mock).mockResolvedValue(mockComment);
      (commentService.verifyCommentOwnership as jest.Mock).mockReturnValue(false);

      await commentController.updateComment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'You are not authorized to update this comment',
      });
    });

    it('should call next for errors', async () => {
      mockRequest.params = { commentId: '507f1f77bcf86cd799439013' };
      mockRequest.body = { content: 'Updated content' };

      const error = new Error('Database error');
      (commentService.getCommentById as jest.Mock).mockRejectedValue(error);

      await commentController.updateComment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteComment', () => {
    beforeEach(() => {
      (mockRequest as AuthenticatedRequest).user = {
        id: '507f1f77bcf86cd799439012',
        email: 'user@test.com',
        type: 'Student',
      };
    });

    it('should delete a comment successfully', async () => {
      mockRequest.params = { commentId: '507f1f77bcf86cd799439013' };

      const mockComment = {
        _id: '507f1f77bcf86cd799439013',
        author: {
          toString: () => '507f1f77bcf86cd799439012',
        },
      };

      (commentService.getCommentById as jest.Mock).mockResolvedValue(mockComment);
      (commentService.canDeleteComment as jest.Mock).mockResolvedValue(true);
      (commentService.deleteComment as jest.Mock).mockResolvedValue(undefined);

      await commentController.deleteComment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(commentService.deleteComment).toHaveBeenCalledWith('507f1f77bcf86cd799439013');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Comment deleted successfully' });
    });

    it('should return 404 when comment not found', async () => {
      mockRequest.params = { commentId: '507f1f77bcf86cd799439999' };

      (commentService.getCommentById as jest.Mock).mockResolvedValue(null);

      await commentController.deleteComment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Comment not found' });
    });

    it('should return 403 when user is not the owner', async () => {
      mockRequest.params = { commentId: '507f1f77bcf86cd799439013' };

      const mockComment = {
        _id: '507f1f77bcf86cd799439013',
        author: {
          toString: () => '507f1f77bcf86cd799439099',
        },
      };

      (commentService.getCommentById as jest.Mock).mockResolvedValue(mockComment);
      (commentService.canDeleteComment as jest.Mock).mockResolvedValue(false);

      await commentController.deleteComment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'You are not authorized to delete this comment',
      });
    });

    it('should call next for errors', async () => {
      mockRequest.params = { commentId: '507f1f77bcf86cd799439013' };

      const error = new Error('Database error');
      (commentService.getCommentById as jest.Mock).mockRejectedValue(error);

      await commentController.deleteComment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getCommentCount', () => {
    it('should return comment count for a post', async () => {
      mockRequest.params = { postId: '507f1f77bcf86cd799439011' };

      (commentService.getCommentCount as jest.Mock).mockResolvedValue(15);

      await commentController.getCommentCount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(commentService.getCommentCount).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ count: 15 });
    });

    it('should return 0 when no comments exist', async () => {
      mockRequest.params = { postId: '507f1f77bcf86cd799439011' };

      (commentService.getCommentCount as jest.Mock).mockResolvedValue(0);

      await commentController.getCommentCount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({ count: 0 });
    });

    it('should call next for errors', async () => {
      mockRequest.params = { postId: '507f1f77bcf86cd799439011' };
      const error = new Error('Database error');
      (commentService.getCommentCount as jest.Mock).mockRejectedValue(error);

      await commentController.getCommentCount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getRepliesCount', () => {
    it('should return replies count for a comment', async () => {
      mockRequest.params = { commentId: '507f1f77bcf86cd799439013' };

      (commentService.getRepliesCount as jest.Mock).mockResolvedValue(5);

      await commentController.getRepliesCount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(commentService.getRepliesCount).toHaveBeenCalledWith('507f1f77bcf86cd799439013');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ count: 5 });
    });

    it('should return 0 when no replies exist', async () => {
      mockRequest.params = { commentId: '507f1f77bcf86cd799439013' };

      (commentService.getRepliesCount as jest.Mock).mockResolvedValue(0);

      await commentController.getRepliesCount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({ count: 0 });
    });

    it('should call next for errors', async () => {
      mockRequest.params = { commentId: '507f1f77bcf86cd799439013' };
      const error = new Error('Database error');
      (commentService.getRepliesCount as jest.Mock).mockRejectedValue(error);

      await commentController.getRepliesCount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
