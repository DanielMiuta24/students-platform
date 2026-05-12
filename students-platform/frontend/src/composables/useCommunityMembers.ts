import { ref, computed, type Ref } from 'vue';
import { getCommunityMembers, removeMember, banUser, unbanUser, updateMemberRole } from '../api/community';
import type { CommunityMember, CommunityMembersResult, UpdateMemberRolePayload } from '../types/community';

export const useCommunityMembers = (communityIdOrSlug: string | Ref<string>) => {
  const members = ref<CommunityMember[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref<string>('');

  // Convert to ref if it's a plain string
  const communityIdOrSlugRef = typeof communityIdOrSlug === 'string'
    ? ref(communityIdOrSlug)
    : communityIdOrSlug;

  const isEmpty = computed(() => {
    return !loading.value && members.value.length === 0;
  });

  const filteredMembers = computed(() => {
    if (!searchQuery.value) {
      return members.value;
    }

    const query = searchQuery.value.toLowerCase();
    return members.value.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.username.toLowerCase().includes(query)
    );
  });

  const fetchMembers = async () => {
    try {
      loading.value = true;
      error.value = null;

      const result: CommunityMembersResult = await getCommunityMembers(communityIdOrSlugRef.value);
      members.value = result.members;
      total.value = result.total;
    } catch (err: any) {
      error.value = err.message || 'Failed to load members';
    } finally {
      loading.value = false;
    }
  };

  const refresh = async () => {
    await fetchMembers();
  };

  const setSearch = (query: string) => {
    searchQuery.value = query;
  };

  const removeMemberFromList = async (memberId: string) => {
    try {
      await removeMember(communityIdOrSlugRef.value, memberId);
      members.value = members.value.filter((m) => m.id !== memberId);
      total.value = Math.max(0, total.value - 1);
    } catch (err: any) {
      throw err;
    }
  };

  const banMember = async (memberId: string) => {
    try {
      await banUser(communityIdOrSlugRef.value, memberId);
      members.value = members.value.filter((m) => m.id !== memberId);
      total.value = Math.max(0, total.value - 1);
    } catch (err: any) {
      throw err;
    }
  };

  const unbanMember = async (memberId: string) => {
    try {
      await unbanUser(communityIdOrSlugRef.value, memberId);
      // Optionally refresh to show the unbanned user
      await refresh();
    } catch (err: any) {
      throw err;
    }
  };

  const updateRole = async (memberId: string, role: 'admin' | 'member') => {
    try {
      const payload: UpdateMemberRolePayload = { role };
      await updateMemberRole(communityIdOrSlugRef.value, memberId, payload);

      // Update the member's role in the list
      const member = members.value.find((m) => m.id === memberId);
      if (member) {
        member.role = role;
      }
    } catch (err: any) {
      throw err;
    }
  };

  return {
    members,
    filteredMembers,
    total,
    loading,
    error,
    isEmpty,
    searchQuery,
    fetchMembers,
    refresh,
    setSearch,
    removeMemberFromList,
    banMember,
    unbanMember,
    updateRole,
  };
};
