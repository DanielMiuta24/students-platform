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
            :src="getActorAvatar(notification.actor)"
            :alt="notification.actor.name"
          />
        </div>

        <div class="notification-body">
          <p class="notification-message">
            <button
              @click.stop="navigateToProfile(notification.actor.username)"
              class="actor-name"
            >
              {{ notification.actor.name }}
            </button>
            {{ getNotificationMessage(notification).text }}
            <button
              v-if="getNotificationMessage(notification).targetName"
              @click.stop="navigateToTarget(getNotificationMessage(notification).targetLink)"
              class="target-link"
            >
              {{ getNotificationMessage(notification).targetName }}
            </button>
            <template v-if="getNotificationMessage(notification).extraText">
              {{ getNotificationMessage(notification).extraText }}
              <button
                v-if="getNotificationMessage(notification).extraLink"
                @click.stop="navigateToTarget(getNotificationMessage(notification).extraLink)"
                class="target-link"
              >
                {{ getNotificationMessage(notification).extraLinkText }}
              </button>
            </template>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '../../stores/notification';
import { User, Loading, Check, Delete } from '@element-plus/icons-vue';
import type { Notification } from '../../api/notification';
import { ElMessage } from 'element-plus';
import { getAvatarUrl } from '../../utils/avatar';

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
      if (notification.targetModel === 'Comment') {
        const target = notification.target as any;
        const postSlug = target.postSlug;
        const commentId = notification.target._id;
        if (!postSlug) return null;

        if (target.postCommunity) {
          return `/community/${target.postCommunity}/posts/${postSlug}#comment-${commentId}`;
        } else if (target.postAuthor) {
          return `/profile/${target.postAuthor}/posts/${postSlug}#comment-${commentId}`;
        }
        return null;
      }
      return null;
    case 'like':
      if (notification.targetModel === 'Post') {
        const post = notification.target as any;
        if (post.community) {
          return `/community/${post.community}/posts/${post.slug}`;
        } else if (post.author) {
          return `/profile/${post.author}/posts/${post.slug}`;
        }
        return null;
      } else if (notification.targetModel === 'Comment') {
        const target = notification.target as any;
        const postSlug = target.postSlug;
        const commentId = notification.target._id;
        if (!postSlug) return null;

        if (target.postCommunity) {
          return `/community/${target.postCommunity}/posts/${postSlug}#comment-${commentId}`;
        } else if (target.postAuthor) {
          return `/profile/${target.postAuthor}/posts/${postSlug}#comment-${commentId}`;
        }
        return null;
      }
      return null;
    case 'follow':
      return `/profile/${notification.actor.username}`;
    case 'community_join':
    case 'community_post':
      if (notification.targetModel === 'Community') {
        return `/community/${notification.target.slug}`;
      } else if (notification.targetModel === 'Post') {
        const post = notification.target as any;
        if (post.community) {
          return `/community/${post.community}/posts/${post.slug}`;
        } else if (post.author) {
          return `/profile/${post.author}/posts/${post.slug}`;
        }
        return null;
      }
      return null;
    case 'community_invite':
      return '/dashboard/requests/incoming';
    case 'community_join_request':
      return '/dashboard/requests/incoming';
    case 'community_join_approved':
      if (notification.targetModel === 'Community') {
        return `/community/${notification.target.slug}`;
      }
      return null;
    case 'new_post':
      const post = notification.target as any;
      if (post.community) {
        return `/community/${post.community}/posts/${post.slug}`;
      } else if (post.author) {
        return `/profile/${post.author}/posts/${post.slug}`;
      }
      return null;
    case 'admin_assign':
    case 'ownership_transfer':
      if (notification.targetModel === 'Community') {
        return `/community/${notification.target.slug}`;
      }
      return null;
    case 'ownership_transfer_request':
      return '/dashboard/requests/incoming';
    default:
      return null;
  }
};

