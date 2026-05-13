import { api } from '../services/api';

export interface Notification {
  _id: string;
  recipient: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  actor: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  type: string;
  targetModel: string;
  target: {
    _id: string;
    [key: string]: any;
  };
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationListResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  unreadCount: number;
}

export const notificationApi = {
  getNotifications(page: number = 1, limit: number = 20, unreadOnly: boolean = false): Promise<NotificationListResponse> {
    return api.get('/notifications', {
      params: { page, limit, unreadOnly },
    }).then(res => res.data);
  },

  getUnreadCount(): Promise<{ count: number }> {
    return api.get('/notifications/unread-count').then(res => res.data);
  },

  markAsRead(notificationId: string): Promise<Notification> {
    return api.patch(`/notifications/${notificationId}/read`).then(res => res.data);
  },

  markAllAsRead(): Promise<void> {
    return api.patch('/notifications/mark-all-read').then(res => res.data);
  },

  deleteNotification(notificationId: string): Promise<void> {
    return api.delete(`/notifications/${notificationId}`).then(res => res.data);
  },

  deleteAllRead(): Promise<void> {
    return api.delete('/notifications/read').then(res => res.data);
  },
};
