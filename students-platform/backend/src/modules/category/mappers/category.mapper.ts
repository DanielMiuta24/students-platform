import type { CategoryDoc } from '../models';
import type { SafeCategory } from '../types';

/**
 * Mapper for converting CategoryDoc to SafeCategory (API response format)
 * Handles data transformation and serialization
 */
export class CategoryMapper {
  /**
   * Converts CategoryDoc to safe API response format
   */
  static toSafeCategory(category: CategoryDoc): SafeCategory {
    return {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
      icon: category.icon ?? undefined,
      isActive: category.isActive,
      order: category.order,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  /**
   * Converts array of CategoryDocs to SafeCategories
   */
  static toSafeCategories(categories: CategoryDoc[]): SafeCategory[] {
    return categories.map((category) => this.toSafeCategory(category));
  }
}
