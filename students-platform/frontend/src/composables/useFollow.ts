import { ref, computed } from 'vue';
import {
  followUser,
  unfollowUser,
  checkFollowStatus,
  getFollowers,
  getFollowing,
  getFollowStats,
  type SafeFollow,
  type FollowStatsResponse,
} from '../api/follow';

export function useFollow(userId: string) {
  const currentUserId = ref(userId);
  const isFollowing = ref(false);
  const followsBack = ref(false);
  const followersCount = ref(0);
  const followingCount = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchFollowStatus = async (silent: boolean = false) => {
    if (!currentUserId.value) return;

    try {
      if (!silent) {
        isLoading.value = true;
      }
      error.value = null;
      const status = await checkFollowStatus(currentUserId.value);
      isFollowing.value = status.isFollowing;
      followsBack.value = status.followsBack;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to check follow status';
    } finally {
      if (!silent) {
        isLoading.value = false;
      }
    }
  };

  const fetchFollowStats = async () => {
    if (!currentUserId.value) return;

    try {
      error.value = null;
      const stats = await getFollowStats(currentUserId.value);
      followersCount.value = stats.followersCount;
      followingCount.value = stats.followingCount;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch stats';
    }
  };

  const toggleFollow = async () => {
    if (!currentUserId.value) return;

    const previousFollowing = isFollowing.value;
    const previousFollowersCount = followersCount.value;

    try {
      isFollowing.value = !isFollowing.value;
      followersCount.value += isFollowing.value ? 1 : -1;

      if (isFollowing.value) {
        await followUser(currentUserId.value);
      } else {
        await unfollowUser(currentUserId.value);
      }
    } catch (err: any) {
      isFollowing.value = previousFollowing;
      followersCount.value = previousFollowersCount;

      if (err.response?.status === 401) {
        error.value = 'Please login to follow users';
      } else if (err.response?.status === 400) {
        error.value = 'Cannot follow yourself';
      } else {
        error.value = err.response?.data?.message || 'Failed to update follow';
      }
    }
  };

  const followText = computed(() => {
    if (isFollowing.value) {
      return 'Unfollow';
    }
    return followsBack.value ? 'Follow Back' : 'Follow';
  });

  const setUserId = (newUserId: string) => {
    currentUserId.value = newUserId;
  };

  return {
    isFollowing,
    followsBack,
    followersCount,
    followingCount,
    isLoading,
    error,
    toggleFollow,
    fetchFollowStatus,
    fetchFollowStats,
    followText,
    setUserId,
  };
}

export function useFollowList(userId: string, type: 'followers' | 'following') {
  const users = ref<SafeFollow[]>([]);
  const page = ref(1);
  const limit = ref(20);
  const total = ref(0);
  const hasMore = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchUsers = async (pageNum: number = 1) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response =
        type === 'followers'
          ? await getFollowers(userId, pageNum, limit.value)
          : await getFollowing(userId, pageNum, limit.value);

      if (pageNum === 1) {
        users.value = response.users;
      } else {
        users.value = [...users.value, ...response.users];
      }

      page.value = response.pagination.page;
      total.value = response.pagination.total;
      hasMore.value = response.pagination.hasMore;
    } catch (err: any) {
      error.value = err.response?.data?.message || `Failed to load ${type}`;
    } finally {
      isLoading.value = false;
    }
  };

  const loadMore = async () => {
    if (!hasMore.value || isLoading.value) return;
    await fetchUsers(page.value + 1);
  };

  const refresh = async () => {
    await fetchUsers(1);
  };

  return {
    users,
    page,
    total,
    hasMore,
    isLoading,
    error,
    fetchUsers,
    loadMore,
    refresh,
  };
}
