import { ref, computed } from 'vue';
import {
  createComment,
  getCommentsByPost,
  getRepliesCount,
  updateComment,
  deleteComment,
  type SafeComment,
  type CommentPagination,
} from '../api/comment';

export function useComments(postId: string) {
  const comments = ref<SafeComment[]>([]);
  const pagination = ref<CommentPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const error = ref<string | null>(null);

  const hasMore = computed(() => pagination.value.page < pagination.value.totalPages);

  const fetchComments = async (page: number = 1, parentCommentId?: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await getCommentsByPost(postId, page, 10, parentCommentId);

      if (page === 1) {
        comments.value = response.comments;
      } else {
        comments.value = [...comments.value, ...response.comments];
      }

      pagination.value = response.pagination;
    } catch (err: any) {
      console.error('[useComments] Failed to load comments:', err);
      console.error('[useComments] Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      error.value = err.response?.data?.message || err.message || 'Failed to load comments';
    } finally {
      isLoading.value = false;
    }
  };

  const addComment = async (content: string, parentCommentId?: string) => {
    try {
      isSubmitting.value = true;
      error.value = null;

      const newComment = await createComment({
        postId,
        content,
        parentCommentId,
      });

      if (!parentCommentId) {
        comments.value.unshift(newComment);
        pagination.value.total += 1;
      }

      return newComment;
    } catch (err: any) {
      console.error('[useComments] Failed to add comment:', err);
      console.error('[useComments] Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      if (err.response?.status === 401) {
        error.value = 'Please login to comment';
      } else {
        error.value = err.response?.data?.message || err.message || 'Failed to add comment';
      }
      throw err;
    } finally {
      isSubmitting.value = false;
    }
  };

  const editComment = async (commentId: string, content: string) => {
    try {
      error.value = null;
      const updatedComment = await updateComment(commentId, { content });

      const index = comments.value.findIndex((c) => c.id === commentId);
      if (index !== -1) {
        comments.value[index] = updatedComment;
      }

      return updatedComment;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update comment';
      throw err;
    }
  };

  const removeComment = async (commentId: string) => {
    try {
      error.value = null;
      await deleteComment(commentId);

      comments.value = comments.value.filter((c) => c.id !== commentId);
      pagination.value.total -= 1;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete comment';
      throw err;
    }
  };

  const loadMore = async () => {
    if (!hasMore.value || isLoading.value) return;
    await fetchComments(pagination.value.page + 1);
  };

  const refresh = async () => {
    await fetchComments(1);
  };

  return {
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
    refresh,
  };
}

export function useCommentReplies(commentId: string, postId: string) {
  const replies = ref<SafeComment[]>([]);
  const repliesCount = ref(0);
  const pagination = ref<CommentPagination>({
    page: 1,
    limit: 3,
    total: 0,
    totalPages: 0,
  });
  const isLoading = ref(false);
  const isExpanded = ref(false);
  const error = ref<string | null>(null);

  const hasMore = computed(() => pagination.value.page < pagination.value.totalPages);

  const fetchRepliesCount = async () => {
    try {
      const count = await getRepliesCount(commentId);
      repliesCount.value = count;
    } catch (err: any) {
      console.error('Failed to fetch replies count:', err);
    }
  };

  const fetchReplies = async (page: number = 1) => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await getCommentsByPost(postId, page, pagination.value.limit, commentId);

      // Reverse to show oldest first (chronological order)
      const sortedComments = [...response.comments].reverse();

      if (page === 1) {
        replies.value = sortedComments;
      } else {
        replies.value = [...replies.value, ...sortedComments];
      }

      pagination.value = response.pagination;
      repliesCount.value = response.pagination.total;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load replies';
    } finally {
      isLoading.value = false;
    }
  };

  const toggleExpanded = async () => {
    isExpanded.value = !isExpanded.value;
    if (isExpanded.value && replies.value.length === 0) {
      await fetchReplies();
    }
  };

  const addReply = async (content: string) => {
    try {
      error.value = null;
      const newReply = await createComment({
        postId,
        content,
        parentCommentId: commentId,
      });

      replies.value.push(newReply);
      repliesCount.value += 1;
      pagination.value.total += 1;

      return newReply;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add reply';
      throw err;
    }
  };

  const addReplyFromRealtime = (reply: SafeComment) => {
    // Only add if it's not already in the list (avoid duplicates)
    if (!replies.value.find(r => r.id === reply.id)) {
      replies.value.push(reply);
      repliesCount.value += 1;
      pagination.value.total += 1;
    }
  };

  const updateReplyFromRealtime = (updatedReply: SafeComment) => {
    const index = replies.value.findIndex(r => r.id === updatedReply.id);
    if (index !== -1) {
      replies.value[index] = updatedReply;
    }
  };

  const deleteReplyFromRealtime = (replyId: string) => {
    const index = replies.value.findIndex(r => r.id === replyId);
    if (index !== -1) {
      replies.value.splice(index, 1);
      repliesCount.value = Math.max(0, repliesCount.value - 1);
      pagination.value.total = Math.max(0, pagination.value.total - 1);
    }
  };

  const loadMore = async () => {
    if (!hasMore.value || isLoading.value) return;
    await fetchReplies(pagination.value.page + 1);
  };

  return {
    replies,
    repliesCount,
    pagination,
    isLoading,
    isExpanded,
    error,
    hasMore,
    fetchRepliesCount,
    fetchReplies,
    toggleExpanded,
    addReply,
    addReplyFromRealtime,
    updateReplyFromRealtime,
    deleteReplyFromRealtime,
    loadMore,
  };
}
