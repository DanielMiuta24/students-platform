import { CategoryModel } from '../../../modules/category/models';
import { PostModel } from '../../../modules/post/models';
import { categoryService } from '../../../modules/category/services';
import { CATEGORY_ERROR } from '../../../modules/category/constants';

jest.mock('../../../modules/category/models');
jest.mock('../../../modules/post/models');

describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    const mockCategoryData = {
      name: 'Technology',
      description: 'Tech related posts',
    };

    it('should create category successfully', async () => {
      const mockCategory = {
        _id: 'cat123',
        name: 'Technology',
        slug: 'technology',
        description: 'Tech related posts',
        isActive: true,
        save: jest.fn().mockResolvedValue(this),
      };

      (CategoryModel.exists as jest.Mock).mockResolvedValue(null);
      (CategoryModel as any).mockImplementation(() => mockCategory);

      const result = await categoryService.createCategory(mockCategoryData);

      expect(CategoryModel.exists).toHaveBeenCalled();
      expect(mockCategory.save).toHaveBeenCalled();
    });

    it('should throw error when category name already exists', async () => {
      (CategoryModel.exists as jest.Mock).mockResolvedValue(true);

      await expect(
        categoryService.createCategory(mockCategoryData)
      ).rejects.toThrow(CATEGORY_ERROR.NAME_EXISTS);
    });
  });

  describe('getCategoryById', () => {
    it('should return category when found', async () => {
      const mockCategory = {
        _id: 'cat123',
        name: 'Technology',
        slug: 'technology',
        isActive: true,
      };

      (CategoryModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      const result = await categoryService.getCategoryById('cat123');

      expect(CategoryModel.findById).toHaveBeenCalledWith('cat123');
      expect(result).toEqual(mockCategory);
    });

    it('should throw error when category not found', async () => {
      (CategoryModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        categoryService.getCategoryById('nonexistent')
      ).rejects.toThrow(CATEGORY_ERROR.NOT_FOUND);
    });
  });

  describe('getCategoryBySlug', () => {
    it('should return category when found by slug', async () => {
      const mockCategory = {
        _id: 'cat123',
        name: 'Technology',
        slug: 'technology',
        isActive: true,
      };

      (CategoryModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      const result = await categoryService.getCategoryBySlug('technology');

      expect(CategoryModel.findOne).toHaveBeenCalledWith({ slug: 'technology' });
      expect(result).toEqual(mockCategory);
    });

    it('should throw error when category not found by slug', async () => {
      (CategoryModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        categoryService.getCategoryBySlug('nonexistent')
      ).rejects.toThrow(CATEGORY_ERROR.NOT_FOUND);
    });
  });

  describe('updateCategory', () => {
    const mockUpdateData = {
      name: 'Updated Technology',
      description: 'Updated description',
      isActive: true,
    };

    it('should update category successfully', async () => {
      const existingCategory = {
        _id: 'cat123',
        name: 'Technology',
        isActive: true,
      };

      const mockCategory = {
        _id: 'cat123',
        name: 'Updated Technology',
        slug: 'updated-technology',
        description: 'Updated description',
        isActive: true,
      };

      (CategoryModel.findById as jest.Mock).mockResolvedValue(existingCategory);
      (CategoryModel.exists as jest.Mock).mockResolvedValue(null);
      (PostModel.countDocuments as jest.Mock).mockResolvedValue(0);
      (CategoryModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      const result = await categoryService.updateCategory('cat123', mockUpdateData);

      expect(CategoryModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    });

    it('should throw error when updated name already exists', async () => {
      const existingCategory = {
        _id: 'cat123',
        name: 'Technology',
        isActive: true,
      };

      (CategoryModel.findById as jest.Mock).mockResolvedValue(existingCategory);
      (CategoryModel.exists as jest.Mock).mockResolvedValue(true);

      await expect(
        categoryService.updateCategory('cat123', mockUpdateData)
      ).rejects.toThrow(CATEGORY_ERROR.NAME_EXISTS);
    });

    it('should throw error when category not found', async () => {
      (CategoryModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        categoryService.updateCategory('nonexistent', mockUpdateData)
      ).rejects.toThrow(CATEGORY_ERROR.NOT_FOUND);
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        {
          _id: 'cat1',
          name: 'Technology',
          slug: 'technology',
          isActive: true,
        },
        {
          _id: 'cat2',
          name: 'Science',
          slug: 'science',
          isActive: false,
        },
      ];

      (CategoryModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockCategories),
        }),
      });

      const result = await categoryService.getAllCategories();

      expect(CategoryModel.find).toHaveBeenCalledWith();
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no categories exist', async () => {
      (CategoryModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      });

      const result = await categoryService.getAllCategories();

      expect(result).toEqual([]);
    });
  });
});
