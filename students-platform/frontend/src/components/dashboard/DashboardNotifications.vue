<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
    <div class="notifications-header">
      <h2 class="text-3xl font-bold text-gray-900">Notifications</h2>

      <div class="notifications-actions">
        <el-button
          v-if="unreadCount > 0"
          @click="handleMarkAllRead"
          :loading="markingAllRead"
        >
          Mark all read
        </el-button>
        <el-button
          v-if="notifications.length > 0"
          @click="handleDeleteAllRead"
          :loading="deletingAllRead"
        >
          Clear read
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="notification-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="All" name="all"></el-tab-pane>
      <el-tab-pane label="Unread" name="unread"></el-tab-pane>
    </el-tabs>

    <div v-if="loading && notifications.length === 0" class="loading-container">
      <el-icon class="is-loading spinning-icon"><Loading /></el-icon>
      <span>Loading notifications...</span>
    </div>

    <div v-else-if="notifications.length === 0" class="empty-state">
      <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
        <svg class="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <p class="text-xl font-bold text-gray-900 mb-2">No notifications yet</p>
      <p class="text-gray-600">You'll see notifications here when you have activity.</p>
    </div>

    <div v-else class="notifications-list">
      <div
        v-for="notification in notifications"
        :key="notification._id"
        class="notification-card"
        :class="{ unread: !notification.read }"
        @click="handleNotificationClick(notification)"
      >
        <div class="notification-avatar">
          <img
            v-if="notification.actor.profilePicture"
            :src="notification.actor.profilePicture"
            :alt="notification.actor.name"
          />
          <div v-else class="avatar-placeholder">
            <el-icon><User /></el-icon>
          </div>
        </div>

        <div class="notification-body">
          <p class="notification-message">
            <strong>{{ notification.actor.name }}</strong>
            {{ getNotificationMessage(notification) }}
          </p>
          <div class="notification-meta">
            <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
            <span v-if="!notification.read" class="unread-indicator">New</span>
          </div>
        </div>

        <div class="notification-actions">
          <el-button
            v-if="!notification.read"
            text
            @click.stop="markAsRead(notification._id)"
            title="Mark as read"
          >
            <el-icon><Check /></el-icon>
          </el-button>
          <el-button
            text
            @click.stop="deleteNotification(notification._id)"
            title="Delete"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </div>

      <div v-if="hasMore" class="load-more-container">
        <el-button @click="loadMore" :loading="loading">
          Load more
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '../../stores/notification';
import { User, Loading, Check, Delete } from '@element-plus/icons-vue';
import type { Notification } from '../../api/notification';
import { ElMessage } from 'element-plus';

const router = useRouter();
const notificationStore = useNotificationStore();

const activeTab = ref('all');
const markingAllRead = ref(false);
const deletingAllRead = ref(false);

const notifications = computed(() => notificationStore.notifications);
const unreadCount = computed(() => notificationStore.unreadCount);
const loading = computed(() => notificationStore.loading);
const hasMore = computed(() => notificationStore.hasMore);

const handleTabChange = (tabName: string) => {
  notificationStore.reset();
  notificationStore.fetchNotifications(1, tabName === 'unread');
};

const handleMarkAllRead = async () => {
  markingAllRead.value = true;
  try {
    await notificationStore.markAllAsRead();
    ElMessage.success('All notifications marked as read');
  } catch (error) {
    ElMessage.error('Failed to mark all as read');
  } finally {
    markingAllRead.value = false;
  }
};

const handleDeleteAllRead = async () => {
  deletingAllRead.value = true;
  try {
    await notificationStore.deleteAllRead();
    ElMessage.success('Read notifications cleared');
  } catch (error) {
    ElMessage.error('Failed to clear notifications');
  } finally {
    deletingAllRead.value = false;
  }
};

const markAsRead = async (notificationId: string) => {
  try {
    await notificationStore.markAsRead(notificationId);
  } catch (error) {
    ElMessage.error('Failed to mark as read');
  }
};

const deleteNotification = async (notificationId: string) => {
  try {
    await notificationStore.deleteNotification(notificationId);
    ElMessage.success('Notification deleted');
  } catch (error) {
    ElMessage.error('Failed to delete notification');
  }
};

const loadMore = async () => {
  await notificationStore.fetchNotifications(
    notificationStore.page + 1,
    activeTab.value === 'unread'
  );
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
        return null;
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
  notificationStore.fetchNotifications(1, false);
});

onUnmounted(() => {
  notificationStore.clearRealtimeListeners();
});
</script>

<style scoped>
.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.notifications-actions {
  display: flex;
  gap: 12px;
}

.notification-tabs {
  margin-bottom: 24px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #6b7280;
}

.spinning-icon {
  font-size: 48px;
  margin-bottom: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 64px 32px;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notification-card:hover {
  border-color: #4F46E5;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
  transform: translateY(-2px);
}

.notification-card.unread {
  background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
  border-color: #93c5fd;
}

.notification-avatar {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
}

.notification-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.notification-body {
  flex: 1;
  min-width: 0;
}

.notification-message {
  margin: 0 0 8px 0;
  font-size: 15px;
  line-height: 1.6;
  color: #111827;
}

.notification-message strong {
  font-weight: 600;
  color: #4F46E5;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-time {
  font-size: 13px;
  color: #6b7280;
}

.unread-indicator {
  font-size: 12px;
  font-weight: 600;
  color: #4F46E5;
  background: #eff6ff;
  padding: 2px 8px;
  border-radius: 12px;
}

.notification-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.notification-card:hover .notification-actions {
  opacity: 1;
}

.load-more-container {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}
</style>
