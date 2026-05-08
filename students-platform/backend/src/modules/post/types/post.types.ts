import type { PostDoc } from '../models/post.model';
import type { PostStatus, PostVisibility } from '../../shared/constants';
import type { PostContent } from './post-content.types';

export interface CreatePostDTO {
  authorId: string;
  title: string;
  content: PostContent;
  category: string;
  status?: PostStatus;
  visibility?: PostVisibility;
  images?: ImageMetadata[];
}

export interface UpdatePostDTO {
  title: string;
  content: PostContent;
  category: string;
  status: PostStatus;
  visibility?: PostVisibility;
  images?: ImageMetadata[];
  existingImages?: ImageMetadata[];
}

export interface ImageMetadata {
  url: string;
  alt?: string;
  publicId?: string;
  storageKey?: string;
}

export interface GetPostsDTO {
  cursor?: string;
  limit?: number;
  status?: PostStatus;
  visibility?: PostVisibility;
  categoryId?: string;
  authorId?: string;
}

export interface SafeAuthor {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  type?: string;
}

export interface SafePost {
  id: string;
  author: string | SafeAuthor;
  title: string;
  slug: string;
  content: PostContent;
  category?: string;
  status: PostStatus;
  visibility: PostVisibility;
  images: ImageMetadata[];
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CursorPostsResult {
  posts: SafePost[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface GetScoredFeedDTO {
  cursor?: string;
  limit?: number;
  preferredCategories?: string[];
  userId?: string;
  followingIds?: string[];
  friendIds?: string[];
}

export interface ScoredPost extends SafePost {
  score?: number;
}

export interface ScoredFeedResult {
  posts: ScoredPost[];
  nextCursor: string | null;
  hasMore: boolean;
}
