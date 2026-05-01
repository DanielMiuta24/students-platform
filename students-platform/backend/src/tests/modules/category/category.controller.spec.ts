import { Request, Response, NextFunction } from 'express';
import { categoryController } from '../../../modules/category/category.controller';
import { categoryService } from '../../../modules/category/category.service';
import { CATEGORY_ERROR } from '../../../modules/category/category.constants';
import { createMockRequest, createMockResponse, createMockNext, createMockCategory } from '../../helpers';
import { expectErrorResponse } from '../../helpers';

jest.mock('../../../modules/category/category.service');

describe('CategoryController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();
    mockNext = createMockNext();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create category and return 201 status', async () => {
      const mockCategoryData = {
        name: 'Technology',
        description: 'Tech posts',
      };

      const mockCategory = createMockCategory(mockCategoryData);

      mockRequest.body = mockCategoryData;
      (categoryService.createCategory as jest.Mock).mockResolvedValue(mockCategory);

      await categoryController.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(categoryService.createCategory).toHaveBeenCalledWith(mockCategoryData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'cat123',
          name: 'Technology',
        })
      );
    });

    it('should return 409 when category name already exists', async () => {
      mockRequest.body = { name: 'Technology' };
      const error = new Error(CATEGORY_ERROR.NAME_EXISTS);
      (categoryService.createCategory as jest.Mock).mockRejectedValue(error);

      await categoryController.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expectErrorResponse(mockResponse, 409, 'Category with this name already exists');
    });

    it('should call next with error for unexpected errors', async () => {
      mockRequest.body = { name: 'Technology' };
      const error = new Error('Database error');
      (categoryService.createCategory as jest.Mock).mockRejectedValue(error);

      await categoryController.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getById', () => {
    it('should return category when found', async () => {
      const mockCategory = createMockCategory();

      mockRequest.params = { id: 'cat123' };
      (categoryService.getCategoryById as jest.Mock).mockResolvedValue(mockCategory);

      await categoryController.getById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(categoryService.getCategoryById).toHaveBeenCalledWith('cat123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'cat123',
          name: 'Technology',
        })
      );
    });

    it('should return 404 when category not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      const error = new Error(CATEGORY_ERROR.NOT_FOUND);
      (categoryService.getCategoryById as jest.Mock).mockRejectedValue(error);

      await categoryController.getById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expectErrorResponse(mockResponse, 404, 'Category not found');
    });
  });

  describe('getBySlug', () => {
    it('should return category when found by slug', async () => {
      const mockCategory = createMockCategory();

      mockRequest.params = { slug: 'technology' };
      (categoryService.getCategoryBySlug as jest.Mock).mockResolvedValue(mockCategory);

      await categoryController.getBySlug(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(categoryService.getCategoryBySlug).toHaveBeenCalledWith('technology');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 when category not found by slug', async () => {
      mockRequest.params = { slug: 'nonexistent' };
      const error = new Error(CATEGORY_ERROR.NOT_FOUND);
      (categoryService.getCategoryBySlug as jest.Mock).mockRejectedValue(error);

      await categoryController.getBySlug(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe('update', () => {
    it('should update category and return 200 status', async () => {
      const mockUpdateData = {
        name: 'Updated Technology',
        description: 'Updated description',
      };

      const mockUpdatedCategory = createMockCategory({
        ...mockUpdateData,
        slug: 'updated-technology',
      });

      mockRequest.params = { id: 'cat123' };
      mockRequest.body = mockUpdateData;
      (categoryService.updateCategory as jest.Mock).mockResolvedValue(mockUpdatedCategory);

      await categoryController.update(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(categoryService.updateCategory).toHaveBeenCalledWith('cat123', mockUpdateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'cat123',
          name: 'Updated Technology',
        })
      );
    });

    it('should return 404 when category not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      mockRequest.body = { name: 'Updated' };
      const error = new Error(CATEGORY_ERROR.NOT_FOUND);
      (categoryService.updateCategory as jest.Mock).mockRejectedValue(error);

      await categoryController.update(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expectErrorResponse(mockResponse, 404, 'Category not found');
    });

    it('should return 409 when updated name already exists', async () => {
      mockRequest.params = { id: 'cat123' };
      mockRequest.body = { name: 'Technology' };
      const error = new Error(CATEGORY_ERROR.NAME_EXISTS);
      (categoryService.updateCategory as jest.Mock).mockRejectedValue(error);

      await categoryController.update(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(409);
    });
  });

  describe('getAll', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        createMockCategory({ _id: 'cat1', name: 'Technology', slug: 'technology' }),
        createMockCategory({ _id: 'cat2', name: 'Science', slug: 'science' }),
      ];

      (categoryService.getAllCategories as jest.Mock).mockResolvedValue(mockCategories);

      await categoryController.getAll(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(categoryService.getAllCategories).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'cat1', name: 'Technology' }),
          expect.objectContaining({ id: 'cat2', name: 'Science' }),
        ])
      );
    });

    it('should return empty array when no categories exist', async () => {
      (categoryService.getAllCategories as jest.Mock).mockResolvedValue([]);

      await categoryController.getAll(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });
  });
});
