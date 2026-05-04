import type { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services';
import { CATEGORY_ERROR } from '../constants';
import { CategoryMapper } from '../mappers';

class CategoryController {
  private static readonly HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
  } as const;

  private static readonly ERROR_RESPONSES: Record<string, { status: number; message: string }> = {
    [CATEGORY_ERROR.NOT_FOUND]: {
      status: 404,
      message: 'Category not found',
    },
    [CATEGORY_ERROR.SLUG_INVALID]: {
      status: 400,
      message: 'Invalid slug format. Use kebab-case (e.g., my-category)',
    },
    [CATEGORY_ERROR.NAME_EXISTS]: {
      status: 409,
      message: 'Category with this name already exists',
    },
    [CATEGORY_ERROR.SLUG_EXISTS]: {
      status: 409,
      message: 'Category with this slug already exists',
    },
    [CATEGORY_ERROR.IN_USE]: {
      status: 409,
      message: 'Cannot deactivate category that is used by posts',
    },
  };

  private handleError(
    err: unknown,
    res: Response,
    next: NextFunction
  ): Response | void {
    if (!(err instanceof Error)) {
      return next(err);
    }

    const errorResponse = CategoryController.ERROR_RESPONSES[err.message];

    if (!errorResponse) {
      return next(err);
    }

    return res.status(errorResponse.status).json({
      message: errorResponse.message,
    });
  }

  private async handleCategoryOperation<T>(
    operation: () => Promise<T>,
    res: Response,
    next: NextFunction,
    statusCode: number = CategoryController.HTTP_STATUS.OK
  ): Promise<Response | void> {
    try {
      const result = await operation();
      const safeResult = Array.isArray(result)
        ? CategoryMapper.toSafeCategories(result as any)
        : CategoryMapper.toSafeCategory(result as any);

      return res.status(statusCode).json(safeResult);
    } catch (err) {
      return this.handleError(err, res, next);
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.handleCategoryOperation(
      () => categoryService.createCategory(req.body),
      res,
      next,
      CategoryController.HTTP_STATUS.CREATED
    );
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.handleCategoryOperation(
      () => categoryService.updateCategory(req.params.id, req.body),
      res,
      next
    );
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    return this.handleCategoryOperation(
      () => categoryService.getCategoryById(req.params.id),
      res,
      next
    );
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    return this.handleCategoryOperation(
      () => categoryService.getCategoryBySlug(req.params.slug),
      res,
      next
    );
  };

  getActive = async (_req: Request, res: Response, next: NextFunction) => {
    return this.handleCategoryOperation(
      () => categoryService.getActiveCategories(),
      res,
      next
    );
  };

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    return this.handleCategoryOperation(
      () => categoryService.getAllCategories(),
      res,
      next
    );
  };
}

export const categoryController = new CategoryController();