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
import { CommunityJoinRequestModel } from '../../community/models/community-join-request.model';

export class NotificationService {
  async createNotification(dto: CreateNotificationDTO): Promise<NotificationResponseDTO> {
    if (dto.recipientId === dto.actorId) {
      throw new Error('Cannot create notification for self-action');
    }

    await this.validateReferences(dto);

    const notificationData = new NotificationBuilder().fromDTO(dto).build();

    const notification = await NotificationModel.create(notificationData);

    const populatedNotification = await NotificationModel.findById(notification._id)
      .populate({ path: 'recipient', select: 'name username avatar profilePicture', strictPopulate: false })
      .populate({ path: 'actor', select: 'name username avatar profilePicture', strictPopulate: false })
      .populate({ path: 'target', strictPopulate: false })
      .lean()
      .exec();

    if (!populatedNotification) {
      throw new Error(NOTIFICATION_ERRORS.CREATION_FAILED);
    }

    if (populatedNotification.targetModel === 'CommunityInvitation' && populatedNotification.target) {
      const target = populatedNotification.target as any;
      if (target.community) {
        let communityId: string | undefined;
        if (typeof target.community === 'string') {
          communityId = target.community;
        } else if (target.community._id) {
          communityId = target.community._id.toString();
        }

        if (communityId) {
          const community = await CommunityModel.findById(communityId)
            .select('name slug')
            .lean();
          target.community = community;
        }
      }
    } else if (populatedNotification.targetModel === 'Community' && populatedNotification.target) {
      const target = populatedNotification.target as any;
      if (!target.name || !target.slug) {
        let communityId: string | undefined;
        if (typeof target === 'string') {
          communityId = target;
        } else if (target._id) {
          communityId = target._id.toString();
        }

        if (communityId) {
          const community = await CommunityModel.findById(communityId)
            .select('name slug')
            .lean();
          if (community) {
            (populatedNotification as any).target = community;
          }
        }
      }
    } else if (populatedNotification.targetModel === 'Post' && populatedNotification.target) {
      const target = populatedNotification.target as any;
      // Always fetch slug for posts to ensure it's populated
      // Extract the actual ObjectId string, handling both populated objects and plain IDs
      let postId: string;
      if (typeof target === 'string') {
        postId = target;
      } else if (target._id) {
        postId = target._id.toString();
      } else {
        console.error('[NotificationService] Invalid post target, skipping slug fetch:', target);
        // Continue without fetching - will use whatever is already there
      }

      if (postId!) {
        const post = await PostModel.findById(postId)
          .select('title slug community author')
          .populate('community', 'slug')
          .populate('author', 'username')
          .lean();
        if (post) {
          (populatedNotification as any).target = {
            _id: post._id,
            title: post.title,
            slug: post.slug,
            community: (post.community as any)?.slug || null,
            author: (post.author as any)?.username || null,
          };
        }
      }
    } else if (populatedNotification.targetModel === 'Comment' && populatedNotification.target) {
      const target = populatedNotification.target as any;
      if (target.post) {
        const post = await PostModel.findById(target.post)
          .select('slug community author')
          .populate('community', 'slug')
          .populate('author', 'username')
          .lean();
        if (post) {
          target.postSlug = post.slug;
          target.postCommunity = (post.community as any)?.slug || null;
          target.postAuthor = (post.author as any)?.username || null;
        }
      }
    } else if (populatedNotification.targetModel === 'CommunityJoinRequest' && populatedNotification.target) {
      const target = populatedNotification.target as any;
      if (target.community) {
        let communityId: string;
        if (typeof target.community === 'string') {
          communityId = target.community;
        } else if (target.community._id) {
          communityId = target.community._id.toString();
        } else {
          communityId = target.community.toString();
        }

        const community = await CommunityModel.findById(communityId)
          .select('name slug')
          .lean();
        if (community) {
          target.community = community;
        }
      }
    }

    const notificationDTO = NotificationMapper.toDTO(populatedNotification as any);

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
        .populate({ path: 'recipient', select: 'name username avatar', strictPopulate: false })
        .populate({ path: 'actor', select: 'name username avatar', strictPopulate: false })
        .populate({ path: 'target', strictPopulate: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      NotificationModel.countDocuments(filter),
      NotificationModel.countDocuments({ recipient: query.userId, read: false }),
    ]);

    for (const notification of notifications) {
      if (notification.targetModel === 'CommunityInvitation' && notification.target) {
        const target = notification.target as any;
        if (target.community) {
          let communityId: string | undefined;
          if (typeof target.community === 'string') {
            communityId = target.community;
          } else if (target.community._id) {
            communityId = target.community._id.toString();
          }

          if (communityId) {
            const community = await CommunityModel.findById(communityId)
              .select('name slug')
              .lean();
            target.community = community;
          }
        }
      } else if (notification.targetModel === 'Community' && notification.target) {
        const target = notification.target as any;
        if (!target.name || !target.slug) {
          let communityId: string | undefined;
          if (typeof target === 'string') {
            communityId = target;
          } else if (target._id) {
            communityId = target._id.toString();
          }

          if (communityId) {
            const community = await CommunityModel.findById(communityId)
              .select('name slug')
              .lean();
            if (community) {
              (notification as any).target = community;
            }
          }
        }
      } else if (notification.targetModel === 'Post' && notification.target) {
        const target = notification.target as any;
        // Always fetch slug for posts to ensure it's populated
        // Extract the actual ObjectId string, handling both populated objects and plain IDs
        let postId: string | undefined;
        if (typeof target === 'string') {
          postId = target;
        } else if (target._id) {
          postId = target._id.toString();
        } else {
          console.error('[NotificationService] Invalid post target, skipping slug fetch:', target);
        }

        if (postId) {
          const post = await PostModel.findById(postId)
            .select('title slug community author')
            .populate('community', 'slug')
            .populate('author', 'username')
            .lean();
          if (post) {
            (notification as any).target = {
              _id: post._id,
              title: post.title,
              slug: post.slug,
              community: (post.community as any)?.slug || null,
              author: (post.author as any)?.username || null,
            };
          }
        }
      } else if (notification.targetModel === 'Comment' && notification.target) {
        const target = notification.target as any;
        if (target.post) {
          const post = await PostModel.findById(target.post)
            .select('slug community author')
            .populate('community', 'slug')
            .populate('author', 'username')
            .lean();
          if (post) {
            target.postSlug = post.slug;
            target.postCommunity = (post.community as any)?.slug || null;
            target.postAuthor = (post.author as any)?.username || null;
          }
        }
      } else if (notification.targetModel === 'CommunityJoinRequest' && notification.target) {
        const target = notification.target as any;
        if (target.community) {
          let communityId: string;
          if (typeof target.community === 'string') {
            communityId = target.community;
          } else if (target.community._id) {
            communityId = target.community._id.toString();
          } else {
            communityId = target.community.toString();
          }

          const community = await CommunityModel.findById(communityId)
            .select('name slug')
            .lean();
          if (community) {
            target.community = community;
          }
        }
      }
    }

    const notificationDTOs = notifications
      .filter((notification) => {
        if (!notification.target) {
          console.warn(`Notification ${notification._id} has missing target, skipping`);
          return false;
        }
        return true;
      })
      .map((notification) => {
        try {
          return NotificationMapper.toDTO(notification as any);
        } catch (error) {
          console.error('Error mapping notification:', error);
          console.error('Notification ID:', notification._id);
          throw error;
        }
      });

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
        .populate({ path: 'recipient', select: 'name username avatar', strictPopulate: false })
        .populate({ path: 'actor', select: 'name username avatar', strictPopulate: false })
        .populate({ path: 'target', strictPopulate: false })
        .lean()
        .exec();

      if (populatedNotification?.targetModel === 'CommunityInvitation' && populatedNotification.target) {
        const target = populatedNotification.target as any;
        if (target.community) {
          const community = await CommunityModel.findById(target.community)
            .select('name slug')
            .lean();
          target.community = community;
        }
      }

      return NotificationMapper.toDTO(populatedNotification as any);
    }

