import { Router } from 'express';
import { jobController } from '../controllers/job.controller';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';

const router = Router();

// Specific static routes first to avoid being captured by /:id
router.get('/saved', authMiddleware, jobController.getSavedJobs);
router.get('/my-jobs', authMiddleware, jobController.getMyJobs);

// Public routes
router.get('/', jobController.searchJobs);
router.get('/:id', jobController.getJobById);

// Authenticated routes
router.post('/', authMiddleware, jobController.createJob);
router.put('/:id', authMiddleware, jobController.updateJob);
router.delete('/:id', authMiddleware, jobController.deleteJob);
router.post('/:id/save', authMiddleware, jobController.saveJob);
router.delete('/:id/save', authMiddleware, jobController.unsaveJob);
router.patch('/:id/close', authMiddleware, jobController.closeJob);

export default router;
