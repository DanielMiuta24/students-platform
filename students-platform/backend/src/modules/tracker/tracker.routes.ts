import { Router } from 'express';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { trackerController } from './tracker.controller';

const router = Router();

router.use(authMiddleware);
router.get('/', trackerController.list);
router.post('/', trackerController.create);
router.patch('/:id', trackerController.update);
router.delete('/:id', trackerController.remove);

export default router;
