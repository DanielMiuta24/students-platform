import { ref, computed } from 'vue';
import { getCommunityById, joinCommunity, leaveCommunity, updateCommunity, deleteCommunity, createJoinRequest, cancelJoinRequest } from '../api/community';
import type { SafeCommunity } from '../types/community';
import { useSessionStore } from '../store/session';

export const useCommunity = (communityId: string) => {
  const session = useSessionStore();

  const community = ref<SafeCommunity | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

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

      const result = await getCommunityById(communityId);
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

    console.log('toggleJoin called with community:', {
      name: community.value.name,
      requiresApproval: community.value.requiresApproval,
      joined: community.value.joined,
      hasPendingRequest: community.value.hasPendingRequest
    });

    // Handle cancel pending request
    if (community.value.hasPendingRequest) {
      try {
        console.log('Canceling pending request...');
        await cancelJoinRequest(communityId);
        // Update local state
        community.value.hasPendingRequest = false;
        console.log('Pending request canceled');
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
        console.log('Leaving community...');

        await leaveCommunity(communityId);

        // Update state after successful leave
        community.value.joined = false;
        community.value.memberCount -= 1;
        community.value.role = undefined;
        console.log('Successfully left community');
      } else if (community.value.requiresApproval) {
        // Community requires approval - create a join request
        console.log('Creating join request (requires approval)...');
        await createJoinRequest(communityId, { message: '' });

        // Update to show pending request status
        community.value.hasPendingRequest = true;
        community.value.joined = false;
        console.log('Join request created, hasPendingRequest:', community.value.hasPendingRequest);
      } else {
        // Community doesn't require approval - join directly
        console.log('Joining directly (no approval required)...');

        const result = await joinCommunity(communityId);
        community.value = result.community;
        console.log('Successfully joined community');
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
      const result = await updateCommunity(communityId, formData);
      community.value = result.community;
      return result;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteCommunityData = async () => {
    try {
      const result = await deleteCommunity(communityId);
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
