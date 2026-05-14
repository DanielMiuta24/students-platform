import type { NotificationDoc } from '../models/notification.model';
import type { NotificationResponseDTO } from '../types';

export class NotificationMapper {
  static toDTO(notification: NotificationDoc): NotificationResponseDTO {
    const recipient = notification.recipient as any;
    const actor = notification.actor as any;
    const target = notification.target as any;

    if (!notification.type || !notification.targetModel) {
      throw new Error('Invalid notification: missing type or targetModel');
    }

    // Check if the fields are actually populated (not just ObjectIds)
    const isRecipientPopulated = recipient && typeof recipient === 'object' && recipient.name;
    const isActorPopulated = actor && typeof actor === 'object' && actor.name;
    const isTargetPopulated = target && typeof target === 'object' && target._id;

    if (!isRecipientPopulated || !isActorPopulated || !isTargetPopulated) {
      throw new Error('Notification data not properly populated');
    }

    return {
      _id: notification._id.toString(),
      recipient: {
        _id: recipient._id?.toString() || '',
        name: recipient.name || '',
        username: recipient.username || '',
        profilePicture: recipient.avatar || '',
      },
      actor: {
        _id: actor._id?.toString() || '',
        name: actor.name || '',
        username: actor.username || '',
        profilePicture: actor.avatar || '',
      },
      type: notification.type,
      targetModel: notification.targetModel,
      target: {
        _id: target._id?.toString() || '',
        ...this.extractTargetData(target, notification.targetModel),
      },
      read: notification.read,
      createdAt: notification.createdAt!,
      updatedAt: notification.updatedAt!,
    };
  }

  private static extractTargetData(target: any, targetModel: string): Record<string, any> {
    switch (targetModel) {
      case 'Post':
        return {
          title: target.title,
          content: target.content,
        };
      case 'Comment':
        return {
          content: target.content,
        };
      case 'Community':
        return {
          name: target.name,
          slug: target.slug,
        };
      case 'CommunityInvitation':
        return {
          community: target.community ? {
            _id: target.community._id?.toString() || target.community,
            name: target.community.name,
            slug: target.community.slug,
          } : null,
          status: target.status,
        };
      case 'User':
        return {
          name: target.name,
          username: target.username,
          profilePicture: target.avatar,
        };
      case 'Message':
        return {
          content: target.content,
        };
      default:
        return {};
    }
  }
}
