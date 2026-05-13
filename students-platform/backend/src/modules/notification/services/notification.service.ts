import { NotificationModel } from '../models/notification.model';
import { NotificationBuilder } from '../builders';
import { NotificationMapper } from '../mappers';
import { NOTIFICATION_ERRORS, NOTIFICATION_PAGINATION } from '../constants';
import { realtimeService } from '../../realtime';
import type {
  CreateNotificationDTO,
  NotificationQueryDTO,
  NotificationListResponseDTO,
  NotificationResponseDTO,
} from '../types';
import { User } from '../../user/models/user.model';
import { PostModel } from '../../post/models/post.model';
import { CommentModel } from '../../comment/models/comment.model';
import { CommunityModel } from '../../community/models/community.model';
import { MessageModel } from '../../message/models/message.model';
import { CommunityInvitationModel } from '../../community/models/community-invitation.model';

export class NotificationService {
  async createNotification(dto: CreateNotificationDTO): Promise<NotificationResponseDTO> {
    if (dto.recipientId === dto.actorId) {
      throw new Error('Cannot create notification for self-action');
    }

    await this.validateReferences(dto);

    const notificationData = new NotificationBuilder().fromDTO(dto).build();

    const notification = await NotificationModel.create(notificationData);

    const populatedNotification = await NotificationModel.findById(notification._id)
      .populate('recipient', 'name profilePicture')
      .populate('actor', 'name profilePicture')
      .populate('target')
      .exec();

    if (!populatedNotification) {
      throw new Error(NOTIFICATION_ERRORS.CREATION_FAILED);
    }

    const notificationDTO = NotificationMapper.toDTO(populatedNotification);

    realtimeService.publishToRoom('user', dto.recipientId, 'notification:new', {
      id: notificationDTO._id,
      timestamp: new Date(),
      data: notificationDTO,
    });

    return notificationDTO;
  }

  async getNotifications(query: NotificationQueryDTO): Promise<NotificationListResponseDTO> {
    const page = query.page || NOTIFICATION_PAGINATION.DEFAULT_PAGE;
    const limit = query.limit || NOTIFICATION_PAGINATION.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const filter: any = { recipient: query.userId };

    if (query.unreadOnly) {
      filter.read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      NotificationModel.find(filter)
        .populate('recipient', 'name profilePicture')
        .populate('actor', 'name profilePicture')
        .populate('target')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      NotificationModel.countDocuments(filter),
      NotificationModel.countDocuments({ recipient: query.userId, read: false }),
    ]);

    const notificationDTOs = notifications.map((notification) =>
      NotificationMapper.toDTO(notification)
    );

    return {
      notifications: notificationDTOs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return NotificationModel.countDocuments({ recipient: userId, read: false });
  }

  async markAsRead(notificationId: string, userId: string): Promise<NotificationResponseDTO> {
    const notification = await NotificationModel.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw new Error(NOTIFICATION_ERRORS.NOT_FOUND);
    }

    if (notification.read) {
      const populatedNotification = await NotificationModel.findById(notification._id)
        .populate('recipient', 'name profilePicture')
        .populate('actor', 'name profilePicture')
        .populate('target')
        .exec();

      return NotificationMapper.toDTO(populatedNotification!);
    }

    notification.read = true;
    await notification.save();

    const populatedNotification = await NotificationModel.findById(notification._id)
      .populate('recipient', 'name profilePicture')
      .populate('actor', 'name profilePicture')
      .populate('target')
      .exec();

    if (!populatedNotification) {
      throw new Error(NOTIFICATION_ERRORS.UPDATE_FAILED);
    }

    const notificationDTO = NotificationMapper.toDTO(populatedNotification);

    realtimeService.publishToRoom('user', userId, 'notification:read', {
      id: notificationDTO._id,
      timestamp: new Date(),
      data: { notificationId: notificationDTO._id },
    });

    return notificationDTO;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany({ recipient: userId, read: false }, { read: true });

    realtimeService.publishToRoom('user', userId, 'notification:allRead', {
      id: 'all',
      timestamp: new Date(),
      data: {},
    });
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const notification = await NotificationModel.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw new Error(NOTIFICATION_ERRORS.NOT_FOUND);
    }

    await NotificationModel.deleteOne({ _id: notificationId });

    realtimeService.publishToRoom('user', userId, 'notification:deleted', {
      id: notificationId,
      timestamp: new Date(),
      data: { notificationId },
    });
  }

  async deleteAllRead(userId: string): Promise<void> {
    await NotificationModel.deleteMany({ recipient: userId, read: true });
  }

  private async validateReferences(dto: CreateNotificationDTO): Promise<void> {
    const recipientExists = await User.exists({ _id: dto.recipientId });
    if (!recipientExists) {
      throw new Error(NOTIFICATION_ERRORS.INVALID_RECIPIENT);
    }

    const actorExists = await User.exists({ _id: dto.actorId });
    if (!actorExists) {
      throw new Error(NOTIFICATION_ERRORS.INVALID_ACTOR);
    }

    let targetExists = false;

    switch (dto.targetModel) {
      case 'Post':
        targetExists = !!(await PostModel.exists({ _id: dto.targetId }));
        break;
      case 'Comment':
        targetExists = !!(await CommentModel.exists({ _id: dto.targetId }));
        break;
      case 'Community':
        targetExists = !!(await CommunityModel.exists({ _id: dto.targetId }));
        break;
      case 'CommunityInvitation':
        targetExists = !!(await CommunityInvitationModel.exists({ _id: dto.targetId }));
        break;
      case 'User':
        targetExists = !!(await User.exists({ _id: dto.targetId }));
        break;
      case 'Message':
        targetExists = !!(await MessageModel.exists({ _id: dto.targetId }));
        break;
      default:
        throw new Error(NOTIFICATION_ERRORS.INVALID_TARGET);
    }

    if (!targetExists) {
      throw new Error(NOTIFICATION_ERRORS.INVALID_TARGET);
    }
  }
}

export const notificationService = new NotificationService();
