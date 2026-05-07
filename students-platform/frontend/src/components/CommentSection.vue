<template>
  <div class="comments-section">
    <div v-if="isAuthenticated" class="comment-form">
      <img
        :src="userAvatar"
        alt="Your avatar"
        class="form-avatar"
      />
      <div class="form-input-wrapper">
        <textarea
          v-model="commentContent"
          placeholder="Write a comment..."
          class="comment-textarea"
          rows="3"
          maxlength="2000"
          :disabled="isSubmitting"
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

    <div v-else class="comments-list">
      <CommentItem
        v-for="comment in displayedComments"
        :key="comment.id"
        :comment="comment"
        :postId="postId"
        :postAuthorId="postAuthorId"
        :currentUserId="currentUserId"
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useComments } from '../composables/useComments';
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
  sessionStore.user ? getAvatarUrl(sessionStore.user.username) : ''
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

const displayedComments = computed(() => {
  if (showAllComments.value || comments.value.length <= 1) {
    return comments.value;
  }
  return comments.value.slice(0, 1);
});

onMounted(() => {
  console.log('[CommentSection] Mounted with postId:', props.postId);
  fetchComments();
});

const submitComment = async () => {
  if (!commentContent.value.trim() || isSubmitting.value) return;

  console.log('[CommentSection] Submitting comment:', {
    content: commentContent.value,
    parentCommentId: replyingTo.value?.id,
    postId: props.postId,
  });

  try {
    await addComment(
      commentContent.value,
      replyingTo.value?.id
    );
    commentContent.value = '';
    replyingTo.value = null;
    emit('comment-added');
    console.log('[CommentSection] Comment submitted successfully');
  } catch (err) {
    console.error('[CommentSection] Failed to post comment:', err);
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
  margin-bottom: 16px;
  align-items: flex-start;
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
</style>
