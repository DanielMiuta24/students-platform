import { CategoryModel, type CategoryDoc } from '../models';
import type { CreateCategoryDTO, UpdateCategoryDTO } from '../types';
import { CATEGORY_ERROR } from '../constants';
import { PostModel } from '../../post/models';
import { CategoryCreateBuilder, CategoryUpdateBuilder } from '../builders';

export class CategoryService {
  async createCategory(data: CreateCategoryDTO): Promise<CategoryDoc> {
    const categoryData = new CategoryCreateBuilder()
      .fromDTO(data)
      .build();

    const nameExists = await CategoryModel.exists({ name: categoryData.name });
    if (nameExists) {
      throw new Error(CATEGORY_ERROR.NAME_EXISTS);
    }

    const category = new CategoryModel(categoryData);
    return category.save();
  }

  async updateCategory(categoryId: string, data: UpdateCategoryDTO): Promise<CategoryDoc> {
    const existingCategory = await CategoryModel.findById(categoryId);

    if (!existingCategory) {
      throw new Error(CATEGORY_ERROR.NOT_FOUND);
    }

    const updateData = new CategoryUpdateBuilder()
      .fromDTO(data)
      .build();

    if (updateData.name) {
      const nameExists = await CategoryModel.exists({
        name: updateData.name,
        _id: { $ne: categoryId },
      });
      if (nameExists) {
        throw new Error(CATEGORY_ERROR.NAME_EXISTS);
      }
    }

    if (updateData.isActive === false && existingCategory.isActive === true) {
      const postsUsingCategory = await PostModel.countDocuments({ category: categoryId });
      if (postsUsingCategory > 0) {
        throw new Error(CATEGORY_ERROR.IN_USE);
      }
    }

    const category = await CategoryModel.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    ).exec();

    return category!;
  }

  async getCategoryById(categoryId: string): Promise<CategoryDoc> {
    const category = await CategoryModel.findById(categoryId).exec();
    if (!category) {
      throw new Error(CATEGORY_ERROR.NOT_FOUND);
    }
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<CategoryDoc> {
    const category = await CategoryModel.findOne({ slug }).exec();
    if (!category) {
      throw new Error(CATEGORY_ERROR.NOT_FOUND);
    }
    return category;
  }

  async getActiveCategories(): Promise<CategoryDoc[]> {
    return CategoryModel.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .exec();
  }

  async getAllCategories(): Promise<CategoryDoc[]> {
    return CategoryModel.find()
      .sort({ order: 1, name: 1 })
      .exec();
  }
}

export const categoryService = new CategoryService();