    notification.read = true;
    await notification.save();

    const populatedNotification = await NotificationModel.findById(notification._id)
      .populate({ path: 'recipient', select: 'name username avatar profilePicture', strictPopulate: false })
      .populate({ path: 'actor', select: 'name username avatar profilePicture', strictPopulate: false })
      .populate({ path: 'target', strictPopulate: false })
      .lean()
      .exec();

    if (!populatedNotification) {
      throw new Error(NOTIFICATION_ERRORS.UPDATE_FAILED);
    }

    if (populatedNotification.targetModel === 'CommunityInvitation' && populatedNotification.target) {
      const target = populatedNotification.target as any;
      if (target.community) {
        const community = await CommunityModel.findById(target.community)
          .select('name slug')
          .lean();
        target.community = community;
      }
    }

    const notificationDTO = NotificationMapper.toDTO(populatedNotification as any);

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
    // Validate that IDs are strings in valid ObjectId format
    const isValidObjectId = (id: string): boolean => {
      return /^[0-9a-fA-F]{24}$/.test(id);
    };

    if (typeof dto.recipientId !== 'string' || !isValidObjectId(dto.recipientId)) {
      console.error('[NotificationService] Invalid recipientId:', dto.recipientId);
      throw new Error('recipientId must be a valid ObjectId string');
    }
    if (typeof dto.actorId !== 'string' || !isValidObjectId(dto.actorId)) {
      console.error('[NotificationService] Invalid actorId:', dto.actorId);
      throw new Error('actorId must be a valid ObjectId string');
    }
    if (typeof dto.targetId !== 'string' || !isValidObjectId(dto.targetId)) {
      console.error('[NotificationService] Invalid targetId:', dto.targetId);
      throw new Error('targetId must be a valid ObjectId string');
    }

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
      case 'CommunityJoinRequest':
        targetExists = !!(await CommunityJoinRequestModel.exists({ _id: dto.targetId }));
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
