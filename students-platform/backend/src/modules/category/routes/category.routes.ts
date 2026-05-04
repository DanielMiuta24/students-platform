import { Router } from 'express';
import { categoryController } from '../controllers';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import { requireAdmin } from '../../../shared/middleware/role.middleware';
import {
  validateCreateCategory,
  validateUpdateCategory,
  validateCategoryId,
  validateCategorySlug,
} from '../validators';

const router = Router();

router.get('/', categoryController.getActive);
router.get('/admin/all', authMiddleware, requireAdmin, categoryController.getAll);
router.get('/slug/:slug', validateCategorySlug, categoryController.getBySlug);
router.get('/:id', validateCategoryId, categoryController.getById);
router.post('/', authMiddleware, requireAdmin, validateCreateCategory, categoryController.create);
router.put('/:id', authMiddleware, requireAdmin, validateCategoryId, validateUpdateCategory, categoryController.update);

export default router;
