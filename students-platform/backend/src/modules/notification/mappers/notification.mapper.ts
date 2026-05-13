import type { NotificationDoc } from '../models/notification.model';
import type { NotificationResponseDTO } from '../types';

export class NotificationMapper {
  static toDTO(notification: NotificationDoc): NotificationResponseDTO {
    const recipient = notification.populated('recipient');
    const actor = notification.populated('actor');
    const target = notification.populated('target');

    if (!notification.type || !notification.targetModel) {
      throw new Error('Invalid notification: missing type or targetModel');
    }

    return {
      _id: notification._id.toString(),
      recipient: {
        _id: recipient._id.toString(),
        name: recipient.name,
        profilePicture: recipient.profilePicture,
      },
      actor: {
        _id: actor._id.toString(),
        name: actor.name,
        profilePicture: actor.profilePicture,
      },
      type: notification.type,
      targetModel: notification.targetModel,
      target: {
        _id: target._id.toString(),
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
          community: target.community,
          status: target.status,
        };
      case 'User':
        return {
          name: target.name,
          profilePicture: target.profilePicture,
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
