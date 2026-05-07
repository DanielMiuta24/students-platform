import { ref, computed } from 'vue';
import {
  likePost,
  unlikePost,
  likeComment,
  unlikeComment,
  checkLikeStatus,
} from '../api/like';

export function useLike(
  likeableId: string,
  likeableType: 'Post' | 'Comment',
  initialCount: number = 0,
  initialLiked: boolean = false
) {
  const likeCount = ref(initialCount);
  const isLiked = ref(initialLiked);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchLikeStatus = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const status = await checkLikeStatus(likeableId, likeableType);
      isLiked.value = status;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to check like status';
    } finally {
      isLoading.value = false;
    }
  };

  const toggleLike = async () => {
    const previousLiked = isLiked.value;
    const previousCount = likeCount.value;

    try {
      isLiked.value = !isLiked.value;
      likeCount.value += isLiked.value ? 1 : -1;

      if (isLiked.value) {
        if (likeableType === 'Post') {
          await likePost(likeableId);
        } else {
          await likeComment(likeableId);
        }
      } else {
        if (likeableType === 'Post') {
          await unlikePost(likeableId);
        } else {
          await unlikeComment(likeableId);
        }
      }
    } catch (err: any) {
      isLiked.value = previousLiked;
      likeCount.value = previousCount;

      if (err.response?.status === 401) {
        error.value = 'Please login to like';
      } else {
        error.value = err.response?.data?.message || 'Failed to update like';
      }
    }
  };

  const likeText = computed(() => (isLiked.value ? 'Unlike' : 'Like'));

  return {
    likeCount,
    isLiked,
    isLoading,
    error,
    toggleLike,
    fetchLikeStatus,
    likeText,
  };
}
