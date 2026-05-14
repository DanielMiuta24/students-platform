import { notificationService } from '../../../modules/notification/services/notification.service';
import { NOTIFICATION_ERRORS } from '../../../modules/notification/constants';

const NotificationModel = require('../../../modules/notification/models/notification.model').NotificationModel;
const User = require('../../../modules/user/models/user.model').User;
const PostModel = require('../../../modules/post/models/post.model').PostModel;
const CommentModel = require('../../../modules/comment/models/comment.model').CommentModel;
const CommunityModel = require('../../../modules/community/models/community.model').CommunityModel;
const realtimeService = require('../../../modules/realtime').realtimeService;

jest.mock('../../../modules/notification/models/notification.model');
jest.mock('../../../modules/user/models/user.model');
jest.mock('../../../modules/post/models/post.model');
jest.mock('../../../modules/comment/models/comment.model');
jest.mock('../../../modules/community/models/community.model');
jest.mock('../../../modules/realtime');

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    const mockNotificationData = {
      recipientId: '507f1f77bcf86cd799439011',
      actorId: '507f1f77bcf86cd799439012',
      type: 'comment' as const,
      targetModel: 'Post' as const,
      targetId: '507f1f77bcf86cd799439013',
    };

    it('should create notification successfully', async () => {
      const mockNotification = {
        _id: '507f1f77bcf86cd799439014',
        recipient: '507f1f77bcf86cd799439011',
        actor: '507f1f77bcf86cd799439012',
        type: 'comment',
        targetModel: 'Post',
        target: '507f1f77bcf86cd799439013',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockPopulatedNotification = {
        ...mockNotification,
        populated: jest.fn().mockReturnThis(),
        recipient: {
          _id: '507f1f77bcf86cd799439011',
          name: 'Recipient User',
          profilePicture: 'recipient.jpg',
        },
        actor: {
          _id: '507f1f77bcf86cd799439012',
          name: 'Actor User',
          profilePicture: 'actor.jpg',
        },
        target: {
          _id: '507f1f77bcf86cd799439013',
          title: 'Test Post',
          content: 'Test Content',
        },
      };

      (User.exists as jest.Mock).mockResolvedValue({ _id: '507f1f77bcf86cd799439010' });
      (PostModel.exists as jest.Mock).mockResolvedValue({ _id: '507f1f77bcf86cd799439013' });
      (PostModel.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439013',
          slug: 'test-post',
          title: 'Test Post',
        }),
      });
      (NotificationModel.create as jest.Mock).mockResolvedValue(mockNotification);
      (NotificationModel.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPopulatedNotification),
      });
      (realtimeService.publishToRoom as jest.Mock).mockReturnValue(undefined);

      const result = await notificationService.createNotification(mockNotificationData);

      expect(User.exists).toHaveBeenCalledWith({ _id: '507f1f77bcf86cd799439011' });
      expect(User.exists).toHaveBeenCalledWith({ _id: '507f1f77bcf86cd799439012' });
      expect(PostModel.exists).toHaveBeenCalledWith({ _id: '507f1f77bcf86cd799439013' });
      expect(NotificationModel.create).toHaveBeenCalled();
      expect(realtimeService.publishToRoom).toHaveBeenCalledWith(
        'user',
        '507f1f77bcf86cd799439011',
        'notification:new',
        expect.objectContaining({
          id: '507f1f77bcf86cd799439014',
          timestamp: expect.any(Date),
          data: expect.any(Object),
        })
      );
    });

    it('should throw error when recipient and actor are the same', async () => {
      const invalidData = {
        ...mockNotificationData,
        recipientId: '507f1f77bcf86cd799439015',
        actorId: '507f1f77bcf86cd799439015',
      };

      await expect(notificationService.createNotification(invalidData)).rejects.toThrow(
        'Cannot create notification for self-action'
      );
    });

    it('should throw error when recipient does not exist', async () => {
      (User.exists as jest.Mock).mockClear();
      (PostModel.exists as jest.Mock).mockClear();

      (User.exists as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ _id: '507f1f77bcf86cd799439012' });

      await expect(notificationService.createNotification(mockNotificationData)).rejects.toThrow(
        NOTIFICATION_ERRORS.INVALID_RECIPIENT
      );
    });

    it('should throw error when actor does not exist', async () => {
      (User.exists as jest.Mock).mockReset();
      (User.exists as jest.Mock)
        .mockResolvedValueOnce({ _id: '507f1f77bcf86cd799439011' })
        .mockResolvedValueOnce(null);

      await expect(notificationService.createNotification(mockNotificationData)).rejects.toThrow(
        NOTIFICATION_ERRORS.INVALID_ACTOR
      );
    });

    it('should throw error when target does not exist', async () => {
      (User.exists as jest.Mock).mockReset();
      (PostModel.exists as jest.Mock).mockReset();

      (User.exists as jest.Mock).mockResolvedValue({ _id: '507f1f77bcf86cd799439010' });
      (PostModel.exists as jest.Mock).mockResolvedValue(null);

      await expect(notificationService.createNotification(mockNotificationData)).rejects.toThrow(
        NOTIFICATION_ERRORS.INVALID_TARGET
      );
    });
  });

  describe('getNotifications', () => {
    it('should get notifications with pagination', async () => {
      const mockNotifications = [
        {
          _id: '507f1f77bcf86cd799439016',
          recipient: { _id: '507f1f77bcf86cd799439011', name: 'User' },
          actor: { _id: '507f1f77bcf86cd799439012', name: 'Actor' },
          type: 'comment',
          targetModel: 'Post',
          target: { _id: '507f1f77bcf86cd799439013' },
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          populated: jest.fn().mockReturnThis(),
        },
      ];

      (NotificationModel.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockNotifications),
      });
      (PostModel.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439013',
          slug: 'test-post',
          title: 'Test Post',
        }),
      });
      (NotificationModel.countDocuments as jest.Mock)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1);

      const result = await notificationService.getNotifications({
        userId: '507f1f77bcf86cd799439011',
        page: 1,
        limit: 20,
      });

      expect(result).toHaveProperty('notifications');
      expect(result).toHaveProperty('pagination');
      expect(result).toHaveProperty('unreadCount');
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const mockNotification = {
        _id: '507f1f77bcf86cd799439017',
        recipient: '507f1f77bcf86cd799439011',
        type: 'comment',
        targetModel: 'Post',
        read: false,
        save: jest.fn().mockResolvedValue(this),
      };

      const mockPopulatedNotification = {
        ...mockNotification,
        recipient: { _id: '507f1f77bcf86cd799439011', name: 'User' },
        actor: { _id: '507f1f77bcf86cd799439012', name: 'Actor' },
        target: { _id: '507f1f77bcf86cd799439013' },
        populated: jest.fn().mockReturnThis(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (NotificationModel.findOne as jest.Mock).mockResolvedValue(mockNotification);
      (NotificationModel.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPopulatedNotification),
      });

      const result = await notificationService.markAsRead('507f1f77bcf86cd799439017', '507f1f77bcf86cd799439011');

      expect(mockNotification.read).toBe(true);
      expect(mockNotification.save).toHaveBeenCalled();
      expect(realtimeService.publishToRoom).toHaveBeenCalledWith(
        'user',
        '507f1f77bcf86cd799439011',
        'notification:read',
        expect.objectContaining({
          data: { notificationId: '507f1f77bcf86cd799439017' },
        })
      );
    });

    it('should throw error when notification not found', async () => {
      (NotificationModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(notificationService.markAsRead('507f1f77bcf86cd799439017', '507f1f77bcf86cd799439011')).rejects.toThrow(
        NOTIFICATION_ERRORS.NOT_FOUND
      );
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      (NotificationModel.updateMany as jest.Mock).mockResolvedValue({ modifiedCount: 3 });

      await notificationService.markAllAsRead('507f1f77bcf86cd799439011');

      expect(NotificationModel.updateMany).toHaveBeenCalledWith(
        { recipient: '507f1f77bcf86cd799439011', read: false },
        { read: true }
      );
      expect(realtimeService.publishToRoom).toHaveBeenCalledWith(
        'user',
        '507f1f77bcf86cd799439011',
        'notification:allRead',
        expect.objectContaining({
          id: 'all',
          data: {},
        })
      );
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification', async () => {
      const mockNotification = {
        _id: '507f1f77bcf86cd799439017',
        recipient: '507f1f77bcf86cd799439011',
      };

      (NotificationModel.findOne as jest.Mock).mockResolvedValue(mockNotification);
      (NotificationModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

      await notificationService.deleteNotification('507f1f77bcf86cd799439017', '507f1f77bcf86cd799439011');

      expect(NotificationModel.deleteOne).toHaveBeenCalledWith({ _id: '507f1f77bcf86cd799439017' });
      expect(realtimeService.publishToRoom).toHaveBeenCalledWith(
        'user',
        '507f1f77bcf86cd799439011',
        'notification:deleted',
        expect.objectContaining({
          data: { notificationId: '507f1f77bcf86cd799439017' },
        })
      );
    });
  });
});
