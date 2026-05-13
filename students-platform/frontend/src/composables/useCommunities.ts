import { ref, computed } from 'vue';
import { getCommunities, joinCommunity, leaveCommunity, createJoinRequest, cancelJoinRequest } from '../api/community';
import type { SafeCommunity, CommunitiesResult } from '../types/community';
import { useSessionStore } from '../store/session';

export const useCommunities = () => {
  const session = useSessionStore();

  const communities = ref<SafeCommunity[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const nextCursor = ref<string | null>(null);
  const hasMore = ref(false);
  const selectedCategoryId = ref<string | null>(null);
  const searchQuery = ref<string>('');
  const founderId = ref<string | null>(null);

  const isEmpty = computed(() => {
    return !loading.value && communities.value.length === 0;
  });

  const filteredCommunities = computed(() => {
    let filtered = communities.value;

    // Client-side filtering for search if needed
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (community) =>
          community.name.toLowerCase().includes(query) ||
          community.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  const fetchCommunities = async (reset: boolean = false) => {
    try {
      loading.value = true;
      error.value = null;

      const cursor = reset ? undefined : nextCursor.value || undefined;
      const result: CommunitiesResult = await getCommunities(
        cursor,
        10,
        selectedCategoryId.value || undefined,
        searchQuery.value || undefined,
        founderId.value || undefined
      );

      if (reset) {
        communities.value = result.communities;
      } else {
        communities.value = [...communities.value, ...result.communities];
      }

      nextCursor.value = result.nextCursor;
      hasMore.value = result.hasMore;
    } catch (err: any) {
      error.value = err.message || 'Failed to load communities';
    } finally {
      loading.value = false;
    }
  };

  const loadMore = async () => {
    if (!hasMore.value || loading.value) return;
    await fetchCommunities(false);
  };

  const refresh = async () => {
    await fetchCommunities(true);
  };

  const setCategory = (categoryId: string | null) => {
    selectedCategoryId.value = categoryId;
    refresh();
  };

  const setSearch = (query: string) => {
    searchQuery.value = query;
    refresh();
  };

  const setFounderId = (userId: string | null) => {
    founderId.value = userId;
    refresh();
  };

  const toggleJoin = async (communityId: string) => {
    const community = communities.value.find((c) => c.id === communityId);
    if (!community) return;

    // Handle cancel pending request
    if (community.hasPendingRequest) {
      try {
        await cancelJoinRequest(communityId);
        // Update local state
        community.hasPendingRequest = false;
      } catch (err: any) {
        throw err;
      }
      return;
    }

    const previousJoinedState = community.joined;
    const previousMemberCount = community.memberCount;
    const previousPendingState = community.hasPendingRequest;

    try {
      if (community.joined) {
        // Leave community
        await leaveCommunity(communityId);
        community.joined = false;
        community.memberCount -= 1;
        community.role = undefined;
      } else {
        // Try to join community
        try {
          const result = await joinCommunity(communityId);
          // Update with server response
          const index = communities.value.findIndex((c) => c.id === communityId);
          if (index !== -1) {
            communities.value[index] = result.community;
          }
        } catch (err: any) {
          // Check if community requires approval
          if (err.message && err.message.includes('requires approval')) {
            // Create join request instead
            await createJoinRequest(communityId, { message: '' });
            // Update local state to show pending request
            community.hasPendingRequest = true;
          } else {
            throw err;
          }
        }
      }
    } catch (err: any) {
      // Revert optimistic update on error
      community.joined = previousJoinedState;
      community.memberCount = previousMemberCount;
      community.hasPendingRequest = previousPendingState;
      throw err;
    }
  };

  const updateCommunityInList = (updatedCommunity: SafeCommunity) => {
    const index = communities.value.findIndex((c) => c.id === updatedCommunity.id);
    if (index !== -1) {
      communities.value[index] = updatedCommunity;
    }
  };

  const removeCommunityFromList = (communityId: string) => {
    communities.value = communities.value.filter((c) => c.id !== communityId);
  };

  return {
    communities,
    filteredCommunities,
    loading,
    error,
    hasMore,
    isEmpty,
    selectedCategoryId,
    searchQuery,
    fetchCommunities,
    loadMore,
    refresh,
    setCategory,
    setSearch,
    setFounderId,
    toggleJoin,
    updateCommunityInList,
    removeCommunityFromList,
  };
};
