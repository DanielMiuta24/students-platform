import { PostService } from '../../../modules/post/services/post.service';
import { PostModel } from '../../../modules/post/models/post.model';
import { categoryService } from '../../../modules/category/services';
import { POST_ERROR } from '../../../modules/post/constants/post.constants';

jest.mock('../../../modules/post/models/post.model');
jest.mock('../../../modules/category/services', () => ({
  categoryService: {
    isActiveCategory: jest.fn(),
  },
}));

describe('PostService', () => {
  let postService: PostService;

  beforeEach(() => {
    postService = new PostService();
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create post successfully', async () => {
      const mockPostData = {
        title: 'Test Post',
        content: 'Test content',
        category: 'cat123',
        authorId: 'user123',
      };

      const savedPostMock = {
        _id: 'post123',
        ...mockPostData,
        populate: jest.fn().mockReturnThis(),
      };

      const mockPost = {
        _id: 'post123',
        ...mockPostData,
        save: jest.fn().mockResolvedValue(savedPostMock),
      };

      (categoryService.isActiveCategory as jest.Mock).mockResolvedValue(true);
      (PostModel as any).mockImplementation(() => mockPost);

      await postService.createPost(mockPostData);

      expect(categoryService.isActiveCategory).toHaveBeenCalledWith('cat123');
      expect(mockPost.save).toHaveBeenCalled();
    });

    it('should throw error when category not found', async () => {
      const mockPostData = {
        title: 'Test Post',
        content: 'Test content',
        category: 'nonexistent',
        authorId: 'user123',
      };

      (categoryService.isActiveCategory as jest.Mock).mockResolvedValue(false);

      await expect(postService.createPost(mockPostData)).rejects.toThrow(
        POST_ERROR.CATEGORY_NOT_FOUND
      );
    });

    it('should throw error when category is inactive', async () => {
      const mockPostData = {
        title: 'Test Post',
        content: 'Test content',
        category: 'cat123',
        authorId: 'user123',
      };

      (categoryService.isActiveCategory as jest.Mock).mockResolvedValue(false);

      await expect(postService.createPost(mockPostData)).rejects.toThrow(
        POST_ERROR.CATEGORY_NOT_FOUND
      );
    });
  });

  describe('getPostById', () => {
    it('should return post when found', async () => {
      const mockPost = {
        _id: 'post123',
        title: 'Test Post',
        content: 'Test content',
      };

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPost),
      };

      (PostModel.findById as jest.Mock).mockReturnValue(mockQuery);

      const result = await postService.getPostById('post123', 'user123');

      expect(PostModel.findById).toHaveBeenCalledWith('post123');
      expect(mockQuery.populate).toHaveBeenCalledWith('author', 'name username avatar email type');
      expect(mockQuery.populate).toHaveBeenCalledWith('category', 'name slug');
      expect(result).toEqual(mockPost);
    });

    it('should return null when post not found', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      (PostModel.findById as jest.Mock).mockReturnValue(mockQuery);

      const result = await postService.getPostById('nonexistent', 'user123');

      expect(result).toBeNull();
    });
  });

  describe('updatePost', () => {
    it('should update post successfully', async () => {
      const mockExistingPost = {
        _id: 'post123',
        title: 'Old Title',
        author: 'user123',
      };

      const mockUpdatedPost = {
        _id: 'post123',
        title: 'New Title',
        author: 'user123',
      };

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUpdatedPost),
      };

      (PostModel.findById as jest.Mock).mockResolvedValue(mockExistingPost);
      (categoryService.isActiveCategory as jest.Mock).mockResolvedValue(true);
      (PostModel.findByIdAndUpdate as jest.Mock).mockReturnValue(mockQuery);

      const result = await postService.updatePost(
        'post123',
        {
          title: 'New Title',
          content: 'New content',
          category: 'cat123',
          status: 'published',
          visibility: 'public'
        },
        'user123'
      );

      expect(PostModel.findById).toHaveBeenCalledWith('post123');
      expect(categoryService.isActiveCategory).toHaveBeenCalledWith('cat123');
      expect(result).toEqual(mockUpdatedPost);
    });

    it('should throw error when post not found', async () => {
      (PostModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        postService.updatePost('nonexistent', {
          title: 'New Title',
          content: 'New content',
          category: 'cat123',
          status: 'published',
          visibility: 'public'
        }, 'user123')
      ).rejects.toThrow(POST_ERROR.NOT_FOUND);
    });

    it('should throw error when user is not author', async () => {
      const mockExistingPost = {
        _id: 'post123',
        title: 'Old Title',
        author: 'user123',
      };

      (PostModel.findById as jest.Mock).mockResolvedValue(mockExistingPost);

      await expect(
        postService.updatePost('post123', {
          title: 'New Title',
          content: 'New content',
          category: 'cat123',
          status: 'published',
          visibility: 'public'
        }, 'user456')
      ).rejects.toThrow(POST_ERROR.UNAUTHORIZED);
    });

    it('should throw error when category not found', async () => {
      const mockExistingPost = {
        _id: 'post123',
        title: 'Old Title',
        author: 'user123',
      };

      (PostModel.findById as jest.Mock).mockResolvedValue(mockExistingPost);
      (categoryService.isActiveCategory as jest.Mock).mockResolvedValue(false);

      await expect(
        postService.updatePost('post123', {
          title: 'New Title',
          content: 'New content',
          category: 'nonexistent',
          status: 'published',
          visibility: 'public'
        }, 'user123')
      ).rejects.toThrow(POST_ERROR.CATEGORY_NOT_FOUND);
    });

    it('should throw error when category is inactive', async () => {
      const mockExistingPost = {
        _id: 'post123',
        title: 'Old Title',
        author: 'user123',
      };

      (PostModel.findById as jest.Mock).mockResolvedValue(mockExistingPost);
      (categoryService.isActiveCategory as jest.Mock).mockResolvedValue(false);

      await expect(
        postService.updatePost('post123', {
          title: 'New Title',
          content: 'New content',
          category: 'cat123',
          status: 'published',
          visibility: 'public'
        }, 'user123')
      ).rejects.toThrow(POST_ERROR.CATEGORY_NOT_FOUND);
    });
  });

  describe('incrementViewCount', () => {
    it('should increment view count', async () => {
      (PostModel.exists as jest.Mock).mockResolvedValue(false);
      (PostModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ viewCount: 101 });

      await postService.incrementViewCount('post123', 'user123');

      expect(PostModel.exists).toHaveBeenCalledWith({
        _id: 'post123',
        viewedBy: 'user123'
      });
      expect(PostModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'post123',
        {
          $inc: { viewCount: 1 },
          $addToSet: { viewedBy: 'user123' }
        }
      );
    });
  });
});