const getNotificationMessage = (notification: Notification): {
  text: string;
  targetName?: string;
  targetLink?: string;
  extraText?: string;
  extraLink?: string;
  extraLinkText?: string;
} => {
  switch (notification.type) {
    case 'comment':
      if (notification.targetModel === 'Comment') {
        const target = notification.target as any;
        const postSlug = target.postSlug;
        const commentId = notification.target._id;
        if (!postSlug) {
          return {
            text: 'commented on your post',
          };
        }

        let targetLink;
        if (target.postCommunity) {
          targetLink = `/community/${target.postCommunity}/posts/${postSlug}#comment-${commentId}`;
        } else if (target.postAuthor) {
          targetLink = `/profile/${target.postAuthor}/posts/${postSlug}#comment-${commentId}`;
        }

        return {
          text: 'commented on your post',
          targetLink
        };
      }
      const post = notification.target as any;
      let postLink;
      if (post.community) {
        postLink = `/community/${post.community}/posts/${post.slug}`;
      } else if (post.author) {
        postLink = `/profile/${post.author}/posts/${post.slug}`;
      }
      return {
        text: 'commented on your post',
        targetName: post.title ? `"${post.title}"` : undefined,
        targetLink: postLink
      };
    case 'reply':
      if (notification.targetModel === 'Comment') {
        const target = notification.target as any;
        const postSlug = target.postSlug;
        const commentId = notification.target._id;
        const commentContent = target.content;

        const truncatedContent = commentContent && commentContent.length > 50
          ? commentContent.substring(0, 50) + '...'
          : commentContent;

        if (!postSlug) {
          return {
            text: 'replied to your comment',
            targetName: truncatedContent ? `"${truncatedContent}"` : undefined,
          };
        }

        let targetLink;
        if (target.postCommunity) {
          targetLink = `/community/${target.postCommunity}/posts/${postSlug}#comment-${commentId}`;
        } else if (target.postAuthor) {
          targetLink = `/profile/${target.postAuthor}/posts/${postSlug}#comment-${commentId}`;
        }

        return {
          text: 'replied to your comment',
          targetName: truncatedContent ? `"${truncatedContent}"` : undefined,
          targetLink
        };
      }
      const replyPost = notification.target as any;
      let replyPostLink;
      if (replyPost.community) {
        replyPostLink = `/community/${replyPost.community}/posts/${replyPost.slug}`;
      } else if (replyPost.author) {
        replyPostLink = `/profile/${replyPost.author}/posts/${replyPost.slug}`;
      }
      return {
        text: 'replied to your comment',
        targetLink: replyPostLink
      };
    case 'like':
      return {
        text: `liked your ${notification.targetModel.toLowerCase()}`,
      };
    case 'follow':
      return {
        text: 'started following you',
      };
    case 'view':
      return {
        text: 'viewed your profile',
      };
    case 'message':
      return {
        text: 'sent you a message',
      };
    case 'new_post':
      const newPost = notification.target as any;
      let newPostLink;
      if (newPost.community) {
        newPostLink = `/community/${newPost.community}/posts/${newPost.slug}`;
      } else if (newPost.author) {
        newPostLink = `/profile/${newPost.author}/posts/${newPost.slug}`;
      }
      return {
        text: 'created a new',
        targetName: 'post',
        targetLink: newPostLink
      };
    case 'community_join':
      return {
        text: 'joined',
        targetName: notification.target.name || 'a community',
        targetLink: `/community/${notification.target.slug}`
      };
    case 'community_post':
      if (notification.targetModel === 'Post') {
        const communityPost = notification.target as any;
        let communityPostLink;
        if (communityPost.community) {
          communityPostLink = `/community/${communityPost.community}/posts/${communityPost.slug}`;
        } else if (communityPost.author) {
          communityPostLink = `/profile/${communityPost.author}/posts/${communityPost.slug}`;
        }
        return {
          text: 'posted in your community',
          targetName: notification.target.title || 'a post',
          targetLink: communityPostLink
        };
      }
      return {
        text: 'posted in',
        targetName: notification.target.name || 'a community',
        targetLink: `/community/${notification.target.slug}`
      };
    case 'community_invite':
      if (notification.targetModel === 'CommunityInvitation' && notification.target.community) {
        return {
          text: 'invited you to join',
          targetName: notification.target.community.name || 'a community',
          targetLink: '/dashboard/requests/incoming'
        };
      }
      return {
        text: 'invited you to',
        targetName: notification.target.name || 'a community',
        targetLink: '/dashboard/requests/incoming'
      };
    case 'community_join_request':
      return {
        text: 'requested to join',
        targetName: notification.target.community?.name || 'your community',
        targetLink: '/dashboard/requests/incoming'
      };
    case 'community_join_approved':
      return {
        text: 'approved your request to join',
        targetName: notification.target.name || 'the community',
        targetLink: `/community/${notification.target.slug}`
      };
    case 'admin_assign':
      return {
        text: 'assigned you as an admin in',
        targetName: notification.target.name || 'a community',
        targetLink: `/community/${notification.target.slug}`
      };
    case 'ownership_transfer_request':
      return {
        text: 'requested you to take over the ownership of',
        targetName: notification.target.name || 'a community',
        targetLink: '/dashboard/requests/incoming'
      };
    case 'ownership_transfer':
      return {
        text: 'took over the ownership of',
        targetName: notification.target.name || 'a community',
        targetLink: `/community/${notification.target.slug}`
      };
    default:
      return {
        text: 'interacted with you',
      };
  }
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

const getActorAvatar = (actor: { name: string; profilePicture?: string }): string => {
  return getAvatarUrl(actor.name, actor.profilePicture);
};

const navigateToProfile = (username: string) => {
  router.push(`/profile/${username}`);
};

const navigateToTarget = (targetLink?: string) => {
  if (targetLink) {
    router.push(targetLink);
  }
};

onMounted(() => {
  notificationStore.fetchNotifications(1, false);
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

.actor-name {
  font-weight: 600;
  color: #111827;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s;
}

.actor-name:hover {
  color: #3b82f6;
  text-decoration: underline;
}

.target-link {
  font-weight: 600;
  color: #3b82f6;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s;
}

.target-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.load-more-container {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}
</style>
