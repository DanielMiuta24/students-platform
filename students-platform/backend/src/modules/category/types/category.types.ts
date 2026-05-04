import type { Types } from 'mongoose';

export interface CreateCategoryDTO {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateCategoryDTO {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  order?: number;
}

export interface SafeCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
