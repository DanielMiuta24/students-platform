import { PostModel, type PostDoc } from '../models/post.model';
import type {
  CreatePostDTO,
  UpdatePostDTO,
  GetPostsDTO,
  CursorPostsResult,
  GetScoredFeedDTO,
  ScoredFeedResult,
  ScoredPost,
  SafePost
} from '../types/post.types';
import { POST_ERROR, POST_VALIDATION } from '../constants/post.constants';
import { PostQueryBuilder, PostCreateBuilder, PostUpdateBuilder } from '../builders';
import { PostMapper } from '../mappers';
import { categoryService } from '../../category/services';
import { communityService } from '../../community/services';
import { COMMUNITY_ROLE } from '../../community/constants';
import { PostScorer } from './post.scorer';
import { imageService, type UploadedFile } from '../../image/services';
import { commentService } from '../../comment/services';
import { likeService } from '../../like/services';
import { followService } from '../../follow/services';
import { notificationService } from '../../notification/services';
import { User } from '../../user/models';

export class PostService {
  private readonly DEFAULT_LIMIT = POST_VALIDATION.DEFAULT_PAGINATION_LIMIT;

  async createPost(data: CreatePostDTO, files?: UploadedFile[]): Promise<PostDoc> {
    if (data.communityId) {
      await this.validateCommunityPostPermission(data.communityId, data.authorId);
      const community = await communityService.getCommunityById(data.communityId, data.authorId);

      if (!community.category) {
        throw new Error(POST_ERROR.CATEGORY_NOT_FOUND);
      }

      data.category = typeof community.category === 'string'
        ? community.category
        : community.category._id.toString();
      data.visibility = 'community';
    } else {
      const isCategoryActive = await categoryService.isActiveCategory(data.category);
      if (!isCategoryActive) {
        throw new Error(POST_ERROR.CATEGORY_NOT_FOUND);
      }
    }

    const imageIds = await this.handleImages(files, data.images, data.authorId);

    const postData = new PostCreateBuilder()
      .fromDTO(data)
      .setImages(imageIds as any)
      .build();

    const post = new PostModel(postData);
    const savedPost = await post.save();

    if (data.communityId && savedPost.status === 'published') {
      await communityService.incrementPostCount(data.communityId);

      const community = await communityService.getCommunityById(data.communityId, data.authorId);
      const communityMemberIds = community.members
        ?.filter((m: any) => m.user.toString() !== data.authorId)
        .map((m: any) => m.user.toString()) || [];

      for (const memberId of communityMemberIds) {
        await notificationService.createNotification({
          recipientId: memberId,
          actorId: data.authorId,
          type: 'community_post',
          targetModel: 'Post',
          targetId: savedPost._id.toString(),
        }).catch(err => console.error('Failed to create community post notification:', err));
      }
    } else if (!data.communityId && savedPost.status === 'published') {
      const author = await User.findById(data.authorId).select('followers');
      if (author && author.followers && author.followers.length > 0) {
        const followerIds = author.followers.map(id => id.toString());

        for (const followerId of followerIds) {
          await notificationService.createNotification({
            recipientId: followerId,
            actorId: data.authorId,
            type: 'new_post',
            targetModel: 'Post',
            targetId: savedPost._id.toString(),
          }).catch(err => console.error('Failed to create new post notification:', err));
        }
      }
    }

    await savedPost.populate('author', 'name username avatar email type');
    await savedPost.populate('category', 'name slug');
    await savedPost.populate({
      path: 'community',
      select: 'name slug coverImage visibility',
      populate: {
        path: 'coverImage',
        select: 'url'
      }
    });
    await savedPost.populate('images');

    return savedPost;
  }

  async getPostById(postId: string, userId: string): Promise<PostDoc | null> {
    const post = await PostModel.findById(postId)
      .populate('author', 'name username avatar email type')
      .populate('category', 'name slug')
      .populate({
        path: 'community',
        select: 'name slug coverImage visibility',
        populate: {
          path: 'coverImage',
          select: 'url'
        }
      })
      .populate('images')
      .exec();

    if (!post) {
      return null;
    }

    if (post.community) {
      const communityId = typeof post.community === 'string'
        ? post.community
        : post.community._id.toString();

      const accessResult = await communityService.canAccessCommunity(communityId, userId);
      if (!accessResult.canAccess) {
        throw new Error(POST_ERROR.UNAUTHORIZED);
      }
    }

    return post;
  }

