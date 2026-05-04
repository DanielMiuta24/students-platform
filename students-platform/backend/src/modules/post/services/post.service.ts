import { PostModel, type PostDoc } from '../models/post.model';
import type {
  CreatePostDTO,
  UpdatePostDTO,
  GetPostsDTO,
  CursorPostsResult,
  GetScoredFeedDTO,
  ScoredFeedResult,
  ScoredPost
} from '../types/post.types';
import { POST_ERROR, POST_VALIDATION } from '../constants/post.constants';
import { PostQueryBuilder, PostCreateBuilder, PostUpdateBuilder } from '../builders';
import { PostMapper } from '../mappers';
import { CategoryModel } from '../../category/models';
import { PostScorer } from './post.scorer';
import { imageService, type UploadedFile, type UploadResult } from '../../image/services';

export class PostService {
  private readonly DEFAULT_LIMIT = POST_VALIDATION.DEFAULT_PAGINATION_LIMIT;

  async createPost(data: CreatePostDTO, files?: UploadedFile[]): Promise<PostDoc> {
    const category = await CategoryModel.findById(data.category);
    if (!category || !category.isActive) {
      throw new Error(POST_ERROR.CATEGORY_NOT_FOUND);
    }

    const imageIds = await this.handleImages(files, data.images, data.authorId);

    const postData = new PostCreateBuilder()
      .fromDTO(data)
      .setImages(imageIds as any)
      .build();

    const post = new PostModel(postData);
    return post.save();
  }

  async getPostById(postId: string): Promise<PostDoc | null> {
    return PostModel.findById(postId)
      .populate('author', 'name username avatar email')
      .populate('category', 'name slug')
      .populate('images')
      .exec();
  }

  async getPostBySlug(slug: string): Promise<PostDoc | null> {
    return PostModel.findOne({ slug })
      .populate('author', 'name username avatar email')
      .populate('category', 'name slug')
      .populate('images')
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

    const imageIds = await this.handleImages(files, data.images, authorId);

    const updateData = new PostUpdateBuilder()
      .fromDTO(data)
      .setImages(imageIds.length > 0 ? (imageIds as any) : undefined)
      .build();

    const post = await PostModel.findByIdAndUpdate(
      postId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('author', 'name username avatar email')
      .populate('category', 'name slug')
      .populate('images')
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
      .populate('images')
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

  private async handleImages(
    files: UploadedFile[] | undefined,
    existingImages: Array<{ url: string; alt?: string }> | undefined,
    userId: string
  ): Promise<string[]> {
    if (files && files.length > 0) {
      const uploadedImages = await imageService.uploadImagesForPost(files, userId);
      return uploadedImages.map((img: UploadResult) => img.imageId);
    }

    if (existingImages && existingImages.length > 0) {
      const urls = existingImages.map(img => img.url);
      const isValid = await imageService.validateImagesOwnership(urls, userId);
      if (!isValid) {
        throw new Error(POST_ERROR.INVALID_IMAGES);
      }
      const imageIds = await imageService.getImageIdsByUrls(urls);
      return imageIds;
    }

    return [];
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
      .populate('images')
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
