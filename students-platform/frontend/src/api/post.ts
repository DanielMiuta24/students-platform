import type { CreatePostPayload, UpdatePostPayload, SafePost, CursorPostsResult } from '../types/post';
import { secureApi } from '../services/secureApi';
import { api } from '../services/api';

export const createPost = async (formData: FormData): Promise<SafePost> => {
  try {
    const response = await secureApi.post<SafePost>('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
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

export const updatePost = async (postId: string, formData: FormData): Promise<SafePost> => {
  try {
    const response = await secureApi.put<SafePost>(`/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
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

export const getPostFeed = async (cursor?: string, limit: number = 10): Promise<CursorPostsResult> => {
  try {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());

    const response = await api.get<CursorPostsResult>(`/posts/feed?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch posts');
  }
};

export const getPostById = async (postId: string, incrementView: boolean = false): Promise<{ post: SafePost }> => {
  try {
    const params = incrementView ? '?incrementView=true' : '';
    const response = await api.get<{ post: SafePost }>(`/posts/${postId}${params}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch post');
  }
};

export const getPostBySlug = async (slug: string, incrementView: boolean = false): Promise<{ post: SafePost }> => {
  try {
    const params = incrementView ? '?incrementView=true' : '';
    const response = await api.get<{ post: SafePost }>(`/posts/slug/${slug}${params}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch post');
  }
};

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
    throw new Error(error.response?.data?.message || 'Failed to fetch category posts');
  }
};

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
    throw new Error(error.response?.data?.message || 'Failed to fetch author posts');
  }
};

export const deletePost = async (postId: string): Promise<void> => {
  try {
    await secureApi.delete(`/posts/${postId}`);
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to delete a post');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to delete this post');
    } else if (error.response?.status === 404) {
      throw new Error('Post not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to delete post');
  }
};

export const updatePostVisibility = async (
  postId: string,
  visibility: 'public' | 'private' | 'friends'
): Promise<SafePost> => {
  try {
    const response = await secureApi.patch<SafePost>(`/posts/${postId}/visibility`, {
      visibility,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to update post visibility');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to update this post');
    } else if (error.response?.status === 404) {
      throw new Error('Post not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to update post visibility');
  }
};
