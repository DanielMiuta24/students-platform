import { Router } from 'express';
import { visaController } from '../controllers';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', visaController.searchGuides);
router.get('/country/:country', visaController.getByCountry);
router.get('/:id', visaController.getGuide);

// Authenticated routes
router.post('/', authMiddleware, visaController.createGuide);
router.put('/:id', authMiddleware, visaController.updateGuide);
router.delete('/:id', authMiddleware, visaController.deleteGuide);

export default router;
