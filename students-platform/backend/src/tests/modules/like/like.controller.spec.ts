import { Request, Response, NextFunction } from 'express';
import { likeController } from '../../../modules/like/like.controller';
import { likeService } from '../../../modules/like/like.service';
import { LIKE_ERROR } from '../../../modules/like/like.constants';
import { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { createMockAuthRequest, createMockResponse, createMockNext, createMockLike } from '../../helpers';
import { expectErrorResponse } from '../../helpers';

jest.mock('../../../modules/like/like.service');

describe('LikeController', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = createMockAuthRequest();
    mockResponse = createMockResponse();
    mockNext = createMockNext();
    jest.clearAllMocks();
  });

  describe('like', () => {
    it('should create like successfully and return 201', async () => {
      const mockLike = createMockLike();

      mockRequest.body = { likeableType: 'Post', likeableId: 'post123' };
      (likeService.like as jest.Mock).mockResolvedValue(mockLike);

      await likeController.like(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(likeService.like).toHaveBeenCalledWith({
        userId: 'user123',
        likeableId: 'post123',
        likeableType: 'Post',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Liked successfully',
        like: expect.objectContaining({
          id: 'like123',
          user: 'user123',
          likeable: 'post123',
          likeableType: 'Post',
        }),
      });
    });

    it('should return 404 when post not found', async () => {
      mockRequest.body = { likeableType: 'Post', likeableId: 'nonexistent' };
      const error = new Error(LIKE_ERROR.POST_NOT_FOUND);
      (likeService.like as jest.Mock).mockRejectedValue(error);

      await likeController.like(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expectErrorResponse(mockResponse, 404, 'Entity not found');
    });

    it('should return 409 when already liked', async () => {
      mockRequest.body = { likeableType: 'Post', likeableId: 'post123' };
      const error = new Error(LIKE_ERROR.ALREADY_LIKED);
      (likeService.like as jest.Mock).mockRejectedValue(error);

      await likeController.like(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expectErrorResponse(mockResponse, 409, 'You have already liked this');
    });
  });

  describe('unlike', () => {
    it('should remove like successfully and return 200', async () => {
      mockRequest.params = { likeableType: 'Post', likeableId: 'post123' };
      (likeService.unlike as jest.Mock).mockResolvedValue(undefined);

      await likeController.unlike(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(likeService.unlike).toHaveBeenCalledWith({
        userId: 'user123',
        likeableId: 'post123',
        likeableType: 'Post',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unliked successfully',
      });
    });

    it('should return 404 when like not found', async () => {
      mockRequest.params = { likeableType: 'Post', likeableId: 'post123' };
      const error = new Error(LIKE_ERROR.LIKE_NOT_FOUND);
      (likeService.unlike as jest.Mock).mockRejectedValue(error);

      await likeController.unlike(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expectErrorResponse(mockResponse, 404, 'Like not found');
    });
  });

  describe('checkLikeStatus', () => {
    it('should return true when user has liked', async () => {
      mockRequest.params = { likeableType: 'Post', likeableId: 'post123' };
      (likeService.hasUserLiked as jest.Mock).mockResolvedValue(true);

      await likeController.checkLikeStatus(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ hasLiked: true });
    });

    it('should return false when user has not liked', async () => {
      mockRequest.params = { likeableType: 'Post', likeableId: 'post123' };
      (likeService.hasUserLiked as jest.Mock).mockResolvedValue(false);

      await likeController.checkLikeStatus(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({ hasLiked: false });
    });
  });

  describe('getLikesByEntity', () => {
    it('should return likes for an entity', async () => {
      const mockLikes = [
        createMockLike({ _id: { toString: () => 'like1' }, user: 'user1' }),
        createMockLike({ _id: { toString: () => 'like2' }, user: 'user2' }),
      ];

      mockRequest.params = { likeableType: 'Post', likeableId: 'post123' };
      (likeService.getLikesByEntity as jest.Mock).mockResolvedValue(mockLikes);

      await likeController.getLikesByEntity(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        likes: expect.arrayContaining([
          expect.objectContaining({ id: 'like1' }),
          expect.objectContaining({ id: 'like2' }),
        ]),
        count: 2,
      });
    });
  });

  describe('getUserLikes', () => {
    it('should return all likes by authenticated user', async () => {
      const mockLikes = [
        createMockLike({ _id: { toString: () => 'like1' }, likeable: 'post1' }),
        createMockLike({ _id: { toString: () => 'like2' }, likeable: 'comment1', likeableType: 'Comment' }),
      ];

      (likeService.getLikesByUser as jest.Mock).mockResolvedValue(mockLikes);

      await likeController.getUserLikes(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(likeService.getLikesByUser).toHaveBeenCalledWith({ userId: 'user123' });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        likes: expect.arrayContaining([
          expect.objectContaining({ id: 'like1' }),
          expect.objectContaining({ id: 'like2' }),
        ]),
        count: 2,
      });
    });
  });
});
