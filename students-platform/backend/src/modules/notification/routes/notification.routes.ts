import { Router } from 'express';
import { notificationController } from '../controllers';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, notificationController.getNotifications);

router.get('/unread-count', authMiddleware, notificationController.getUnreadCount);

router.patch('/mark-all-read', authMiddleware, notificationController.markAllAsRead);

router.patch('/:notificationId/read', authMiddleware, notificationController.markAsRead);

router.delete('/read', authMiddleware, notificationController.deleteAllRead);

router.delete('/:notificationId', authMiddleware, notificationController.deleteNotification);

export default router;
