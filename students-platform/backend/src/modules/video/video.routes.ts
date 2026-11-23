import { Router } from 'express';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { videoController } from './video.controller';

const router = Router();

router.get('/', authMiddleware, videoController.list);
router.post('/', authMiddleware, videoController.submit);
router.get('/pending', authMiddleware, videoController.pending);
router.patch('/:id/approve', authMiddleware, videoController.approve);
router.delete('/:id', authMiddleware, videoController.remove);

export default router;
