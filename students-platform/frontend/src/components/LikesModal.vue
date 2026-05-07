<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <h3>{{ likeableType === 'Post' ? 'Post Likes' : 'Likes' }}</h3>
        <button @click="close" class="close-btn">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading likes...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchLikes" class="retry-btn">Try Again</button>
      </div>

      <div v-else-if="likes.length === 0" class="empty-state">
        <p>No likes yet</p>
      </div>

      <div v-else class="likes-list">
        <div
          v-for="like in likes"
          :key="like.id"
          @click="navigateToProfile(like)"
          class="like-item"
        >
          <img
            :src="getUserAvatar(like)"
            :alt="getUserName(like)"
            class="user-avatar"
          />
          <div class="user-info">
            <p class="user-name">{{ getUserName(like) }}</p>
            <p class="user-username">@{{ getUserUsername(like) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getLikes, type SafeLike, type SafeUser } from '../api/like';
import { getAvatarUrl } from '../utils/avatar';

interface Props {
  show: boolean;
  likeableId: string;
  likeableType: 'Post' | 'Comment';
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const router = useRouter();
const likes = ref<SafeLike[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

watch(() => props.show, (newVal) => {
  if (newVal) {
    fetchLikes();
  }
});

const fetchLikes = async () => {
  loading.value = true;
  error.value = null;
  try {
    console.log('[LikesModal] Fetching likes for:', props.likeableType, props.likeableId);
    const response = await getLikes(props.likeableId, props.likeableType);
    console.log('[LikesModal] Received likes:', response);
    likes.value = response.likes;
  } catch (err: any) {
    console.error('[LikesModal] Error fetching likes:', err);
    error.value = err.message || 'Failed to load likes';
  } finally {
    loading.value = false;
  }
};

const close = () => {
  emit('close');
};

const getUserName = (like: SafeLike): string => {
  if (typeof like.user === 'object') {
    return like.user.name || like.user.username || 'Unknown User';
  }
  return 'Unknown User';
};

const getUserUsername = (like: SafeLike): string => {
  if (typeof like.user === 'object') {
    return like.user.username || 'unknown';
  }
  return 'unknown';
};

const getUserAvatar = (like: SafeLike): string => {
  if (typeof like.user === 'object') {
    return getAvatarUrl(like.user.username, like.user.avatar);
  }
  return getAvatarUrl('unknown');
};

const navigateToProfile = (like: SafeLike) => {
  if (typeof like.user === 'object') {
    router.push(`/profile/${like.user.username}`);
    close();
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e6eb;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #050505;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #65676b;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f0f2f5;
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.loading-state,
.error-state,
.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #65676b;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f2f5;
  border-top-color: #1877f2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-state p {
  color: #e41e3f;
  margin-bottom: 12px;
}

.retry-btn {
  background: #1877f2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #166fe5;
}

.likes-list {
  overflow-y: auto;
  flex: 1;
  padding: 8px 0;
}

.like-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.like-item:hover {
  background: #f0f2f5;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  color: #050505;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-username {
  font-size: 13px;
  color: #65676b;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
