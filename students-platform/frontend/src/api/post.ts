import type { CreatePostPayload, UpdatePostPayload, SafePost, CursorPostsResult } from '../types/post';
import { secureApi } from '../services/secureApi';
import { api } from '../services/api';

/**
 * Create a new post
 * Endpoint: POST /api/posts
 * Requires authentication
 */
export const createPost = async (formData: FormData): Promise<SafePost> => {
  try {
    console.log('[PostAPI] Creating post with FormData');

    // Log FormData contents for debugging
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`[PostAPI] ${key}: File - ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`[PostAPI] ${key}: ${value}`);
      }
    }

    const response = await secureApi.post<SafePost>('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('[PostAPI] Post created successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[PostAPI] Failed to create post:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Enhanced error message for user
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to create a post');
    } else if (error.response?.status === 400) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors && Array.isArray(backendErrors)) {
        throw new Error(backendErrors.map((e: any) => e.msg).join(', '));
      }
      throw new Error(error.response?.data?.message || 'Invalid post data');
    } else if (error.response?.status === 404) {
      throw new Error('Category not found or inactive');
    } else if (!error.response) {
      throw new Error('Network error: Cannot connect to server. Please check your connection.');
    }

    throw new Error(error.response?.data?.message || 'Failed to create post');
  }
};

/**
 * Update an existing post
 * Endpoint: PUT /api/posts/:postId
 * Requires authentication
 */
export const updatePost = async (postId: string, formData: FormData): Promise<SafePost> => {
  try {
    console.log(`[PostAPI] Updating post ${postId} with FormData`);

    const response = await secureApi.put<SafePost>(`/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('[PostAPI] Post updated successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[PostAPI] Failed to update post:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    if (error.response?.status === 401) {
      throw new Error('You must be logged in to update a post');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to update this post');
    } else if (error.response?.status === 404) {
      throw new Error('Post not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to update post');
  }
};

/**
 * Get post feed
 * Endpoint: GET /api/posts/feed
 */
export const getPostFeed = async (cursor?: string, limit: number = 10): Promise<CursorPostsResult> => {
  try {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());

    const response = await api.get<CursorPostsResult>(`/posts/feed?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error('[PostAPI] Failed to fetch feed:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch posts');
  }
};

/**
 * Get post by ID
 * Endpoint: GET /api/posts/:postId
 */
export const getPostById = async (postId: string): Promise<SafePost> => {
  try {
    const response = await api.get<SafePost>(`/posts/${postId}`);
    return response.data;
  } catch (error: any) {
    console.error('[PostAPI] Failed to fetch post:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch post');
  }
};

/**
 * Get post by slug
 * Endpoint: GET /api/posts/slug/:slug
 */
export const getPostBySlug = async (slug: string): Promise<SafePost> => {
  try {
    const response = await api.get<SafePost>(`/posts/slug/${slug}`);
    return response.data;
  } catch (error: any) {
    console.error('[PostAPI] Failed to fetch post by slug:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch post');
  }
};

/**
 * Get posts by category
 * Endpoint: GET /api/posts/category/:categoryId
 */
export const getPostsByCategory = async (
  categoryId: string,
  cursor?: string,
  limit: number = 10
): Promise<CursorPostsResult> => {
  try {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());

    const response = await api.get<CursorPostsResult>(
      `/posts/category/${categoryId}?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    console.error('[PostAPI] Failed to fetch category posts:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch category posts');
  }
};

/**
 * Get posts by author
 * Endpoint: GET /api/posts/author/:authorId
 */
export const getPostsByAuthor = async (
  authorId: string,
  cursor?: string,
  limit: number = 10
): Promise<CursorPostsResult> => {
  try {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());

    const response = await api.get<CursorPostsResult>(
      `/posts/author/${authorId}?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    console.error('[PostAPI] Failed to fetch author posts:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch author posts');
  }
};
