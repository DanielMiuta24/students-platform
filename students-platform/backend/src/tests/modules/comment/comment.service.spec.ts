import { commentService } from '../../../modules/comment/services';
import { CommentModel } from '../../../modules/comment/models';
import { PostModel } from '../../../modules/post/models';
import { LikeModel } from '../../../modules/like/models';

jest.mock('../../../modules/comment/models');
jest.mock('../../../modules/post/models');
jest.mock('../../../modules/like/models');

describe('CommentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createComment', () => {
    const mockCommentData = {
      postId: '507f1f77bcf86cd799439011',
      authorId: '507f1f77bcf86cd799439012',
      content: 'This is a test comment',
    };

    const mockSavedComment = {
      _id: '507f1f77bcf86cd799439013',
      post: '507f1f77bcf86cd799439011',
      author: '507f1f77bcf86cd799439012',
      content: 'This is a test comment',
      parentComment: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: jest.fn().mockResolvedValue(this),
      populate: jest.fn().mockReturnThis(),
    };

    it('should create a comment successfully', async () => {
      (PostModel.exists as jest.Mock).mockResolvedValue(true);
      (CommentModel as any).mockImplementation(() => mockSavedComment);

      const result = await commentService.createComment(mockCommentData);

      expect(PostModel.exists).toHaveBeenCalledWith({ _id: mockCommentData.postId });
      expect(mockSavedComment.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw POST_NOT_FOUND when post does not exist', async () => {
      (PostModel.exists as jest.Mock).mockResolvedValue(false);

      await expect(
        commentService.createComment(mockCommentData)
      ).rejects.toThrow('POST_NOT_FOUND');

      expect(PostModel.exists).toHaveBeenCalledWith({ _id: mockCommentData.postId });
    });

    it('should create a comment with parent comment', async () => {
      const dataWithParent = {
        ...mockCommentData,
        parentCommentId: '507f1f77bcf86cd799439014',
      };

      (PostModel.exists as jest.Mock).mockResolvedValue(true);
      (CommentModel.exists as jest.Mock).mockResolvedValue(true);
      (CommentModel as any).mockImplementation(() => mockSavedComment);

      await commentService.createComment(dataWithParent);

      expect(PostModel.exists).toHaveBeenCalledWith({ _id: dataWithParent.postId });
      expect(CommentModel.exists).toHaveBeenCalledWith({ _id: dataWithParent.parentCommentId });
      expect(mockSavedComment.save).toHaveBeenCalled();
    });

    it('should throw PARENT_COMMENT_NOT_FOUND when parent comment does not exist', async () => {
      const dataWithParent = {
        ...mockCommentData,
        parentCommentId: '507f1f77bcf86cd799439014',
      };

      (PostModel.exists as jest.Mock).mockResolvedValue(true);
      (CommentModel.exists as jest.Mock).mockResolvedValue(false);

      await expect(
        commentService.createComment(dataWithParent)
      ).rejects.toThrow('PARENT_COMMENT_NOT_FOUND');

      expect(CommentModel.exists).toHaveBeenCalledWith({ _id: dataWithParent.parentCommentId });
    });

    it('should trim content before saving', async () => {
      const dataWithSpaces = {
        ...mockCommentData,
        content: '  Content with spaces  ',
      };

      (PostModel.exists as jest.Mock).mockResolvedValue(true);
      const mockConstructor = jest.fn();
      (CommentModel as any).mockImplementation(mockConstructor);
      mockConstructor.mockReturnValue(mockSavedComment);

      await commentService.createComment(dataWithSpaces);

      expect(mockConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Content with spaces',
        })
      );
    });
  });

  describe('getCommentById', () => {
    const mockComment = {
      _id: '507f1f77bcf86cd799439013',
      post: '507f1f77bcf86cd799439011',
      author: { name: 'John Doe', username: 'johndoe', avatar: 'avatar.jpg' },
      content: 'Test comment',
      parentComment: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return a comment by ID', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockComment),
      };

      (CommentModel.findById as jest.Mock).mockReturnValue(mockQuery);

      const result = await commentService.getCommentById('507f1f77bcf86cd799439013');

      expect(CommentModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439013');
      expect(mockQuery.populate).toHaveBeenCalledWith('author', 'name username avatar');
      expect(mockQuery.populate).toHaveBeenCalledWith('post', 'title author');
      expect(result).toEqual(mockComment);
    });

    it('should return null when comment not found', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      (CommentModel.findById as jest.Mock).mockReturnValue(mockQuery);

      const result = await commentService.getCommentById('507f1f77bcf86cd799439999');

      expect(result).toBeNull();
    });
  });

  describe('getCommentsByPost', () => {
    const mockComments = [
      {
        _id: '1',
        post: '507f1f77bcf86cd799439011',
        author: { name: 'User 1' },
        content: 'Comment 1',
        parentComment: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        _id: '2',
        post: '507f1f77bcf86cd799439011',
        author: { name: 'User 2' },
        content: 'Comment 2',
        parentComment: null,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
    ];

    it('should return comments for a post with pagination', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockComments),
      };

      (CommentModel.find as jest.Mock).mockReturnValue(mockQuery);
      (CommentModel.countDocuments as jest.Mock).mockResolvedValue(2);

      const result = await commentService.getCommentsByPost({
        postId: '507f1f77bcf86cd799439011',
        page: 1,
        limit: 10,
      });

      expect(CommentModel.find).toHaveBeenCalledWith({
        post: '507f1f77bcf86cd799439011',
        parentComment: null,
      });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockQuery.skip).toHaveBeenCalledWith(0);
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual({
        comments: mockComments,
        total: 2,
        page: 1,
        limit: 10,
      });
    });

    it('should return only top-level comments when parentCommentId is null', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockComments),
      };

      (CommentModel.find as jest.Mock).mockReturnValue(mockQuery);
      (CommentModel.countDocuments as jest.Mock).mockResolvedValue(2);

      await commentService.getCommentsByPost({
        postId: '507f1f77bcf86cd799439011',
        parentCommentId: null,
      });

      expect(CommentModel.find).toHaveBeenCalledWith({
        post: '507f1f77bcf86cd799439011',
        parentComment: null,
      });
    });

    it('should return replies when parentCommentId is provided', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };

      (CommentModel.find as jest.Mock).mockReturnValue(mockQuery);
      (CommentModel.countDocuments as jest.Mock).mockResolvedValue(0);

      await commentService.getCommentsByPost({
        postId: '507f1f77bcf86cd799439011',
        parentCommentId: '507f1f77bcf86cd799439013',
      });

      expect(CommentModel.find).toHaveBeenCalledWith({
        post: '507f1f77bcf86cd799439011',
        parentComment: '507f1f77bcf86cd799439013',
      });
    });

    it('should calculate correct skip value for pagination', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };

      (CommentModel.find as jest.Mock).mockReturnValue(mockQuery);
      (CommentModel.countDocuments as jest.Mock).mockResolvedValue(0);

      await commentService.getCommentsByPost({
        postId: '507f1f77bcf86cd799439011',
        page: 3,
        limit: 10,
      });

      expect(mockQuery.skip).toHaveBeenCalledWith(20);
    });
  });

  describe('updateComment', () => {
    const mockUpdatedComment = {
      _id: '507f1f77bcf86cd799439013',
      post: {
        toString: () => '507f1f77bcf86cd799439011',
      },
      content: 'Updated content',
      author: { name: 'John Doe' },
    };

    it('should update comment content', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUpdatedComment),
      };

      (CommentModel.findByIdAndUpdate as jest.Mock).mockReturnValue(mockQuery);

      const result = await commentService.updateComment('507f1f77bcf86cd799439013', {
        content: 'Updated content',
      });

      expect(CommentModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439013',
        { content: 'Updated content' },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(mockUpdatedComment);
    });

    it('should trim content before updating', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUpdatedComment),
      };

      (CommentModel.findByIdAndUpdate as jest.Mock).mockReturnValue(mockQuery);

      await commentService.updateComment('507f1f77bcf86cd799439013', {
        content: '  Updated content  ',
      });

      expect(CommentModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439013',
        { content: 'Updated content' },
        { new: true, runValidators: true }
      );
    });

    it('should return null when comment not found', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      (CommentModel.findByIdAndUpdate as jest.Mock).mockReturnValue(mockQuery);

      const result = await commentService.updateComment('507f1f77bcf86cd799439999', {
        content: 'Updated content',
      });

      expect(result).toBeNull();
    });
  });

  describe('deleteComment', () => {
    it('should delete comment and its replies', async () => {
      const mockComment = {
        _id: '507f1f77bcf86cd799439013',
        post: '507f1f77bcf86cd799439011',
      };

      const mockChildComments = [
        { _id: '507f1f77bcf86cd799439014' },
        { _id: '507f1f77bcf86cd799439015' },
      ];

      const mockFindQuery = {
        select: jest.fn().mockResolvedValue(mockChildComments),
      };

      const mockDeleteQuery = {
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockComment),
      };

      (CommentModel.findById as jest.Mock).mockResolvedValue(mockComment);
      (CommentModel.find as jest.Mock).mockReturnValue(mockFindQuery);
      (CommentModel.findByIdAndDelete as jest.Mock).mockReturnValue(mockDeleteQuery);
      (CommentModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 2 });
      (LikeModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 5 });

      await commentService.deleteComment('507f1f77bcf86cd799439013');

      expect(CommentModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439013');
      expect(CommentModel.find).toHaveBeenCalledWith({ parentComment: '507f1f77bcf86cd799439013' });
      expect(mockFindQuery.select).toHaveBeenCalledWith('_id');
      expect(CommentModel.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439013');
      expect(CommentModel.deleteMany).toHaveBeenCalledWith({
        parentComment: '507f1f77bcf86cd799439013',
      });
    });
  });

  describe('getCommentCount', () => {
    it('should return comment count for a post', async () => {
      (CommentModel.countDocuments as jest.Mock).mockResolvedValue(15);

      const result = await commentService.getCommentCount('507f1f77bcf86cd799439011');

      expect(CommentModel.countDocuments).toHaveBeenCalledWith({
        post: '507f1f77bcf86cd799439011',
      });
      expect(result).toBe(15);
    });

    it('should return 0 when no comments exist', async () => {
      (CommentModel.countDocuments as jest.Mock).mockResolvedValue(0);

      const result = await commentService.getCommentCount('507f1f77bcf86cd799439011');

      expect(result).toBe(0);
    });
  });

  describe('getRepliesCount', () => {
    it('should return replies count for a comment', async () => {
      (CommentModel.countDocuments as jest.Mock).mockResolvedValue(5);

      const result = await commentService.getRepliesCount('507f1f77bcf86cd799439013');

      expect(CommentModel.countDocuments).toHaveBeenCalledWith({
        parentComment: '507f1f77bcf86cd799439013',
      });
      expect(result).toBe(5);
    });

    it('should return 0 when no replies exist', async () => {
      (CommentModel.countDocuments as jest.Mock).mockResolvedValue(0);

      const result = await commentService.getRepliesCount('507f1f77bcf86cd799439013');

      expect(result).toBe(0);
    });
  });

  describe('verifyCommentOwnership', () => {
    it('should return true when user owns the comment', () => {
      const mockComment: any = {
        author: {
          toString: () => '507f1f77bcf86cd799439012',
        },
      };

      const result = commentService.verifyCommentOwnership(mockComment, '507f1f77bcf86cd799439012');

      expect(result).toBe(true);
    });

    it('should return false when user does not own the comment', () => {
      const mockComment: any = {
        author: {
          toString: () => '507f1f77bcf86cd799439012',
        },
      };

      const result = commentService.verifyCommentOwnership(mockComment, '507f1f77bcf86cd799439999');

      expect(result).toBe(false);
    });
  });

  describe('toSafeComment', () => {
    it('should transform CommentDoc to SafeComment', () => {
      const mockComment: any = {
        _id: {
          toString: () => '507f1f77bcf86cd799439013',
        },
        post: {
          toString: () => '507f1f77bcf86cd799439011',
        },
        author: {
          toString: () => '507f1f77bcf86cd799439012',
        },
        content: 'Test comment',
        parentComment: null,
        likeCount: 0,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      const result = commentService.toSafeComment(mockComment);

      expect(result).toEqual({
        id: '507f1f77bcf86cd799439013',
        postId: '507f1f77bcf86cd799439011',
        authorId: '507f1f77bcf86cd799439012',
        content: 'Test comment',
        parentCommentId: null,
        likeCount: 0,
        createdAt: mockComment.createdAt,
        updatedAt: mockComment.updatedAt,
        author: undefined,
      });
    });

    it('should handle comment with parent comment', () => {
      const mockComment: any = {
        _id: {
          toString: () => '507f1f77bcf86cd799439013',
        },
        post: {
          toString: () => '507f1f77bcf86cd799439011',
        },
        author: {
          toString: () => '507f1f77bcf86cd799439012',
        },
        content: 'Reply comment',
        parentComment: {
          toString: () => '507f1f77bcf86cd799439014',
        },
        likeCount: 0,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      const result = commentService.toSafeComment(mockComment);

      expect(result.parentCommentId).toBe('507f1f77bcf86cd799439014');
    });
  });
});
