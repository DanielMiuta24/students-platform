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

    <div class="mb-6 border-b border-gray-200">
      <nav class="flex gap-4" aria-label="Request tabs">
        <button
          v-for="tab in requestTabs"
          :key="tab.id"
          @click="navigateToSubTab(tab.id)"
          :class="[
            'px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap',
            activeSubTab === tab.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
          ]"
        >
          {{ tab.label }}
          <span
            v-if="tab.count > 0"
            :class="[
              'ml-2 px-2 py-0.5 rounded-full text-xs font-semibold',
              activeSubTab === tab.id
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600'
            ]"
          >
            {{ tab.count }}
          </span>
        </button>
      </nav>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading requests...</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Incoming Requests -->
      <div v-if="activeSubTab === 'incoming'">
        <div class="space-y-8">
          <!-- Join Requests to My Communities -->
          <div>
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

          <!-- Received Invitations -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Community Invitations Received</h3>
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
                    <router-link
                      :to="`/community/${invitation.communitySlug}`"
                      class="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {{ invitation.communityName }}
                    </router-link>
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

          <!-- Received Ownership Transfer Requests -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Ownership Transfer Requests Received</h3>
            <div v-if="ownershipTransferRequests.length === 0" class="empty-state-small">
              <p class="text-gray-600">No pending ownership transfers</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="transfer in ownershipTransferRequests"
                :key="transfer.id"
                class="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <router-link
                      v-if="transfer.community?.slug"
                      :to="`/community/${transfer.community.slug}`"
                      class="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {{ transfer.community?.name || 'Unknown Community' }}
                    </router-link>
                    <p v-else class="font-semibold text-gray-900">{{ transfer.community?.name || 'Unknown Community' }}</p>
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

      <!-- Outgoing Requests -->
      <div v-if="activeSubTab === 'outgoing'">
        <div class="space-y-8">
          <!-- My Join Requests -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">My Join Requests</h3>
            <div v-if="myJoinRequests.length === 0" class="empty-state-small">
              <p class="text-gray-600">No pending join requests</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="community in myJoinRequests"
                :key="community.id"
                class="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <router-link
                      :to="`/community/${community.communitySlug}`"
                      class="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {{ community.name }}
                    </router-link>
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

          <!-- Sent Invitations -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Invitations Sent</h3>
            <div v-if="mySentInvitations.length === 0" class="empty-state-small">
              <p class="text-gray-600">No pending sent invitations</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="invitation in mySentInvitations"
                :key="invitation.id"
                class="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <img
                      :src="getAvatarUrl(invitation.recipientName || 'User', invitation.recipientAvatar)"
                      :alt="invitation.recipientName"
                      class="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p class="font-semibold text-gray-900">
                        {{ invitation.recipientName }}
                        <span v-if="invitation.recipientUsername" class="text-sm text-gray-500">
                          @{{ invitation.recipientUsername }}
                        </span>
                      </p>
                      <p class="text-sm text-gray-600">
                        Invited to
                        <router-link
                          :to="`/community/${invitation.communitySlug}`"
                          class="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {{ invitation.communityName }}
                        </router-link>
                      </p>
                      <p class="text-xs text-gray-500 mt-1">{{ new Date(invitation.createdAt).toLocaleDateString() }}</p>
                    </div>
                  </div>
                  <button
                    @click="$emit('cancel-sent-invitation', invitation)"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sent Ownership Transfer Requests -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">Ownership Transfers Sent</h3>
            <div v-if="sentOwnershipTransferRequests.length === 0" class="empty-state-small">
              <p class="text-gray-600">No pending ownership transfers</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="transfer in sentOwnershipTransferRequests"
                :key="transfer.id"
                class="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <img
                      :src="getAvatarUrl(transfer.newOwner?.name || 'User', transfer.newOwner?.avatar)"
                      :alt="transfer.newOwner?.name"
                      class="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p class="font-semibold text-gray-900">
                        {{ transfer.newOwner?.name }}
                        <span v-if="transfer.newOwner?.username" class="text-sm text-gray-500">
                          @{{ transfer.newOwner.username }}
                        </span>
                      </p>
                      <p class="text-sm text-gray-600">
                        Transfer ownership of
                        <router-link
                          v-if="transfer.community?.slug"
                          :to="`/community/${transfer.community.slug}`"
                          class="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {{ transfer.community?.name }}
                        </router-link>
                        <span v-else class="font-semibold text-gray-900">{{ transfer.community?.name }}</span>
                      </p>
                      <p class="text-xs text-gray-500 mt-1">{{ new Date(transfer.createdAt).toLocaleDateString() }}</p>
                    </div>
                  </div>
                  <button
                    @click="$emit('cancel-sent-transfer', transfer)"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { api } from '../../services/api';
import { getAvatarUrl } from '../../utils/avatar';

interface Props {
  successMessage?: string;
}

defineProps<Props>();

const router = useRouter();
const route = useRoute();

const emit = defineEmits<{
  (e: 'approve-join', request: any): void;
  (e: 'reject-join', request: any): void;
  (e: 'cancel-join', community: any): void;
  (e: 'accept-invitation', invitation: any): void;
  (e: 'decline-invitation', invitation: any): void;
  (e: 'cancel-sent-invitation', invitation: any): void;
  (e: 'accept-transfer', transfer: any): void;
  (e: 'reject-transfer', transfer: any): void;
  (e: 'cancel-sent-transfer', transfer: any): void;
}>();

const joinRequestsToMyCommunities = ref<any[]>([]);
const myJoinRequests = ref<any[]>([]);
const myInvitations = ref<any[]>([]);
const mySentInvitations = ref<any[]>([]);
const ownershipTransferRequests = ref<any[]>([]);
const sentOwnershipTransferRequests = ref<any[]>([]);
const isLoading = ref(false);

const activeSubTab = computed(() => {
  const path = route.path.split('/').pop();
  if (path === 'requests' || !['incoming', 'outgoing'].includes(path || '')) {
    return 'incoming';
  }
  return path;
});

const requestTabs = computed(() => [
  {
    id: 'incoming',
    label: 'Incoming',
    count: joinRequestsToMyCommunities.value.length + myInvitations.value.length + ownershipTransferRequests.value.length
  },
  {
    id: 'outgoing',
    label: 'Outgoing',
    count: myJoinRequests.value.length + mySentInvitations.value.length + sentOwnershipTransferRequests.value.length
  }
]);

const navigateToSubTab = (tabId: string) => {
  router.push(`/dashboard/requests/${tabId}`);
};

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

    try {
      const { getMySentInvitations } = await import('../../api/community');
      const sentInvitations = await getMySentInvitations();
      mySentInvitations.value = sentInvitations.map((inv: any) => ({
        ...inv,
        communityName: inv.community?.name,
        communitySlug: inv.community?.slug,
        communityId: inv.community?.id,
        recipientName: inv.recipientUser?.name || inv.recipientEmail,
        recipientUsername: inv.recipientUser?.username,
        recipientAvatar: inv.recipientUser?.avatar
      }));
    } catch (err) {
      console.error('Failed to fetch sent invitations:', err);
      mySentInvitations.value = [];
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

    try {
      const { getMySentOwnershipTransferRequests } = await import('../../api/community');
      const sentTransfers = await getMySentOwnershipTransferRequests();
      sentOwnershipTransferRequests.value = sentTransfers || [];
    } catch (err) {
      console.error('Failed to fetch sent ownership transfers:', err);
      sentOwnershipTransferRequests.value = [];
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
