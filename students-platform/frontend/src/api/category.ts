import type { Category } from '../types/category';
import { api } from '../services/api';

export const getActiveCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  } catch (error: any) {
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
    throw new Error(error.response?.data?.message || 'Failed to fetch category');
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  try {
    const response = await api.get<Category>(`/categories/slug/${slug}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch category');
  }
};
