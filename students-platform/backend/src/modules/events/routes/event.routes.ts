import { Router } from 'express';
import { eventController } from '../controllers/event.controller';
import { authMiddleware, optionalAuthMiddleware } from '../../../shared/middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/upcoming', eventController.getUpcoming);

// Optional auth routes (public with optional user context)
router.get('/', optionalAuthMiddleware, eventController.searchEvents);
router.get('/:id', optionalAuthMiddleware, eventController.getById);

// Auth required routes
router.post('/', authMiddleware, eventController.createEvent);
router.put('/:id', authMiddleware, eventController.updateEvent);
router.delete('/:id', authMiddleware, eventController.deleteEvent);
router.post('/:id/attend', authMiddleware, eventController.attendEvent);
router.delete('/:id/attend', authMiddleware, eventController.unattendEvent);

export default router;
