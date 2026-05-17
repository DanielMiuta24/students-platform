import { ref, computed, watch, type Ref } from 'vue';
import { getCommunityById, joinCommunity, leaveCommunity, updateCommunity, deleteCommunity, createJoinRequest, cancelJoinRequest } from '../api/community';
import type { SafeCommunity } from '../types/community';
import { useSessionStore } from '../store/session';

export const useCommunity = (communityIdOrSlug: string | Ref<string>) => {
  const session = useSessionStore();

  const community = ref<SafeCommunity | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Convert to ref if it's a plain string
  const communityIdOrSlugRef = typeof communityIdOrSlug === 'string'
    ? ref(communityIdOrSlug)
    : communityIdOrSlug;

  const isJoined = computed(() => community.value?.joined || false);
  const isMember = computed(() => community.value?.joined || false);
  const isAdmin = computed(() => community.value?.role === 'admin' || community.value?.role === 'founder');
  const isFounder = computed(() => community.value?.role === 'founder');
  const hasPendingRequest = computed(() => community.value?.hasPendingRequest || false);

  const canPost = computed(() => {
    if (!community.value) return false;
    if (isAdmin.value) return true;
    return community.value.allowMemberPosts && isMember.value;
  });

  const canInvite = computed(() => {
    if (!community.value) return false;
    if (isAdmin.value) return true;
    return community.value.allowMemberInvites && isMember.value;
  });

  const canManage = computed(() => isAdmin.value);

  const fetchCommunity = async () => {
    try {
      loading.value = true;
      error.value = null;

      const result = await getCommunityById(communityIdOrSlugRef.value);
      community.value = result.community;
    } catch (err: any) {
      error.value = err.message || 'Failed to load community';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const toggleJoin = async () => {
    if (!community.value) return;

    // Handle cancel pending request
    if (community.value.hasPendingRequest) {
      try {
        await cancelJoinRequest(community.value.id);
        // Update local state
        community.value.hasPendingRequest = false;
      } catch (err: any) {
        console.error('Error canceling request:', err);
        throw err;
      }
      return;
    }

    const previousJoinedState = community.value.joined;
    const previousMemberCount = community.value.memberCount;
    const previousRole = community.value.role;
    const previousPendingRequest = community.value.hasPendingRequest;

    try {
      if (community.value.joined) {
        // User is already a member - leave the community
        await leaveCommunity(community.value.id);

        // Update state after successful leave
        community.value.joined = false;
        community.value.memberCount -= 1;
        community.value.role = undefined;
      } else if (community.value.hasPendingInvitation) {
        // User has a pending invitation - join directly (bypass approval)
        const result = await joinCommunity(community.value.id);
        community.value = result.community;
      } else if (community.value.requiresApproval) {
        // Community requires approval - create a join request
        await createJoinRequest(community.value.id, { message: '' });

        // Update to show pending request status
        community.value.hasPendingRequest = true;
        community.value.joined = false;
      } else {
        // Community doesn't require approval - join directly
        const result = await joinCommunity(community.value.id);
        community.value = result.community;
      }
    } catch (err: any) {
      console.error('Error in toggleJoin:', err);
      // Revert optimistic update on error
      if (community.value) {
        community.value.joined = previousJoinedState;
        community.value.memberCount = previousMemberCount;
        community.value.role = previousRole;
        community.value.hasPendingRequest = previousPendingRequest;
      }
      throw err;
    }
  };

  const updateCommunityData = async (formData: FormData) => {
    try {
      if (!community.value?.id) {
        throw new Error('Community ID not available');
      }
      const result = await updateCommunity(community.value.id, formData);
      community.value = result.community;
      return result;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteCommunityData = async () => {
    try {
      if (!community.value?.id) {
        throw new Error('Community ID not available');
      }
      const result = await deleteCommunity(community.value.id);
      community.value = null;
      return result;
    } catch (err: any) {
      throw err;
    }
  };

  const incrementPostCount = () => {
    if (community.value) {
      community.value.postCount += 1;
    }
  };

  const decrementPostCount = () => {
    if (community.value && community.value.postCount > 0) {
      community.value.postCount -= 1;
    }
  };

  return {
    community,
    loading,
    error,
    isJoined,
    isMember,
    isAdmin,
    isFounder,
    hasPendingRequest,
    canPost,
    canInvite,
    canManage,
    fetchCommunity,
    toggleJoin,
    updateCommunityData,
    deleteCommunityData,
    incrementPostCount,
    decrementPostCount,
  };
};
