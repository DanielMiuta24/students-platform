<template>
  <div class="comments-section">
    <div v-if="replyingTo" class="replying-banner">
      <span>Replying to comment</span>
      <button @click="cancelReply" class="cancel-reply-btn">Cancel</button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="isLoading && comments.length === 0" class="loading-skeleton">
      <div v-for="i in 3" :key="i" class="skeleton-comment">
        <div class="skeleton-avatar" />
        <div class="skeleton-content">
          <div class="skeleton-bubble" />
        </div>
      </div>
    </div>

    <div v-else-if="comments.length === 0 && !isLoading" class="empty-state">
      <p>No comments yet. Be the first to comment!</p>
    </div>

    <div v-else>
      <div class="sort-options">
        <button
          @click="sortBy = 'relevant'"
          :class="['sort-btn', { active: sortBy === 'relevant' }]"
        >
          Most Relevant
        </button>
        <button
          @click="sortBy = 'newest'"
          :class="['sort-btn', { active: sortBy === 'newest' }]"
        >
          Newest
        </button>
        <button
          @click="sortBy = 'oldest'"
          :class="['sort-btn', { active: sortBy === 'oldest' }]"
        >
          Oldest
        </button>
      </div>

      <div class="comments-list">
      <CommentItem
        v-for="comment in displayedComments"
        :key="comment.id"
        :comment="comment"
        :postId="postId"
        :postAuthorId="postAuthorId"
        :currentUserId="currentUserId"
        :depth="0"
        :sendTypingIndicator="sendTypingIndicator"
        @reply="handleReply"
        @update="handleUpdateComment"
        @delete="handleDeleteComment"
      />

      <button
        v-if="!showAllComments && comments.length > 1"
        @click="showAllComments = true"
        class="show-more-comments-btn"
      >
        View {{ comments.length - 1 }} more {{ comments.length - 1 === 1 ? 'comment' : 'comments' }}
      </button>
      </div>

      <div v-if="hasMore && showAllComments" class="load-more-container">
        <button
          @click="loadMore"
          :disabled="isLoading"
          class="load-more-btn"
        >
          {{ isLoading ? 'Loading...' : 'Load More Comments' }}
        </button>
      </div>
    </div>

    <!-- Comment form at the bottom -->
    <div v-if="isAuthenticated" class="comment-form">
      <img
        :src="userAvatar"
        alt="Your avatar"
        class="form-avatar"
      />
      <div class="form-input-wrapper">
        <!-- Typing indicator with avatars, names, and animated dots -->
        <div v-if="Array.from(typingUsers.values()).length > 0" class="typing-indicator">
          <div class="typing-user-info">
            <div class="typing-avatars">
              <img
                v-for="(typingUser, index) in Array.from(typingUsers.values()).slice(0, 3)"
                :key="typingUser.userId"
                :src="getAvatarUrl(typingUser.name, typingUser.userAvatar)"
                :alt="typingUser.name"
                class="typing-avatar"
                :style="{ zIndex: 3 - index }"
              />
            </div>
            <span class="typing-names">{{ getTypingNamesText(Array.from(typingUsers.values())) }}</span>
          </div>
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <textarea
          v-model="commentContent"
          placeholder="Write a comment..."
          class="comment-textarea"
          rows="3"
          maxlength="2000"
          :disabled="isSubmitting"
          @input="handleTyping"
          @blur="handleStopTyping"
          @keydown.meta.enter="submitComment"
          @keydown.ctrl.enter="submitComment"
        />
        <div class="form-footer">
          <span class="char-count">{{ commentContent.length }}/2000</span>
          <button
            @click="submitComment"
            :disabled="!commentContent.trim() || isSubmitting"
            class="submit-btn"
          >
            {{ isSubmitting ? 'Posting...' : 'Post Comment' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="login-prompt">
      <p>Please <router-link to="/login" class="login-link">login</router-link> to comment</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, provide } from 'vue';
import { useComments } from '../composables/useComments';
import { useRealtimeComments } from '../composables/useRealtimeComments';
import { useCommentTyping } from '../composables/useCommentTyping';
import CommentItem from './CommentItem.vue';
import type { SafeComment } from '../api/comment';
import { useSessionStore } from '../store/session';
import { getAvatarUrl } from '../utils/avatar';

interface Props {
  postId: string;
  postAuthorId?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'comment-added': [];
  'comment-deleted': [];
}>();

const sessionStore = useSessionStore();
const isAuthenticated = computed(() => sessionStore.isAuthenticated);
const currentUserId = computed(() => sessionStore.user?.id);
const userAvatar = computed(() =>
  sessionStore.user ? getAvatarUrl(sessionStore.user.username, sessionStore.user.avatar) : ''
);

const {
  comments,
  pagination,
  isLoading,
  isSubmitting,
  error,
  hasMore,
  fetchComments,
  addComment,
  editComment,
  removeComment,
  loadMore,
} = useComments(props.postId);

const commentContent = ref('');
const replyingTo = ref<SafeComment | null>(null);
const showAllComments = ref(false);
const sortBy = ref<'relevant' | 'newest' | 'oldest'>('relevant');

// Real-time features
const latestCommentCreated = ref<SafeComment | null>(null);
const latestCommentUpdated = ref<SafeComment | null>(null);
const latestCommentDeleted = ref<{ commentId: string; childCommentIds: string[] } | null>(null);

const handleCommentCreated = (comment: SafeComment) => {
  latestCommentCreated.value = comment; // Notify watchers

  if (!comment.parentCommentId) {
    // Only add if it's not already in the list
    if (!comments.value.find(c => c.id === comment.id)) {
      comments.value.unshift(comment);
      pagination.value.total += 1;
      emit('comment-added');
    }
  } else {
    // If it's a reply, also emit to update the count
    emit('comment-added');
  }
};

const handleCommentUpdated = (updatedComment: SafeComment) => {
  latestCommentUpdated.value = updatedComment; // Notify watchers

  const index = comments.value.findIndex(c => c.id === updatedComment.id);
  if (index !== -1) {
    comments.value[index] = updatedComment;
  }
};

const handleCommentDeleted = (commentId: string, childCommentIds: string[]) => {
  latestCommentDeleted.value = { commentId, childCommentIds };

  comments.value = comments.value.filter(c => c.id !== commentId);
  comments.value = comments.value.filter(c => !childCommentIds.includes(c.id));

  const deletedCount = 1 + childCommentIds.length;
  pagination.value.total -= deletedCount;
  emit('comment-deleted');
};

const {
  sendTypingIndicator,
} = useRealtimeComments(
  props.postId,
  handleCommentCreated,
  handleCommentUpdated,
  handleCommentDeleted
);

// Provide real-time comment handlers to child CommentItem components
provide('realtimeCommentEvents', {
  latestCommentCreated,
  latestCommentUpdated,
  latestCommentDeleted,
});

// Use the comment typing composable for root-level comments (no parent)
const { typingUsers } = useCommentTyping();

// Helper function to format typing user names
const getTypingNamesText = (users: any[]) => {
  if (users.length === 0) return '';
  if (users.length === 1) return users[0].name;
  if (users.length === 2) return `${users[0].name} and ${users[1].name}`;
  return `${users[0].name} and ${users.length - 1} others`;
};

let typingTimer: number | null = null;

const handleTyping = () => {
  sendTypingIndicator(true);

  if (typingTimer) {
    clearTimeout(typingTimer);
  }

  typingTimer = window.setTimeout(() => {
    sendTypingIndicator(false);
  }, 2000);
};

const handleStopTyping = () => {
  if (typingTimer) {
    clearTimeout(typingTimer);
    typingTimer = null;
  }
  sendTypingIndicator(false);
};

const sortedComments = computed(() => {
  const rootComments = [...comments.value];

  if (sortBy.value === 'newest') {
    return rootComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy.value === 'oldest') {
    return rootComments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    // Most Relevant: sort by likes (engagement), highest first
    return rootComments.sort((a, b) => {
      const likesA = a.likeCount || 0;
      const likesB = b.likeCount || 0;

      // Sort by likes descending (most likes first)
      if (likesA !== likesB) {
        return likesB - likesA;
      }

      // If same number of likes, prefer newer comments
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
});

const displayedComments = computed(() => {
  if (showAllComments.value || sortedComments.value.length <= 1) {
    return sortedComments.value;
  }
  return sortedComments.value.slice(0, 1);
});

onMounted(() => {
  fetchComments();
});

const submitComment = async () => {
  if (!commentContent.value.trim() || isSubmitting.value) return;

  // Clear typing indicator before submitting
  if (typingTimer) {
    clearTimeout(typingTimer);
    typingTimer = null;
  }
  sendTypingIndicator(false);

  try {
    await addComment(
      commentContent.value,
      replyingTo.value?.id
    );
    commentContent.value = '';
    replyingTo.value = null;
    emit('comment-added');
  } catch (err) {
  }
};

const handleReply = (comment: SafeComment) => {
  replyingTo.value = comment;
  const textarea = document.querySelector('.comment-textarea') as HTMLTextAreaElement;
  if (textarea) {
    textarea.focus();
  }
};

const cancelReply = () => {
  replyingTo.value = null;
};

const handleUpdateComment = async () => {
  await fetchComments();
  emit('comment-added');
};

const handleDeleteComment = async () => {
  await fetchComments();
  emit('comment-deleted');
};
</script>

<style scoped>
.comments-section {
  padding: 12px 16px;
  border-top: 1px solid #e4e6eb;
}

.comment-form {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  margin-bottom: 0;
  align-items: flex-start;
  padding-top: 16px;
  border-top: 1px solid #e4e6eb;
}

.form-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.form-input-wrapper {
  flex: 1;
  position: relative;
}

.comment-textarea {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 18px;
  font-size: 15px;
  font-family: inherit;
  resize: none;
  background: #f0f2f5;
  line-height: 1.3333;
}

.comment-textarea:focus {
  outline: none;
  background: #e4e6eb;
}

.comment-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.comment-textarea::placeholder {
  color: #65676b;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  padding: 0 12px;
}

.char-count {
  font-size: 12px;
  color: #65676b;
}

.submit-btn {
  padding: 4px 12px;
  background: #1877f2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #166fe5;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-prompt {
  padding: 12px 16px;
  background: #f0f2f5;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 16px;
}

.login-prompt p {
  margin: 0;
  color: #65676b;
  font-size: 14px;
}

.login-link {
  color: #1877f2;
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  text-decoration: underline;
}

.replying-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background: #e7f3ff;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #1877f2;
  font-weight: 500;
}

.cancel-reply-btn {
  background: none;
  border: none;
  color: #1877f2;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  padding: 2px 6px;
}

.cancel-reply-btn:hover {
  text-decoration: underline;
}

.error-message {
  padding: 10px 12px;
  background: #ffebe9;
  color: #c41e3a;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 13px;
}

.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
}

.skeleton-comment {
  display: flex;
  gap: 8px;
}

.skeleton-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f2f5 25%, #e4e6eb 50%, #f0f2f5 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-content {
  flex: 1;
}

.skeleton-bubble {
  height: 48px;
  background: linear-gradient(90deg, #f0f2f5 25%, #e4e6eb 50%, #f0f2f5 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 18px;
  max-width: 70%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.empty-state {
  padding: 32px 20px;
  text-align: center;
  color: #65676b;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.sort-options {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  border-bottom: 1px solid #e4e6eb;
  margin-bottom: 8px;
}

.sort-btn {
  padding: 6px 12px;
  background: none;
  border: none;
  color: #65676b;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.sort-btn:hover {
  background: #f0f2f5;
}

.sort-btn.active {
  color: #1877f2;
  background: #e7f3ff;
}

.comments-list {
  display: flex;
  flex-direction: column;
}

.show-more-comments-btn {
  margin: 8px 0 8px 12px;
  padding: 0;
  background: none;
  border: none;
  color: #65676b;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
}

.show-more-comments-btn:hover {
  text-decoration: underline;
}

.load-more-container {
  margin-top: 8px;
  text-align: center;
}

.load-more-btn {
  padding: 8px 16px;
  background: none;
  color: #1877f2;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.load-more-btn:hover:not(:disabled) {
  background: #f0f2f5;
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.typing-indicator {
  position: absolute;
  top: -36px;
  left: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeIn 0.2s ease-in;
}

.typing-user-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.typing-avatars {
  display: flex;
}

.typing-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  margin-left: -6px;
  object-fit: cover;
}

.typing-avatar:first-child {
  margin-left: 0;
}

.typing-names {
  font-size: 13px;
  font-weight: 500;
  color: #050505;
}

.typing-dots {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 6px 12px;
  background: #e4e6eb;
  border-radius: 12px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #65676b;
  border-radius: 50%;
  animation: typingBounce 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-8px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
