import { defineStore } from 'pinia';
import { notificationApi, type Notification, type NotificationListResponse } from '../api/notification';
import { socketService } from '../services/socket';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasMore: false,
  }),

  actions: {
    async fetchNotifications(page: number = 1, unreadOnly: boolean = false) {
      this.loading = true;
      this.error = null;

      try {
        const response: NotificationListResponse = await notificationApi.getNotifications(page, this.limit, unreadOnly);

        if (page === 1) {
          this.notifications = response.notifications;
        } else {
          this.notifications.push(...response.notifications);
        }

        this.page = response.pagination.page;
        this.total = response.pagination.total;
        this.totalPages = response.pagination.totalPages;
        this.unreadCount = response.unreadCount;
        this.hasMore = this.page < this.totalPages;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch notifications';
        console.error('Error fetching notifications:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchUnreadCount() {
      try {
        const response = await notificationApi.getUnreadCount();
        this.unreadCount = response.count;
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    },

    async markAsRead(notificationId: string) {
      try {
        await notificationApi.markAsRead(notificationId);

        const notification = this.notifications.find(n => n._id === notificationId);
        if (notification && !notification.read) {
          notification.read = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to mark notification as read';
        console.error('Error marking notification as read:', error);
      }
    },

    async markAllAsRead() {
      try {
        await notificationApi.markAllAsRead();

        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to mark all as read';
        console.error('Error marking all as read:', error);
      }
    },

    async deleteNotification(notificationId: string) {
      try {
        await notificationApi.deleteNotification(notificationId);

        const index = this.notifications.findIndex(n => n._id === notificationId);
        if (index !== -1) {
          const wasUnread = !this.notifications[index].read;
          this.notifications.splice(index, 1);
          this.total--;

          if (wasUnread) {
            this.unreadCount = Math.max(0, this.unreadCount - 1);
          }
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete notification';
        console.error('Error deleting notification:', error);
      }
    },

    async deleteAllRead() {
      try {
        await notificationApi.deleteAllRead();

        this.notifications = this.notifications.filter(n => !n.read);
        this.total = this.notifications.length;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete read notifications';
        console.error('Error deleting read notifications:', error);
      }
    },

    addNotification(notification: Notification) {
      this.notifications.unshift(notification);
      this.total++;

      if (!notification.read) {
        this.unreadCount++;
      }
    },

    handleNotificationRead(notificationId: string) {
      const notification = this.notifications.find(n => n._id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
    },

    handleAllNotificationsRead() {
      this.notifications.forEach(n => n.read = true);
      this.unreadCount = 0;
    },

    handleNotificationDeleted(notificationId: string) {
      const index = this.notifications.findIndex(n => n._id === notificationId);
      if (index !== -1) {
        const wasUnread = !this.notifications[index].read;
        this.notifications.splice(index, 1);
        this.total--;

        if (wasUnread) {
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      }
    },

    setupRealtimeListeners() {
      const socket = socketService.getSocket();
      if (!socket) {
        console.error('[NotificationStore] Socket is null, cannot set up listeners');
        return;
      }

      socketService.on('notification:new', (payload: any) => {
        this.addNotification(payload.data);
      });

      socketService.on('notification:read', (payload: any) => {
        this.handleNotificationRead(payload.data.notificationId);
      });

      socketService.on('notification:allRead', () => {
        this.handleAllNotificationsRead();
      });

      socketService.on('notification:deleted', (payload: any) => {
        this.handleNotificationDeleted(payload.data.notificationId);
      });
    },

    clearRealtimeListeners() {
      socketService.off('notification:new');
      socketService.off('notification:read');
      socketService.off('notification:allRead');
      socketService.off('notification:deleted');
    },

    reset() {
      this.notifications = [];
      this.unreadCount = 0;
      this.loading = false;
      this.error = null;
      this.page = 1;
      this.total = 0;
      this.totalPages = 0;
      this.hasMore = false;
    },
  },
});
