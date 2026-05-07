/**
 * Frontend types matching backend Post API
 * Based on backend/src/modules/post/types/post.types.ts
 */

import type { LexicalEditorState } from './lexical';

export type PostStatus = 'draft' | 'published' | 'archived';
export type PostVisibility = 'public' | 'private' | 'friends';

export interface ImageMetadata {
  url: string;
  alt?: string;
  publicId?: string;
  storageKey?: string;
}

export interface SafeAuthor {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  type?: string;
}

export interface CreatePostPayload {
  title: string;
  content: string | LexicalEditorState;
  category: string;
  status?: PostStatus;
  visibility?: PostVisibility;
  images?: ImageMetadata[];
}

export interface UpdatePostPayload {
  title: string;
  content: string | LexicalEditorState;
  category: string;
  status: PostStatus;
  visibility: PostVisibility;
  images?: ImageMetadata[];
}

export interface SafePost {
  id: string;
  author: string | SafeAuthor;
  title: string;
  slug: string;
  content: string | LexicalEditorState;
  category?: string | { id: string; name: string; slug: string };
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

/**
 * Validation constraints matching backend
 */
export const POST_VALIDATION = {
  TITLE_MIN_LENGTH: 5,
  TITLE_MAX_LENGTH: 120,
  CONTENT_MAX_LENGTH: 5000,
  ALT_TEXT_MAX_LENGTH: 150,
  MAX_IMAGES: 3,
} as const;

/**
 * Status and visibility options
 */
export const POST_STATUS = {
  DRAFT: 'draft' as PostStatus,
  PUBLISHED: 'published' as PostStatus,
  ARCHIVED: 'archived' as PostStatus,
};

export const POST_VISIBILITY = {
  PUBLIC: 'public' as PostVisibility,
  PRIVATE: 'private' as PostVisibility,
  FRIENDS: 'friends' as PostVisibility,
};