  async getPostBySlug(slug: string, userId: string): Promise<PostDoc | null> {
    const post = await PostModel.findOne({ slug })
      .populate('author', 'name username avatar email type')
      .populate('category', 'name slug')
      .populate({
        path: 'community',
        select: 'name slug coverImage visibility',
        populate: {
          path: 'coverImage',
          select: 'url'
        }
      })
      .populate('images')
      .exec();

    if (!post) {
      return null;
    }

    if (post.community) {
      const communityId = typeof post.community === 'string'
        ? post.community
        : post.community._id.toString();

      const accessResult = await communityService.canAccessCommunity(communityId, userId);
      if (!accessResult.canAccess) {
        throw new Error(POST_ERROR.UNAUTHORIZED);
      }
    }

    return post;
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

    // Prevent changing community association - posts should not be moved between communities
    const existingCommunityId = existingPost.community?.toString();
    if (data.communityId !== existingCommunityId) {
      if (existingCommunityId && !data.communityId) {
        throw new Error('Cannot remove post from community. Community posts must remain in their community.');
      }
      if (!existingCommunityId && data.communityId) {
        throw new Error('Cannot move regular post to a community. Create a new post in the community instead.');
      }
      if (existingCommunityId && data.communityId) {
        throw new Error('Cannot move post between communities.');
      }
    }

    if (data.communityId) {
      if (data.communityId !== existingPost.community?.toString()) {
        await this.validateCommunityPostPermission(data.communityId, authorId);
      }

      const community = await communityService.getCommunityById(data.communityId, authorId);

      if (!community.category) {
        throw new Error(POST_ERROR.CATEGORY_NOT_FOUND);
      }

      data.category = typeof community.category === 'string'
        ? community.category
        : community.category._id.toString();
      data.visibility = 'community';
    } else {
      const isCategoryActive = await categoryService.isActiveCategory(data.category);
      if (!isCategoryActive) {
        throw new Error(POST_ERROR.CATEGORY_NOT_FOUND);
      }
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
      .populate({
        path: 'community',
        select: 'name slug coverImage',
        populate: {
          path: 'coverImage',
          select: 'url'
        }
      })
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

  async getPostsByAuthor(authorId: string, viewerId: string, cursor?: string, limit?: number): Promise<CursorPostsResult> {
    const safeLimit = limit || this.DEFAULT_LIMIT;

    const queryBuilder = new PostQueryBuilder()
      .setAuthorFeedVisibility(authorId, viewerId);

    if (cursor) {
      queryBuilder.setCursor(cursor);
    }

    const query = queryBuilder.build();

    query.community = null;

    const posts = await PostModel.find(query)
      .populate('author', 'name username avatar email type')
      .populate('category', 'name slug')
      .populate({
        path: 'community',
        select: 'name slug visibility',
        populate: {
          path: 'coverImage',
          select: 'url'
        }
      })
      .populate('images')
      .sort({ _id: -1 })
      .limit(safeLimit + 1)
      .exec();

    return this.buildCursorResult(posts, safeLimit);
  }

  async incrementViewCount(postId: string, userId: string): Promise<void> {
    const alreadyViewed = await PostModel.exists({
      _id: postId,
      viewedBy: userId
    });

    if (alreadyViewed) {
      return;
    }

    await PostModel.findByIdAndUpdate(
      postId,
      {
        $inc: { viewCount: 1 },
        $addToSet: { viewedBy: userId }
      }
    );
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
    let memberCommunityIds: string[] = [];

    if (userId && (friendIds.length === 0 || followingIds.length === 0)) {
      [friends, following] = await Promise.all([
        followService.getFriendIds(userId),
        followService.getFollowingIds(userId)
      ]);
    }

    if (userId) {
      memberCommunityIds = await communityService.getMemberCommunityIds(userId);
    }

    const queryBuilder = userId
      ? new PostQueryBuilder().setFeedVisibilityForUserWithCommunities(userId, friends, memberCommunityIds)
      : new PostQueryBuilder().setPublicFeedDefaults();

    if (cursor) {
      queryBuilder.setCursor(cursor);
    }

    const query = queryBuilder.build();

    const posts = await PostModel.find(query)
      .populate('author', 'name username avatar email type')
      .populate('category', 'name slug')
      .populate({
        path: 'community',
        select: 'name slug visibility',
        populate: {
          path: 'coverImage',
          select: 'url'
        }
      })
      .populate('images')
      .sort({ _id: -1 })
      .limit(limit * 3)
      .exec();

    const scoredPosts = await Promise.all(posts.map(async (post) => {
      const safePost = PostMapper.toSafePost(post);
      await this.enrichWithAuthorCommunityRole(safePost);
      const score = PostScorer.calculateScore(post, {
        preferredCategories,
        currentUserId: userId,
        followingIds: following,
        friendIds: friends
      });
      return { ...safePost, score };
    }));

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

  async getCommunityScoredFeed(communityId: string, userId: string, cursor?: string, limit?: number): Promise<ScoredFeedResult> {
    const safeLimit = limit && limit > 0 && limit <= 100 ? limit : this.DEFAULT_LIMIT;

    // Check access - userId can be undefined for non-authenticated users viewing public communities
    const accessResult = await communityService.canAccessCommunity(communityId, userId);
    if (!accessResult.canAccess) {
      throw new Error(accessResult.reason);
    }

    const queryBuilder = new PostQueryBuilder()
      .setCommunityFeedDefaults(communityId);

    if (cursor) {
      queryBuilder.setCursor(cursor);
    }

    const query = queryBuilder.build();

    const posts = await PostModel.find(query)
      .populate('author', 'name username avatar email type')
      .populate('category', 'name slug')
      .populate({
        path: 'community',
        select: 'name slug coverImage visibility',
        populate: {
          path: 'coverImage',
          select: 'url'
        }
      })
      .populate('images')
      .sort({ isPinned: -1, _id: -1 })
      .limit(safeLimit * 3)
      .exec();

    const scoredPosts = posts.map(post => {
      const safePost = PostMapper.toSafePost(post);
      // Use community score for authenticated users, simple chronological for non-authenticated
      // Pinned posts get a massive boost to always appear first
      let score = userId ? PostScorer.calculateCommunityScore(post, userId) : Date.now();
      if (post.isPinned) {
        score += 999999999999; // Ensure pinned posts always come first
      }
      return { ...safePost, score };
    });

    scoredPosts.sort((a, b) => (b.score || 0) - (a.score || 0));

    const resultPosts = scoredPosts.slice(0, safeLimit);
    const nextCursor = resultPosts.length > 0
      ? resultPosts[resultPosts.length - 1].id
      : null;
    const hasMore = posts.length >= safeLimit * 3;

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

    // Check if user is the post owner
    const isOwner = postAuthorId === authorId;

    // For community posts, also check if user is a community admin
    let isAdmin = false;
    if (post.community) {
      const communityId = typeof post.community === 'string'
        ? post.community
        : post.community.toString();

      const community = await communityService.getCommunityById(communityId, authorId);

      // Check if user is the founder OR has admin role in members
      // founder might be populated as an object or just an ObjectId
      const founderId = typeof community.founder === 'string'
        ? community.founder
        : (community.founder as any)?._id?.toString() || community.founder?.toString();

      const isFounder = founderId === authorId;
      const hasAdminRole = community.members?.some((m: any) => {
        // m.user might be populated as an object or just an ObjectId
        const memberUserId = typeof m.user === 'string'
          ? m.user
          : (m.user as any)?._id?.toString() || m.user?.toString();
        const isMatch = memberUserId === authorId && m.role === COMMUNITY_ROLE.ADMIN;
        console.log('Checking member:', { memberUserId, authorId, role: m.role, isMatch });
        return isMatch;
      }) || false;

      isAdmin = isFounder || hasAdminRole;

      console.log('Delete authorization check:', {
        postId,
        authorId,
        isOwner,
        isFounder,
        hasAdminRole,
        isAdmin,
        founderId,
        membersCount: community.members?.length
      });
    }

    // User must be either the owner or a community admin
    if (!isOwner && !isAdmin) {
      throw new Error(POST_ERROR.UNAUTHORIZED);
    }

    await commentService.deleteCommentsByPost(postId);
    await likeService.deleteLikesByPost(postId);

    if (post.images && post.images.length > 0) {
      for (const image of post.images) {
        const imageDoc = typeof image === 'string' ? null : image;
        if (imageDoc && 'publicId' in imageDoc) {
          await imageService.deleteImage(imageDoc.publicId as string);
          await imageService.deleteImageFromDb(imageDoc._id.toString());
        }
      }
    }

    if (post.community && post.status === 'published') {
      const communityId = typeof post.community === 'string' ? post.community : post.community.toString();
      await communityService.decrementPostCount(communityId);
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

    // Prevent changing visibility of community posts
    if (post.community || post.visibility === 'community') {
      throw new Error('Cannot change visibility of community posts. Community posts always have community visibility.');
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

  async togglePinPost(postId: string, userId: string): Promise<PostDoc> {
    const post = await PostModel.findById(postId);

    if (!post) {
      throw new Error(POST_ERROR.NOT_FOUND);
    }

    // Only community posts can be pinned
    if (!post.community) {
      throw new Error('Only community posts can be pinned');
    }

    // Check if user is admin of the community
    const communityId = typeof post.community === 'string'
      ? post.community
      : post.community.toString();

    const community = await communityService.getCommunityById(communityId, userId);

    // Check if user is the founder OR has admin role in members
    // founder might be populated as an object or just an ObjectId
    const founderId = typeof community.founder === 'string'
      ? community.founder
      : (community.founder as any)?._id?.toString() || community.founder?.toString();

    const isFounder = founderId === userId;
    const hasAdminRole = community.members?.some((m: any) => {
      // m.user might be populated as an object or just an ObjectId
      const memberUserId = typeof m.user === 'string'
        ? m.user
        : (m.user as any)?._id?.toString() || m.user?.toString();
      return memberUserId === userId && m.role === COMMUNITY_ROLE.ADMIN;
    }) || false;

    const isAdmin = isFounder || hasAdminRole;

    if (!isAdmin) {
      throw new Error('Only community admins can pin posts');
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { isPinned: !post.isPinned },
      { new: true, runValidators: true }
    )
      .populate('author', 'name username avatar email type')
      .populate('category', 'name slug')
      .populate({
        path: 'community',
        select: 'name slug coverImage visibility',
        populate: {
          path: 'coverImage',
          select: 'url'
        }
      })
      .populate('images')
      .exec();

    return updatedPost!;
  }

  async deletePostsByCommunity(communityId: string): Promise<void> {
    const posts = await PostModel.find({ community: communityId }).populate('images').select('_id author images');

    for (const post of posts) {
      const postId = post._id.toString();

      await commentService.deleteCommentsByPost(postId);
      await likeService.deleteLikesByPost(postId);

      if (post.images && post.images.length > 0) {
        for (const image of post.images) {
          const imageDoc = typeof image === 'string' ? null : image;
          if (imageDoc && 'publicId' in imageDoc) {
            await imageService.deleteImage(imageDoc.publicId as string);
            await imageService.deleteImageFromDb(imageDoc._id.toString());
          }
        }
      }
    }

    await PostModel.deleteMany({ community: communityId });
  }

  async deletePostsByAuthorInCommunity(communityId: string, authorId: string): Promise<number> {
    const posts = await PostModel.find({
      community: communityId,
      author: authorId
    }).populate('images').select('_id images');

    let deletedCount = 0;

    for (const post of posts) {
      const postId = post._id.toString();

      await commentService.deleteCommentsByPost(postId);
      await likeService.deleteLikesByPost(postId);

      if (post.images && post.images.length > 0) {
        for (const image of post.images) {
          const imageDoc = typeof image === 'string' ? null : image;
          if (imageDoc && 'publicId' in imageDoc) {
            await imageService.deleteImage(imageDoc.publicId as string);
            await imageService.deleteImageFromDb(imageDoc._id.toString());
          }
        }
      }

      deletedCount++;
    }

    await PostModel.deleteMany({ community: communityId, author: authorId });

    if (deletedCount > 0) {
      await communityService.decrementPostCount(communityId, deletedCount);
    }

    return deletedCount;
  }

  private async validateCommunityPostPermission(communityId: string, userId: string): Promise<void> {
    await communityService.validatePostPermission(communityId, userId);
  }

  private async enrichWithAuthorCommunityRole(safePost: SafePost): Promise<void> {
    if (!safePost.community || typeof safePost.community === 'string') {
      return;
    }

    const communityId = safePost.community.id;
    const authorId = typeof safePost.author === 'string' ? safePost.author : safePost.author.id;

    if (!communityId || !authorId) {
      return;
    }

    try {
      const role = await communityService.getMemberRole(communityId, authorId);
      safePost.authorCommunityRole = role;
    } catch (error) {
      safePost.authorCommunityRole = null;
    }
  }

  async getPostsCountByAuthor(authorId: string): Promise<number> {
    const count = await PostModel.countDocuments({
      author: authorId,
      status: { $ne: 'draft' }
    });
    return count;
  }

  async getDraftsByAuthor(authorId: string): Promise<PostDoc[]> {
    const drafts = await PostModel.find({
      author: authorId,
      status: 'draft'
    })
      .populate('author', 'name username avatar email type')
      .populate('category', 'name slug')
      .populate({
        path: 'community',
        select: 'name slug visibility',
      })
      .populate('images')
      .sort({ updatedAt: -1 })
      .exec();

    return drafts;
  }
}

export const postService = new PostService();
