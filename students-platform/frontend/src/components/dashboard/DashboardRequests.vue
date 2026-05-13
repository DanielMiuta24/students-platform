<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-8">Requests</h2>

    <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
      <svg class="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p v-if="successMessage.startsWith('ownership-transfer:')" class="text-green-800 font-semibold">
        You are now the owner of
        <button
          @click="$router.push(`/community/${successMessage.split(':')[2]}`)"
          class="underline hover:text-green-900 font-bold"
        >
          {{ successMessage.split(':')[1] }}
        </button>!
      </p>
      <p v-else class="text-green-800 font-semibold">{{ successMessage }}</p>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading requests...</p>
    </div>

    <div v-else class="space-y-6">
      <div class="border-l-4 border-blue-600 pl-6 py-4">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Community Join Requests</h3>
        <div v-if="joinRequestsToMyCommunities.length === 0" class="empty-state-small">
          <p class="text-gray-600">No pending join requests</p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="request in joinRequestsToMyCommunities"
            :key="request.id"
            class="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-gray-900">{{ request.user?.name || 'Unknown User' }}</p>
                <p class="text-sm text-gray-600">wants to join {{ request.communityName }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ new Date(request.createdAt).toLocaleDateString() }}</p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="$emit('approve-join', request)"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Approve
                </button>
                <button
                  @click="$emit('reject-join', request)"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="border-l-4 border-green-600 pl-6 py-4">
        <h3 class="text-xl font-bold text-gray-900 mb-4">My Join Requests</h3>
        <div v-if="myJoinRequests.length === 0" class="empty-state-small">
          <p class="text-gray-600">No pending requests to join communities</p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="community in myJoinRequests"
            :key="community.id"
            class="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-gray-900">{{ community.name }}</p>
                <p class="text-sm text-gray-600">Request pending approval</p>
              </div>
              <button
                @click="$emit('cancel-join', community)"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="border-l-4 border-indigo-600 pl-6 py-4">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Community Invitations</h3>
        <div v-if="myInvitations.length === 0" class="empty-state-small">
          <p class="text-gray-600">No pending invitations</p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="invitation in myInvitations"
            :key="invitation.id"
            class="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-gray-900">{{ invitation.communityName }}</p>
                <p class="text-sm text-gray-600">Invited to join this community</p>
                <p class="text-xs text-gray-500 mt-1">{{ new Date(invitation.createdAt).toLocaleDateString() }}</p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="$emit('accept-invitation', invitation)"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Accept
                </button>
                <button
                  @click="$emit('decline-invitation', invitation)"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="border-l-4 border-purple-600 pl-6 py-4">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Ownership Transfer Requests</h3>
        <div v-if="ownershipTransferRequests.length === 0" class="empty-state-small">
          <p class="text-gray-600">No ownership transfer requests</p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="transfer in ownershipTransferRequests"
            :key="transfer.id"
            class="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-gray-900">{{ transfer.community?.name || 'Unknown Community' }}</p>
                <p class="text-sm text-gray-600">from {{ transfer.currentOwner?.name || 'Unknown' }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ new Date(transfer.createdAt).toLocaleDateString() }}</p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="$emit('accept-transfer', transfer)"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Accept
                </button>
                <button
                  @click="$emit('reject-transfer', transfer)"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../../services/api';

interface Props {
  successMessage?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'approve-join', request: any): void;
  (e: 'reject-join', request: any): void;
  (e: 'cancel-join', community: any): void;
  (e: 'accept-invitation', invitation: any): void;
  (e: 'decline-invitation', invitation: any): void;
  (e: 'accept-transfer', transfer: any): void;
  (e: 'reject-transfer', transfer: any): void;
}>();

const joinRequestsToMyCommunities = ref<any[]>([]);
const myJoinRequests = ref<any[]>([]);
const myInvitations = ref<any[]>([]);
const ownershipTransferRequests = ref<any[]>([]);
const isLoading = ref(false);

onMounted(() => {
  fetchRequests();
});

const fetchRequests = async () => {
  isLoading.value = true;
  try {
    const communities = await api.get('communities?limit=1000');
    const myCommunities = communities.data.communities.filter((c: any) =>
      c.role === 'admin' || c.role === 'founder'
    );

    const allJoinRequests: any[] = [];
    for (const community of myCommunities) {
      try {
        const { getJoinRequests } = await import('../../api/community');
        const result = await getJoinRequests(community.id);
        const requests = result.requests.map((req: any) => ({
          ...req,
          communityName: community.name,
          communitySlug: community.slug
        }));
        allJoinRequests.push(...requests);
      } catch (err) {
        console.error(`Failed to fetch join requests for community ${community.id}:`, err);
      }
    }
    joinRequestsToMyCommunities.value = allJoinRequests;

    try {
      const { getMyInvitations } = await import('../../api/community');
      const invitations = await getMyInvitations();
      myInvitations.value = invitations.map((inv: any) => ({
        ...inv,
        communityName: inv.community?.name,
        communitySlug: inv.community?.slug,
        communityId: inv.community?.id
      }));
    } catch (err) {
      console.error('Failed to fetch invitations:', err);
      myInvitations.value = [];
    }

    const myCommunitiesWithRequests = communities.data.communities.filter((c: any) => c.hasPendingRequest);
    myJoinRequests.value = myCommunitiesWithRequests;

    try {
      const { getMyOwnershipTransferRequests } = await import('../../api/community');
      const transfers = await getMyOwnershipTransferRequests();
      ownershipTransferRequests.value = transfers || [];
    } catch (err) {
      console.error('Failed to fetch ownership transfers:', err);
      ownershipTransferRequests.value = [];
    }
  } catch (error) {
    console.error('Failed to fetch requests:', error);
  } finally {
    isLoading.value = false;
  }
};

defineExpose({
  fetchRequests
});
</script>

<style scoped>
.empty-state-small {
  text-align: center;
  padding: 32px 24px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 1rem;
  border: 2px dashed #e5e7eb;
}
</style>
