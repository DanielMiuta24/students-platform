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
import { CommentModel } from '../../comment/models';
import { LikeModel } from '../../like/models';
import { followService } from '../../follow/services';

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
      .populate('author', 'name username avatar email type')
      .populate('category', 'name slug')
      .populate('images')
      .exec();
  }

  async getPostBySlug(slug: string): Promise<PostDoc | null> {
    return PostModel.findOne({ slug })
      .populate('author', 'name username avatar email type')
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

    const imageIds = await this.handleImages(files, data.existingImages || data.images, authorId);

    const updateData = new PostUpdateBuilder()
      .fromDTO(data)
      .setImages(imageIds as any)
      .build();

    const post = await PostModel.findByIdAndUpdate(
      postId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('author', 'name username avatar email type')
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
      .populate('author', 'name username avatar email type')
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

  async incrementViewCount(postId: string, userId?: string): Promise<void> {
    if (!userId) {
      await PostModel.findByIdAndUpdate(
        postId,
        { $inc: { viewCount: 1 } }
      );
      return;
    }

    const post = await PostModel.findById(postId).select('viewedBy');
    if (!post) {
      return;
    }

    const alreadyViewed = post.viewedBy?.some(
      (viewerId) => viewerId.toString() === userId
    );

    if (!alreadyViewed) {
      await PostModel.findByIdAndUpdate(
        postId,
        {
          $addToSet: { viewedBy: userId },
          $inc: { viewCount: 1 }
        }
      );
    }
  }

  private async handleImages(
    files: UploadedFile[] | undefined,
    existingImages: Array<{ url: string; alt?: string }> | undefined,
    userId: string
  ): Promise<string[]> {
    const imageIds: string[] = [];

    if (files && files.length > 0) {
      const uploadedImages = await imageService.uploadImagesForPost(files, userId);
      imageIds.push(...uploadedImages.map(img => img.imageId));
    }

    if (existingImages && existingImages.length > 0) {
      const urls = existingImages.map(img => img.url);
      const isValid = await imageService.validateImagesOwnership(urls, userId);
      if (!isValid) {
        throw new Error(POST_ERROR.INVALID_IMAGES);
      }
      const existingImageIds = await imageService.getImageIdsByUrls(urls);
      imageIds.push(...existingImageIds);
    }

    return imageIds;
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
    const {
      cursor,
      limit = this.DEFAULT_LIMIT,
      preferredCategories = [],
      userId,
      followingIds = [],
      friendIds = []
    } = params;

    let friends = friendIds;
    let following = followingIds;

    if (userId && (friendIds.length === 0 || followingIds.length === 0)) {
      [friends, following] = await Promise.all([
        followService.getFriendIds(userId),
        followService.getFollowingIds(userId)
      ]);
    }

    const queryBuilder = userId
      ? new PostQueryBuilder().setFeedVisibilityForUser(userId, friends)
      : new PostQueryBuilder().setPublicFeedDefaults();

    if (cursor) {
      queryBuilder.setCursor(cursor);
    }

    const query = queryBuilder.build();

    const posts = await PostModel.find(query)
      .populate('author', 'name username avatar email type')
      .populate('category', 'name slug')
      .populate('images')
      .sort({ _id: -1 })
      .limit(limit * 3)
      .exec();

    const scoredPosts = posts.map(post => {
      const safePost = PostMapper.toSafePost(post);
      const score = PostScorer.calculateScore(post, {
        preferredCategories,
        currentUserId: userId,
        followingIds: following,
        friendIds: friends
      });
      return { ...safePost, score };
    });

    scoredPosts.sort((a, b) => (b.score || 0) - (a.score || 0));

    const resultPosts = scoredPosts.slice(0, limit);
    const nextCursor = resultPosts.length > 0
      ? resultPosts[resultPosts.length - 1].id
      : null;
    const hasMore = posts.length >= limit * 3;

    return {
      posts: resultPosts,
      nextCursor,
      hasMore
    };
  }

  async deletePost(postId: string, authorId: string): Promise<void> {
    const post = await PostModel.findById(postId).populate('images');

    if (!post) {
      throw new Error(POST_ERROR.NOT_FOUND);
    }

    const postAuthorId = typeof post.author === 'string'
      ? post.author
      : post.author!.toString();

    if (postAuthorId !== authorId) {
      throw new Error(POST_ERROR.UNAUTHORIZED);
    }

    const comments = await CommentModel.find({ post: postId }).select('_id');
    const commentIds = comments.map(c => c._id);

    if (commentIds.length > 0) {
      await LikeModel.deleteMany({
        likeable: { $in: commentIds },
        likeableType: 'Comment'
      });
    }

    await LikeModel.deleteMany({ likeable: postId, likeableType: 'Post' });

    await CommentModel.deleteMany({ post: postId });

    if (post.images && post.images.length > 0) {
      for (const image of post.images) {
        const imageDoc = typeof image === 'string' ? null : image;
        if (imageDoc && 'publicId' in imageDoc) {
          await imageService.deleteImage(imageDoc.publicId as string);
          await imageService.deleteImageFromDb(imageDoc._id.toString());
        }
      }
    }

    await PostModel.findByIdAndDelete(postId);
  }

  async updateVisibility(postId: string, visibility: 'public' | 'private', authorId: string): Promise<PostDoc> {
    const post = await PostModel.findById(postId);

    if (!post) {
      throw new Error(POST_ERROR.NOT_FOUND);
    }

    const postAuthorId = typeof post.author === 'string'
      ? post.author
      : post.author!.toString();

    if (postAuthorId !== authorId) {
      throw new Error(POST_ERROR.UNAUTHORIZED);
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { visibility },
      { new: true, runValidators: true }
    )
      .populate('author', 'name username avatar email type')
      .populate('category', 'name slug')
      .populate('images')
      .exec();

    return updatedPost!;
  }
}

export const postService = new PostService();
