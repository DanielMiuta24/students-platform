import { Request, Response, NextFunction } from 'express';
import { notificationController } from '../../../modules/notification/controllers/notification.controller';
import { notificationService } from '../../../modules/notification/services/notification.service';
import { NOTIFICATION_ERRORS } from '../../../modules/notification/constants';

jest.mock('../../../modules/notification/services/notification.service');

interface MockRequest extends Partial<Request> {
  user?: { id: string; email: string; type: string };
}

describe('NotificationController', () => {
  let mockRequest: MockRequest;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      user: { id: 'user123', email: 'test@example.com', type: 'Student' },
      query: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should get notifications successfully', async () => {
      const mockResult = {
        notifications: [
          {
            _id: 'notif1',
            recipient: { _id: 'user123', name: 'User' },
            actor: { _id: 'actor123', name: 'Actor' },
            type: 'comment',
            targetModel: 'Post',
            target: { _id: 'post123' },
            read: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
        unreadCount: 1,
      };

      mockRequest.query = { page: '1', limit: '20' };
      (notificationService.getNotifications as jest.Mock).mockResolvedValue(mockResult);

      await notificationController.getNotifications(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle validation errors', async () => {
      mockRequest.query = { page: 'invalid', limit: '20' };

      await notificationController.getNotifications(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          errors: expect.any(Array)
        })
      );
    });
  });

  describe('getUnreadCount', () => {
    it('should get unread count successfully', async () => {
      (notificationService.getUnreadCount as jest.Mock).mockResolvedValue(5);

      await notificationController.getUnreadCount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ count: 5 });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read successfully', async () => {
      const mockNotification = {
        _id: 'notif123',
        recipient: { _id: 'user123', name: 'User' },
        actor: { _id: 'actor123', name: 'Actor' },
        type: 'comment',
        targetModel: 'Post',
        target: { _id: 'post123' },
        read: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { notificationId: 'notif123' };
      (notificationService.markAsRead as jest.Mock).mockResolvedValue(mockNotification);

      await notificationController.markAsRead(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(notificationService.markAsRead).toHaveBeenCalledWith('notif123', 'user123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockNotification);
    });

    it('should handle notification not found', async () => {
      mockRequest.params = { notificationId: 'notif123' };
      (notificationService.markAsRead as jest.Mock).mockRejectedValue(
        new Error(NOTIFICATION_ERRORS.NOT_FOUND)
      );

      await notificationController.markAsRead(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: NOTIFICATION_ERRORS.NOT_FOUND,
      });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read successfully', async () => {
      (notificationService.markAllAsRead as jest.Mock).mockResolvedValue(undefined);

      await notificationController.markAllAsRead(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(notificationService.markAllAsRead).toHaveBeenCalledWith('user123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'All notifications marked as read',
      });
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification successfully', async () => {
      mockRequest.params = { notificationId: 'notif123' };
      (notificationService.deleteNotification as jest.Mock).mockResolvedValue(undefined);

      await notificationController.deleteNotification(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(notificationService.deleteNotification).toHaveBeenCalledWith('notif123', 'user123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Notification deleted' });
    });

    it('should handle notification not found', async () => {
      mockRequest.params = { notificationId: 'notif123' };
      (notificationService.deleteNotification as jest.Mock).mockRejectedValue(
        new Error(NOTIFICATION_ERRORS.NOT_FOUND)
      );

      await notificationController.deleteNotification(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: NOTIFICATION_ERRORS.NOT_FOUND,
      });
    });
  });

  describe('deleteAllRead', () => {
    it('should delete all read notifications successfully', async () => {
      (notificationService.deleteAllRead as jest.Mock).mockResolvedValue(undefined);

      await notificationController.deleteAllRead(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(notificationService.deleteAllRead).toHaveBeenCalledWith('user123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'All read notifications deleted',
      });
    });
  });
});
