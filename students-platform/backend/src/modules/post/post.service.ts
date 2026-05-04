import { PostModel, type PostDoc } from './post.model';
import type {
  CreatePostDTO,
  UpdatePostDTO,
  GetPostsDTO,
  CursorPostsResult,
  GetScoredFeedDTO,
  ScoredFeedResult,
  ScoredPost
} from './post.types';
import { POST_ERROR, POST_VALIDATION } from './post.constants';
import { PostQueryBuilder, PostCreateBuilder, PostUpdateBuilder } from './builders';
import { PostMapper } from './mappers';
import { CategoryModel } from '../category/category.model';
import { PostScorer } from './post.scorer';
import { uploadService, type UploadedFile } from '../../shared/services/upload';

export class PostService {
  private readonly DEFAULT_LIMIT = POST_VALIDATION.DEFAULT_PAGINATION_LIMIT;

  async createPost(data: CreatePostDTO, files?: UploadedFile[]): Promise<PostDoc> {

    const category = await CategoryModel.findById(data.category);
    if (!category || !category.isActive) {
      throw new Error(POST_ERROR.CATEGORY_NOT_FOUND);
    }

    let imageUrls: { url: string; alt: string }[] = [];
    if (files && files.length > 0) {
      const uploadedImages = await uploadService.uploadImagesForPost(files);
      imageUrls = uploadedImages.map(img => ({
        url: img.url,
        alt: ''
      }));
    }

    const postData = new PostCreateBuilder()
      .fromDTO({ ...data, images: imageUrls })
      .build();

    const post = new PostModel(postData);
    return post.save();
  }

  async getPostById(postId: string): Promise<PostDoc | null> {
    return PostModel.findById(postId)
      .populate('author', 'name username avatar email')
      .populate('category', 'name slug')
      .exec();
  }

  async updatePost(postId: string, data: UpdatePostDTO, authorId: string, files?: UploadedFile[]): Promise<PostDoc | null> {
    const existingPost = await PostModel.findById(postId);

    if (!existingPost) {
      throw new Error(POST_ERROR.NOT_FOUND);
    }

    const postAuthorId = typeof existingPost.author === 'string'
      ? existingPost.author
      : existingPost.author!.toString();

    if (postAuthorId !== authorId) {
      throw new Error(POST_ERROR.UNAUTHORIZED);
    }

    const category = await CategoryModel.findById(data.category);
    if (!category || !category.isActive) {
      throw new Error(POST_ERROR.CATEGORY_NOT_FOUND);
    }

    let imageUrls: { url: string; alt: string }[] | undefined;
    if (files && files.length > 0) {
      const uploadedImages = await uploadService.uploadImagesForPost(files);
      imageUrls = uploadedImages.map(img => ({
        url: img.url,
        alt: ''
      }));
    }

    const updateData = new PostUpdateBuilder()
      .fromDTO(imageUrls ? { ...data, images: imageUrls } : data)
      .build();

    const post = await PostModel.findByIdAndUpdate(
      postId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('author', 'name username avatar email')
      .populate('category', 'name slug')
      .exec();

    return post;
  }

  async getFeed(params: GetPostsDTO): Promise<CursorPostsResult> {
    const {
      limit = this.DEFAULT_LIMIT,
    } = params;

    const query = new PostQueryBuilder()
      .fromDTO(params)
      .build();

    const posts = await PostModel.find(query)
      .populate('author', 'name username avatar email')
      .populate('category', 'name slug')
      .sort({ _id: -1 })
      .limit(limit + 1)
      .exec();

    return this.buildCursorResult(posts, limit);
  }

  async getPostsByCategory(categoryId: string, cursor?: string, limit?: number): Promise<CursorPostsResult> {
    return this.getFeed({
      categoryId,
      cursor,
      limit,
      status: 'published',
      visibility: 'public',
    });
  }

  async getPostsByAuthor(authorId: string, cursor?: string, limit?: number): Promise<CursorPostsResult> {
    return this.getFeed({
      authorId,
      cursor,
      limit,
    });
  }

  async incrementViewCount(postId: string): Promise<void> {
    await PostModel.findByIdAndUpdate(
      postId,
      { $inc: { viewCount: 1 } }
    );
  }

  private buildCursorResult(posts: PostDoc[], limit: number): CursorPostsResult {
    const hasMore = posts.length > limit;
    const resultPosts = hasMore ? posts.slice(0, limit) : posts;

    const nextCursor = hasMore && resultPosts.length > 0
      ? resultPosts[resultPosts.length - 1]._id.toString()
      : null;

    return {
      posts: PostMapper.toSafePosts(resultPosts),
      nextCursor,
      hasMore,
    };
  }

  async getScoredFeed(params: GetScoredFeedDTO): Promise<ScoredFeedResult> {
    const { limit = this.DEFAULT_LIMIT, preferredCategories = [] } = params;

    const posts = await PostModel.find({
      status: 'published',
      visibility: 'public'
    })
      .populate('author', 'name username avatar email')
      .populate('category', 'name slug')
      .limit(limit * 3)
      .exec();

    const scoredPosts = posts.map(post => {
      const safePost = PostMapper.toSafePost(post);
      const score = PostScorer.calculateScore(post, preferredCategories);
      return { ...safePost, score };
    });

    scoredPosts.sort((a, b) => (b.score || 0) - (a.score || 0));

    return {
      posts: scoredPosts.slice(0, limit)
    };
  }
}

export const postService = new PostService();
