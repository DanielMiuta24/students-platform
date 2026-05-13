import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { notificationService } from '../services';
import {
  NotificationQuerySchema,
  MarkAsReadSchema,
  DeleteNotificationSchema,
} from '../validators';
import { NOTIFICATION_ERRORS } from '../constants';

export class NotificationController {
  getNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;

      const validation = NotificationQuerySchema.safeParse(req.query);

      if (!validation.success) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.error.issues,
        });
      }

      const result = await notificationService.getNotifications({
        userId,
        ...validation.data,
      });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  getUnreadCount = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;

      const count = await notificationService.getUnreadCount(userId);

      return res.status(200).json({ count });
    } catch (err) {
      next(err);
    }
  };

  markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;

      const validation = MarkAsReadSchema.safeParse(req.params);

      if (!validation.success) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.error.issues,
        });
      }

      const notification = await notificationService.markAsRead(
        validation.data.notificationId,
        userId
      );

      return res.status(200).json(notification);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === NOTIFICATION_ERRORS.NOT_FOUND) {
          return res.status(404).json({ message: err.message });
        }
      }
      next(err);
    }
  };

  markAllAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;

      await notificationService.markAllAsRead(userId);

      return res.status(200).json({ message: 'All notifications marked as read' });
    } catch (err) {
      next(err);
    }
  };

  deleteNotification = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;

      const validation = DeleteNotificationSchema.safeParse(req.params);

      if (!validation.success) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.error.issues,
        });
      }

      await notificationService.deleteNotification(validation.data.notificationId, userId);

      return res.status(200).json({ message: 'Notification deleted' });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === NOTIFICATION_ERRORS.NOT_FOUND) {
          return res.status(404).json({ message: err.message });
        }
      }
      next(err);
    }
  };

  deleteAllRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;

      await notificationService.deleteAllRead(userId);

      return res.status(200).json({ message: 'All read notifications deleted' });
    } catch (err) {
      next(err);
    }
  };
}

export const notificationController = new NotificationController();
