import { ref, computed, toRef } from 'vue';
import { getPostsByAuthor } from '../api/post';
import type { SafePost, CursorPostsResult, PostVisibility } from '../types/post';
import { useSessionStore } from '../store/session';

type VisibilityFilter = 'all' | 'public' | 'private' | 'friends';

export const useProfilePosts = (profileUserId: string) => {
  const session = useSessionStore();
  const currentUserId = ref(profileUserId);

  const posts = ref<SafePost[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const nextCursor = ref<string | null>(null);
  const hasMore = ref(false);
  const selectedCategoryId = ref<string | null>(null);
  const selectedVisibility = ref<VisibilityFilter>('all');
  const isFriend = ref(false);

  const isOwner = computed(() => {
    return session.user?.id === currentUserId.value;
  });

  const visiblePosts = computed(() => {
    let filtered = posts.value;

    if (isOwner.value) {
      filtered = filtered.filter((post) => post.status === 'published');
    } else {
      // For non-owners, show public posts and friends-only posts if they're friends
      filtered = filtered.filter((post) => {
        if (post.status !== 'published') return false;
        if (post.visibility === 'public') return true;
        if (post.visibility === 'friends' && isFriend.value) return true;
        return false;
      });
    }

    // Apply visibility filter (only for owners)
    if (isOwner.value && selectedVisibility.value !== 'all') {
      filtered = filtered.filter((post) => post.visibility === selectedVisibility.value);
    }

    if (selectedCategoryId.value) {
      filtered = filtered.filter((post) => {
        if (typeof post.category === 'string') {
          return post.category === selectedCategoryId.value;
        }
        if (post.category && typeof post.category === 'object') {
          return (post.category as any).id === selectedCategoryId.value;
        }
        return false;
      });
    }

    return filtered;
  });

  const fetchPosts = async (reset: boolean = false) => {
    try {
      loading.value = true;
      error.value = null;

      const cursor = reset ? undefined : nextCursor.value || undefined;
      const result: CursorPostsResult = await getPostsByAuthor(currentUserId.value, cursor, 10);

      if (reset) {
        posts.value = result.posts;
      } else {
        posts.value = [...posts.value, ...result.posts];
      }

      nextCursor.value = result.nextCursor;
      hasMore.value = result.hasMore;
    } catch (err: any) {
      error.value = err.message || 'Failed to load posts';
    } finally {
      loading.value = false;
    }
  };

  const loadMore = async () => {
    if (!hasMore.value || loading.value) return;
    await fetchPosts(false);
  };

  const refresh = async () => {
    await fetchPosts(true);
  };

  const removePost = (postId: string) => {
    posts.value = posts.value.filter((post) => post.id !== postId);
  };

  const updatePost = (updatedPost: SafePost) => {
    const index = posts.value.findIndex((post) => post.id === updatedPost.id);
    if (index !== -1) {
      posts.value[index] = updatedPost;
    }
  };

  const setCategory = (categoryId: string | null) => {
    selectedCategoryId.value = categoryId;
  };

  const setVisibility = (visibility: VisibilityFilter) => {
    selectedVisibility.value = visibility;
  };

  const setUserId = (newUserId: string) => {
    currentUserId.value = newUserId;
  };

  const setIsFriend = (friendStatus: boolean) => {
    isFriend.value = friendStatus;
  };

  return {
    posts: visiblePosts,
    loading,
    error,
    hasMore,
    isOwner,
    fetchPosts,
    loadMore,
    refresh,
    removePost,
    updatePost,
    setCategory,
    setVisibility,
    setUserId,
    setIsFriend,
  };
};
