import type { Category } from '../types/category';
import { api } from '../services/api';

export const getActiveCategories = async (): Promise<Category[]> => {
  try {
    console.log('[CategoryAPI] Fetching active categories');
    const response = await api.get<Category[]>('/categories');
    console.log('[CategoryAPI] Categories fetched successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[CategoryAPI] Failed to fetch categories:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    if (!error.response) {
      throw new Error('Network error: Cannot connect to server');
    }

    throw new Error(error.response?.data?.message || 'Failed to fetch categories');
  }
};

export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('[CategoryAPI] Failed to fetch category:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch category');
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  try {
    const response = await api.get<Category>(`/categories/slug/${slug}`);
    return response.data;
  } catch (error: any) {
    console.error('[CategoryAPI] Failed to fetch category:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch category');
  }
};
