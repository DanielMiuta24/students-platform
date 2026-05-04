import { LikeModel } from '../../../modules/like/models';
import { PostModel } from '../../../modules/post/models';
import { CommentModel } from '../../../modules/comment/models';
import { likeService } from '../../../modules/like/services';
import { LIKE_ERROR } from '../../../modules/like/constants';

jest.mock('../../../modules/like/models');
jest.mock('../../../modules/post/models');
jest.mock('../../../modules/comment/models');

describe('LikeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('like', () => {
    const mockLikeData = {
      userId: 'user123',
      likeableId: 'post123',
      likeableType: 'Post' as const,
    };

    it('should create like for a post successfully', async () => {
      const mockPost = { _id: 'post123', title: 'Test Post' };
      const mockLike = {
        _id: 'like123',
        user: 'user123',
        likeable: 'post123',
        likeableType: 'Post',
        save: jest.fn().mockResolvedValue(this),
      };

      (PostModel.findById as jest.Mock).mockResolvedValue(mockPost);
      (LikeModel.findOne as jest.Mock).mockResolvedValue(null);
      (LikeModel as any).mockImplementation(() => mockLike);
      (PostModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockPost);

      const result = await likeService.like(mockLikeData);

      expect(PostModel.findById).toHaveBeenCalledWith('post123');
      expect(LikeModel.findOne).toHaveBeenCalled();
      expect(mockLike.save).toHaveBeenCalled();
      expect(PostModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'post123',
        { $inc: { likeCount: 1 } }
      );
    });

    it('should create like for a comment successfully', async () => {
      const mockLikeData = {
        userId: 'user123',
        likeableId: 'comment123',
        likeableType: 'Comment' as const,
      };

      const mockComment = { _id: 'comment123', content: 'Test Comment' };
      const mockLike = {
        _id: 'like123',
        user: 'user123',
        likeable: 'comment123',
        likeableType: 'Comment',
        save: jest.fn().mockResolvedValue(this),
      };

      (CommentModel.findById as jest.Mock).mockResolvedValue(mockComment);
      (LikeModel.findOne as jest.Mock).mockResolvedValue(null);
      (LikeModel as any).mockImplementation(() => mockLike);
      (CommentModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockComment);

      const result = await likeService.like(mockLikeData);

      expect(CommentModel.findById).toHaveBeenCalledWith('comment123');
      expect(CommentModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'comment123',
        { $inc: { likeCount: 1 } }
      );
    });

    it('should throw error when post not found', async () => {
      (PostModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(likeService.like(mockLikeData)).rejects.toThrow(
        LIKE_ERROR.POST_NOT_FOUND
      );

      expect(PostModel.findById).toHaveBeenCalledWith('post123');
    });

    it('should throw error when already liked', async () => {
      const mockPost = { _id: 'post123', title: 'Test Post' };
      const existingLike = {
        _id: 'like123',
        user: 'user123',
        likeable: 'post123',
        likeableType: 'Post',
      };

      (PostModel.findById as jest.Mock).mockResolvedValue(mockPost);
      (LikeModel.findOne as jest.Mock).mockResolvedValue(existingLike);

      await expect(likeService.like(mockLikeData)).rejects.toThrow(
        LIKE_ERROR.ALREADY_LIKED
      );

      expect(LikeModel.findOne).toHaveBeenCalled();
    });
  });

  describe('unlike', () => {
    const mockUnlikeData = {
      userId: 'user123',
      likeableId: 'post123',
      likeableType: 'Post' as const,
    };

    it('should remove like from post successfully', async () => {
      const mockLike = {
        _id: 'like123',
        user: 'user123',
        likeable: 'post123',
        likeableType: 'Post',
      };

      (LikeModel.findOneAndDelete as jest.Mock).mockResolvedValue(mockLike);
      (PostModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

      await likeService.unlike(mockUnlikeData);

      expect(LikeModel.findOneAndDelete).toHaveBeenCalled();
      expect(PostModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'post123',
        { $inc: { likeCount: -1 } }
      );
    });

    it('should remove like from comment successfully', async () => {
      const mockUnlikeData = {
        userId: 'user123',
        likeableId: 'comment123',
        likeableType: 'Comment' as const,
      };

      const mockLike = {
        _id: 'like123',
        user: 'user123',
        likeable: 'comment123',
        likeableType: 'Comment',
      };

      (LikeModel.findOneAndDelete as jest.Mock).mockResolvedValue(mockLike);
      (CommentModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

      await likeService.unlike(mockUnlikeData);

      expect(CommentModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'comment123',
        { $inc: { likeCount: -1 } }
      );
    });

    it('should throw error when like not found', async () => {
      (LikeModel.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(likeService.unlike(mockUnlikeData)).rejects.toThrow(
        LIKE_ERROR.LIKE_NOT_FOUND
      );
    });
  });

  describe('hasUserLiked', () => {
    it('should return true when user has liked', async () => {
      const mockQuery = {
        userId: 'user123',
        likeableId: 'post123',
        likeableType: 'Post' as const,
      };

      const mockLike = {
        _id: 'like123',
        user: 'user123',
        likeable: 'post123',
      };

      (LikeModel.findOne as jest.Mock).mockResolvedValue(mockLike);

      const result = await likeService.hasUserLiked(mockQuery);

      expect(result).toBe(true);
      expect(LikeModel.findOne).toHaveBeenCalled();
    });

    it('should return false when user has not liked', async () => {
      const mockQuery = {
        userId: 'user123',
        likeableId: 'post123',
        likeableType: 'Post' as const,
      };

      (LikeModel.findOne as jest.Mock).mockResolvedValue(null);

      const result = await likeService.hasUserLiked(mockQuery);

      expect(result).toBe(false);
    });
  });

  describe('getLikesByEntity', () => {
    it('should return likes for a post', async () => {
      const mockQuery = {
        likeableId: 'post123',
        likeableType: 'Post' as const,
      };

      const mockLikes = [
        { _id: 'like1', user: { name: 'User 1' }, likeable: 'post123' },
        { _id: 'like2', user: { name: 'User 2' }, likeable: 'post123' },
      ];

      (LikeModel.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockLikes),
          }),
        }),
      });

      const result = await likeService.getLikesByEntity(mockQuery);

      expect(result).toHaveLength(2);
      expect(LikeModel.find).toHaveBeenCalled();
    });

    it('should return empty array when no likes exist', async () => {
      const mockQuery = {
        likeableId: 'post123',
        likeableType: 'Post' as const,
      };

      (LikeModel.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await likeService.getLikesByEntity(mockQuery);

      expect(result).toEqual([]);
    });
  });

  describe('getLikesByUser', () => {
    it('should return all likes by a user', async () => {
      const mockQuery = {
        userId: 'user123',
      };

      const mockLikes = [
        { _id: 'like1', user: 'user123', likeable: 'post1' },
        { _id: 'like2', user: 'user123', likeable: 'post2' },
        { _id: 'like3', user: 'user123', likeable: 'comment1' },
      ];

      (LikeModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockLikes),
        }),
      });

      const result = await likeService.getLikesByUser(mockQuery);

      expect(result).toHaveLength(3);
      expect(LikeModel.find).toHaveBeenCalled();
    });

    it('should return empty array when user has no likes', async () => {
      const mockQuery = {
        userId: 'user123',
      };

      (LikeModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      });

      const result = await likeService.getLikesByUser(mockQuery);

      expect(result).toEqual([]);
    });
  });
});
