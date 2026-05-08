<template>
  <div class="comment-item">
    <div class="comment-wrapper">
      <img
        :src="authorAvatar"
        :alt="authorName"
        @click="navigateToProfile"
        class="comment-avatar"
      />

      <div class="comment-main">
        <div v-if="!isEditing" class="comment-bubble">
          <div
            @click="navigateToProfile"
            class="comment-author"
          >
            {{ authorName }}
          </div>

          <div class="comment-text">
            <!-- Tagged user display for replies -->
            <span v-if="taggedUser" class="tagged-user-inline">
              <img
                :src="taggedUser.avatar"
                :alt="taggedUser.name"
                @click="navigateToTaggedProfile"
                class="tagged-avatar"
              />
              <span
                @click="navigateToTaggedProfile"
                class="tagged-name"
              >
                {{ taggedUser.name }}
              </span>
            </span><span v-html="formattedContent"></span>
          </div>
        </div>

        <div v-else class="comment-edit-form">
          <textarea
            v-model="editContent"
            class="edit-input"
            rows="2"
            maxlength="2000"
            :disabled="isSubmitting"
            @keydown.esc="cancelEdit"
          />
          <div class="edit-actions">
            <button @click="cancelEdit" :disabled="isSubmitting" class="btn-cancel">
              Cancel
            </button>
            <button
              @click="saveEdit"
              :disabled="!editContent.trim() || isSubmitting"
              class="btn-save"
            >
              {{ isSubmitting ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>

        <div class="comment-actions">
          <button
            @click="toggleLike"
            class="action-link"
            :class="{ 'action-liked': isLiked }"
          >
            {{ isLiked ? 'Liked' : 'Like' }}
          </button>
          <span class="action-separator">·</span>
          <button @click="toggleReply" class="action-link">
            Reply
          </button>
          <span v-if="canEdit" class="action-separator">·</span>
          <button v-if="canEdit && !isEditing" @click="startEdit" class="action-link">
            Edit
          </button>
          <span v-if="canDelete" class="action-separator">·</span>
          <button v-if="canDelete" @click="handleDelete" class="action-link action-delete">
            Delete
          </button>
          <span class="action-separator">·</span>
          <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
          <button v-if="likeCount > 0" @click="showLikesModal = true" class="like-count">
            <span class="like-icon">👍</span> {{ likeCount }}
          </button>
        </div>

        <div v-if="showReplyBox" class="reply-box">
          <img
            :src="currentUserAvatar"
            alt="Your avatar"
            class="reply-avatar"
          />
          <div class="reply-input-wrapper">
            <textarea
              ref="replyTextarea"
              v-model="replyContent"
              placeholder="Write a reply..."
              class="reply-textarea"
              rows="2"
              maxlength="2000"
              :disabled="isSubmittingReply"
              @keydown.meta.enter="submitReply"
              @keydown.ctrl.enter="submitReply"
              @keydown.esc="cancelReply"
            />
            <div class="reply-actions">
              <button @click="cancelReply" :disabled="isSubmittingReply" class="btn-cancel-reply">
                Cancel
              </button>
              <button
                @click="submitReply"
                :disabled="!replyContent.trim() || isSubmittingReply"
                class="btn-submit-reply"
              >
                {{ isSubmittingReply ? 'Posting...' : 'Reply' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="repliesCount > 0" class="replies-toggle">
          <button @click="toggleReplies" class="replies-toggle-btn">
            <svg
              class="toggle-icon"
              :class="{ 'rotated': isExpanded }"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            {{ repliesCount }} {{ repliesCount === 1 ? 'Reply' : 'Replies' }}
          </button>
        </div>

        <template v-if="isExpanded && replies.length > 0">
          <div v-if="props.depth < 2" class="replies-list" :class="`depth-${props.depth + 1}`">
            <CommentItem
              v-for="reply in replies"
              :key="reply.id"
              :comment="reply"
              :postId="postId"
              :postAuthorId="postAuthorId"
              :currentUserId="currentUserId"
              :isReply="true"
              :rootParentId="props.rootParentId || props.comment.id"
              :depth="props.depth + 1"
              @reply="$emit('reply', $event)"
              @update="handleReplyUpdate"
              @delete="handleReplyDelete"
            />

            <button
              v-if="hasMoreReplies"
              @click="loadMoreReplies"
              :disabled="isLoadingReplies"
              class="load-more-replies"
            >
              {{ isLoadingReplies ? 'Loading...' : 'View more replies' }}
            </button>
          </div>

          <template v-else>
            <CommentItem
              v-for="reply in replies"
              :key="reply.id"
              :comment="reply"
              :postId="postId"
              :postAuthorId="postAuthorId"
              :currentUserId="currentUserId"
              :isReply="true"
              :rootParentId="props.rootParentId || props.comment.id"
              :depth="2"
              @reply="$emit('reply', $event)"
              @update="handleReplyUpdate"
              @delete="handleReplyDelete"
            />

            <button
              v-if="hasMoreReplies"
              @click="loadMoreReplies"
              :disabled="isLoadingReplies"
              class="load-more-replies"
              style="margin-top: 8px;"
            >
              {{ isLoadingReplies ? 'Loading...' : 'View more replies' }}
            </button>
          </template>
        </template>
      </div>
    </div>

    <LikesModal
      :show="showLikesModal"
      :likeable-id="comment.id"
      likeable-type="Comment"
      @close="showLikesModal = false"
    />

    <ConfirmModal
      :show="showDeleteModal"
      title="Delete Comment?"
      message="This comment will be permanently deleted. This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import type { SafeComment } from '../api/comment';
import { updateComment, deleteComment, getComment, createComment } from '../api/comment';
import { useLike } from '../composables/useLike';
import { useCommentReplies } from '../composables/useComments';
import { getAvatarUrl } from '../utils/avatar';
import { useSessionStore } from '../store/session';
import LikesModal from './LikesModal.vue';
import ConfirmModal from './ConfirmModal.vue';

interface Props {
  comment: SafeComment;
  postId: string;
  postAuthorId?: string;
  currentUserId?: string;
  isReply?: boolean;
  rootParentId?: string;
  depth?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isReply: false,
  rootParentId: undefined,
  depth: 0,
});

const emit = defineEmits<{
  reply: [comment: SafeComment];
  update: [];
  delete: [];
}>();

const sessionStore = useSessionStore();
const router = useRouter();
const isEditing = ref(false);
const editContent = ref(props.comment.content);
const isSubmitting = ref(false);
const showReplyBox = ref(false);
const replyContent = ref('');
const isSubmittingReply = ref(false);
const replyTextarea = ref<HTMLTextAreaElement | null>(null);
const parentComment = ref<SafeComment | null>(null);
const showLikesModal = ref(false);
const showDeleteModal = ref(false);

const authorName = computed(() => {
  if (props.comment.author) {
    return props.comment.author.name || props.comment.author.username || 'Unknown User';
  }
  return 'Unknown User';
});

const authorUsername = computed(() => {
  if (props.comment.author) {
    return props.comment.author.username || props.comment.authorId;
  }
  return props.comment.authorId;
});

const authorAvatar = computed(() => {
  if (props.comment.author) {
    return getAvatarUrl(props.comment.author.username, props.comment.author.avatar);
  }
  return getAvatarUrl(props.comment.authorId);
});

const taggedUser = computed(() => {
  if (props.comment.parentCommentId && parentComment.value?.author) {
    return {
      name: parentComment.value.author.name || parentComment.value.author.username,
      username: parentComment.value.author.username,
      avatar: getAvatarUrl(parentComment.value.author.username, parentComment.value.author.avatar)
    };
  }
  return null;
});

const canEdit = computed(() => {
  if (!props.currentUserId) return false;
  return props.currentUserId === props.comment.authorId;
});

const canDelete = computed(() => {
  if (!props.currentUserId) return false;
  return props.currentUserId === props.comment.authorId || props.currentUserId === props.postAuthorId;
});

const currentUserAvatar = computed(() =>
  sessionStore.user ? getAvatarUrl(sessionStore.user.username) : ''
);

const { likeCount, isLiked, toggleLike, fetchLikeStatus } = useLike(
  props.comment.id,
  'Comment',
  props.comment.likeCount || 0,
  false
);

const {
  replies,
  repliesCount,
  isLoading: isLoadingReplies,
  isExpanded,
  hasMore: hasMoreReplies,
  fetchRepliesCount,
  fetchReplies,
  toggleExpanded,
  loadMore: loadMoreReplies,
  addReply,
} = useCommentReplies(props.comment.id, props.postId);

onMounted(async () => {
  if (sessionStore.isAuthenticated) {
    await fetchLikeStatus();
  }

  await fetchRepliesCount();

  if (props.depth === 0 && repliesCount.value > 0) {
    isExpanded.value = true;
    fetchReplies();
  }

  if (props.comment.parentCommentId) {
    try {
      parentComment.value = await getComment(props.comment.parentCommentId);
    } catch (error) {
      console.error('Failed to fetch parent comment:', error);
    }
  }
});

const startEdit = () => {
  editContent.value = props.comment.content;
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  editContent.value = props.comment.content;
};

const saveEdit = async () => {
  if (!editContent.value.trim()) return;
  isSubmitting.value = true;
  try {
    await updateComment(props.comment.id, { content: editContent.value });
    emit('update');
    isEditing.value = false;
  } catch (error) {
    console.error('Failed to update comment:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = () => {
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    await deleteComment(props.comment.id);
    emit('delete');
  } catch (error) {
    console.error('Failed to delete comment:', error);
  }
  showDeleteModal.value = false;
};

const toggleReplies = () => {
  toggleExpanded();
};

const toggleReply = async () => {
  showReplyBox.value = !showReplyBox.value;

  if (showReplyBox.value) {
    if (props.depth > 0) {
      replyContent.value = `@${authorName.value} `;
    } else {
      replyContent.value = '';
    }
    await nextTick();
    if (replyTextarea.value) {
      replyTextarea.value.focus();
      replyTextarea.value.setSelectionRange(replyContent.value.length, replyContent.value.length);
    }
  } else {
    replyContent.value = '';
  }
};

const navigateToProfile = () => {
  if (authorUsername.value) {
    router.push(`/profile/${authorUsername.value}`);
  }
};

const navigateToTaggedProfile = () => {
  if (taggedUser.value?.username) {
    router.push(`/profile/${taggedUser.value.username}`);
  }
};

const cancelReply = () => {
  showReplyBox.value = false;
  replyContent.value = '';
};

const submitReply = async () => {
  if (!replyContent.value.trim() || isSubmittingReply.value) return;

  isSubmittingReply.value = true;
  try {
    const targetParentId = props.depth >= 2 && props.comment.parentCommentId
      ? props.comment.parentCommentId
      : props.comment.id;

    await createComment({
      postId: props.postId,
      content: replyContent.value,
      parentCommentId: targetParentId,
    });

    replyContent.value = '';
    showReplyBox.value = false;

    if (props.depth >= 2) {
      emit('update');
    } else {
      await fetchRepliesCount();
      if (!isExpanded.value) {
        isExpanded.value = true;
      }
      await fetchReplies(1);
      emit('update');
    }
  } catch (error) {
    console.error('Failed to submit reply:', error);
  } finally {
    isSubmittingReply.value = false;
  }
};

const handleReplyUpdate = async () => {
  await fetchRepliesCount();
  if (isExpanded.value) {
    await fetchReplies(1);
  }
  emit('update');
};

const handleReplyDelete = async () => {
  await fetchRepliesCount();
  if (isExpanded.value) {
    await fetchReplies(1);
  }
  emit('delete');
};

const formatDate = (date: Date) => {
  const now = new Date();
  const commentDate = new Date(date);
  const diffInMs = now.getTime() - commentDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 7) return `${diffInDays}d`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w`;

  return commentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formattedContent = computed(() => {
  let content = props.comment.content;

  if (taggedUser.value) {
    content = content.replace(/^@\S+\s*/, '');
  }

  content = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  content = content.replace(/@(\S+)/g, (match, name) => {
    return `<span class="mention">@${name}</span>`;
  });

  return content;
});
</script>

<style scoped>
.comment-item {
  margin-bottom: 8px;
}

.comment-wrapper {
  display: flex;
  gap: 8px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  cursor: pointer;
  transition: opacity 0.2s;
}

.comment-avatar:hover {
  opacity: 0.8;
}

.comment-main {
  flex: 1;
  min-width: 0;
}

.comment-bubble {
  background: #f0f2f5;
  border-radius: 18px;
  padding: 8px 12px;
  display: inline-block;
  max-width: 100%;
  word-wrap: break-word;
}

.comment-author {
  font-size: 13px;
  font-weight: 600;
  color: #050505;
  margin-bottom: 2px;
  cursor: pointer;
  display: inline-block;
}

.comment-author:hover {
  text-decoration: underline;
}

.comment-text {
  font-size: 15px;
  line-height: 1.3333;
  color: #050505;
  white-space: pre-wrap;
  word-break: break-word;
}

.tagged-user-inline {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: #f0f2f5;
  border-radius: 10px;
  vertical-align: middle;
}

.tagged-avatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  vertical-align: middle;
}

.tagged-avatar:hover {
  opacity: 0.8;
}

.tagged-name {
  font-size: 15px;
  font-weight: 600;
  color: #1877f2;
  cursor: pointer;
  white-space: nowrap;
}

.tagged-name:hover {
  text-decoration: underline;
}

.comma {
  color: #050505;
  font-size: 15px;
}

.comment-edit-form {
  background: #fff;
  border: 1px solid #ccd0d5;
  border-radius: 18px;
  overflow: hidden;
}

.edit-input {
  width: 100%;
  padding: 8px 12px;
  border: none;
  font-size: 15px;
  font-family: inherit;
  resize: none;
  background: #f0f2f5;
}

.edit-input:focus {
  outline: none;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px;
  background: #fff;
  border-top: 1px solid #e4e6eb;
}

.btn-cancel,
.btn-save {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #e4e6eb;
  color: #050505;
}

.btn-cancel:hover:not(:disabled) {
  background: #d8dadf;
}

.btn-save {
  background: #1877f2;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #166fe5;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  margin-left: 12px;
  font-size: 12px;
}

.action-link {
  background: none;
  border: none;
  color: #65676b;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  transition: color 0.1s;
}

.action-link:hover {
  text-decoration: underline;
}

.action-liked {
  color: #1877f2;
}

.action-delete:hover {
  color: #e41e3f;
}

.action-separator {
  color: #ccd0d5;
}

.comment-time {
  color: #65676b;
  font-size: 12px;
}

.like-count {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #65676b;
  font-size: 12px;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.1s;
}

.like-count:hover {
  text-decoration: underline;
  color: #1877f2;
}

.like-icon {
  font-size: 14px;
}

.replies-toggle {
  margin-top: 6px;
  margin-left: 12px;
}

.replies-toggle-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #65676b;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
}

.replies-toggle-btn:hover {
  text-decoration: underline;
}

.toggle-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.replies-list {
  margin-top: 8px;
}

.replies-list.depth-1 {
  padding-left: 40px;
}

.replies-list.depth-2 {
  padding-left: 40px;
}

.replies-list-flat {
  margin-top: 8px;
}

.load-more-replies {
  background: none;
  border: none;
  color: #65676b;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  padding: 8px 0;
  margin-left: 12px;
}

.load-more-replies:hover:not(:disabled) {
  text-decoration: underline;
}

.load-more-replies:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reply-box {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  margin-left: 12px;
  align-items: flex-start;
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.reply-input-wrapper {
  flex: 1;
  position: relative;
}

.reply-textarea {
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

.reply-textarea:focus {
  outline: none;
  background: #e4e6eb;
}

.reply-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 6px;
  padding: 0 12px;
}

.btn-cancel-reply,
.btn-submit-reply {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel-reply {
  background: #e4e6eb;
  color: #050505;
}

.btn-cancel-reply:hover:not(:disabled) {
  background: #d8dadf;
}

.btn-submit-reply {
  background: #1877f2;
  color: white;
}

.btn-submit-reply:hover:not(:disabled) {
  background: #166fe5;
}

.btn-submit-reply:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comment-text :deep(.mention) {
  color: #1877f2;
  font-weight: 600;
  cursor: pointer;
}

.comment-text :deep(.mention):hover {
  text-decoration: underline;
}
</style>
