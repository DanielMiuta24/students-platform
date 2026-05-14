import type { NotificationType, TargetModel } from '../../../shared/types/domain';
import type { Types } from 'mongoose';

export interface CreateNotificationDTO {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  targetModel: TargetModel;
  targetId: string;
}

export interface NotificationQueryDTO {
  userId: string;
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export interface NotificationResponseDTO {
  _id: string;
  recipient: {
    _id: string;
    name: string;
    username: string;
    profilePicture?: string;
  };
  actor: {
    _id: string;
    name: string;
    username: string;
    profilePicture?: string;
  };
  type: NotificationType;
  targetModel: TargetModel;
  target: {
    _id: string;
    [key: string]: any;
  };
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationListResponseDTO {
  notifications: NotificationResponseDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  unreadCount: number;
}

export interface MarkAsReadDTO {
  notificationId: string;
  userId: string;
}

export interface MarkAllAsReadDTO {
  userId: string;
}

export interface DeleteNotificationDTO {
  notificationId: string;
  userId: string;
}
