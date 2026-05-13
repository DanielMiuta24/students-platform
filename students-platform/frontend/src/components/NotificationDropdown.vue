<template>
  <el-dropdown trigger="click" @visible-change="handleDropdownVisibleChange" placement="bottom-end">
    <button class="notifications-button" :class="{ 'has-unread': unreadCount > 0 }" title="Notifications">
      <el-icon><Bell /></el-icon>
      <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
    </button>

    <template #dropdown>
      <div class="notification-dropdown">
        <div class="notification-header">
          <h3>Notifications</h3>
          <div class="notification-actions">
            <el-button v-if="unreadCount > 0" text size="small" @click="handleMarkAllRead">
              Mark all read
            </el-button>
            <el-button text size="small" @click="navigateToNotifications">
              View all
            </el-button>
          </div>
        </div>

        <el-scrollbar height="400px" class="notification-list">
          <div v-if="loading && notifications.length === 0" class="loading-container">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>Loading notifications...</span>
          </div>

          <div v-else-if="notifications.length === 0" class="empty-state">
            <el-icon><BellFilled /></el-icon>
            <p>No notifications yet</p>
          </div>

          <div v-else>
            <div
              v-for="notification in displayNotifications"
              :key="notification._id"
              class="notification-item"
              :class="{ unread: !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <div class="notification-avatar">
                <img
                  v-if="notification.actor.profilePicture"
                  :src="notification.actor.profilePicture"
                  :alt="notification.actor.name"
                />
                <el-icon v-else><User /></el-icon>
              </div>

              <div class="notification-content">
                <p class="notification-text">
                  <strong>{{ notification.actor.name }}</strong>
                  {{ getNotificationMessage(notification) }}
                </p>
                <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
              </div>

              <div class="notification-actions-inline">
                <el-button
                  v-if="!notification.read"
                  text
                  size="small"
                  @click.stop="markAsRead(notification._id)"
                >
                  <el-icon><Check /></el-icon>
                </el-button>
                <el-button
                  text
                  size="small"
                  @click.stop="deleteNotification(notification._id)"
                >
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '../stores/notification';
import { Bell, BellFilled, User, Loading, Check, Close } from '@element-plus/icons-vue';
import type { Notification } from '../api/notification';

const router = useRouter();
const notificationStore = useNotificationStore();

const notifications = computed(() => notificationStore.notifications);
const unreadCount = computed(() => notificationStore.unreadCount);
const loading = computed(() => notificationStore.loading);

const displayNotifications = computed(() => notifications.value.slice(0, 10));

const handleDropdownVisibleChange = async (visible: boolean) => {
  if (visible && notifications.value.length === 0) {
    await notificationStore.fetchNotifications();
  }
};

const handleMarkAllRead = async () => {
  await notificationStore.markAllAsRead();
};

const markAsRead = async (notificationId: string) => {
  await notificationStore.markAsRead(notificationId);
};

const deleteNotification = async (notificationId: string) => {
  await notificationStore.deleteNotification(notificationId);
};

const navigateToNotifications = () => {
  router.push('/dashboard?tab=notifications');
};

const handleNotificationClick = async (notification: Notification) => {
  if (!notification.read) {
    await markAsRead(notification._id);
  }

  const route = getNotificationRoute(notification);
  if (route) {
    router.push(route);
  }
};

const getNotificationRoute = (notification: Notification): string | null => {
  switch (notification.type) {
    case 'comment':
    case 'reply':
    case 'like':
      if (notification.targetModel === 'Post') {
        return `/post/${notification.target._id}`;
      } else if (notification.targetModel === 'Comment') {
        return `/post/${notification.target._id}`;
      }
      return null;
    case 'follow':
      return `/profile/${notification.actor._id}`;
    case 'community_join':
    case 'community_post':
      return `/community/${notification.target._id}`;
    case 'community_invite':
      if (notification.targetModel === 'CommunityInvitation') {
        return '/dashboard?tab=notifications';
      }
      return `/community/${notification.target._id}`;
    case 'new_post':
      return `/post/${notification.target._id}`;
    default:
      return null;
  }
};

const getNotificationMessage = (notification: Notification): string => {
  const messages: Record<string, string> = {
    comment: 'commented on your post',
    reply: 'replied to your comment',
    like: `liked your ${notification.targetModel.toLowerCase()}`,
    follow: 'started following you',
    view: 'viewed your profile',
    message: 'sent you a message',
    new_post: 'created a new post',
    community_join: 'joined your community',
    community_post: `posted in ${notification.target.name || 'a community'}`,
    community_invite: `invited you to ${notification.target.name || 'a community'}`,
  };
  return messages[notification.type] || 'interacted with you';
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffMs = now.getTime() - notificationDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return notificationDate.toLocaleDateString();
};

onMounted(() => {
  notificationStore.setupRealtimeListeners();
  notificationStore.fetchUnreadCount();
});

onUnmounted(() => {
  notificationStore.clearRealtimeListeners();
});
</script>

<style scoped>
.notifications-button {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  font-size: 20px;
}

.notifications-button:hover {
  background-color: #d8dadf;
}

.notifications-button.has-unread {
  background-color: #3b82f6;
  color: white;
}

.notifications-button.has-unread:hover {
  background-color: #2563eb;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.notification-dropdown {
  width: 400px;
  max-width: 90vw;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.notification-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.notification-actions {
  display: flex;
  gap: 8px;
}

.notification-list {
  background: white;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #6b7280;
}

.loading-container .el-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.empty-state .el-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f3f4f6;
}

.notification-item:hover {
  background-color: #f9fafb;
}

.notification-item.unread {
  background-color: #eff6ff;
}

.notification-item.unread:hover {
  background-color: #dbeafe;
}

.notification-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.notification-avatar .el-icon {
  font-size: 20px;
  color: #6b7280;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-text {
  margin: 0 0 4px 0;
  font-size: 14px;
  line-height: 1.5;
  color: #111827;
}

.notification-text strong {
  font-weight: 600;
}

.notification-time {
  font-size: 12px;
  color: #6b7280;
}

.notification-actions-inline {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.notification-item:hover .notification-actions-inline {
  opacity: 1;
}
</style>
