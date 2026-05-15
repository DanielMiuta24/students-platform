<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
    <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Requests</h2>

    <div v-if="successMessage" class="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-2 sm:gap-3">
      <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p v-if="successMessage.startsWith('ownership-transfer:')" class="text-sm sm:text-base text-green-800 font-semibold">
        You are now the owner of
        <button
          @click="$router.push(`/community/${successMessage.split(':')[2]}`)"
          class="underline hover:text-green-900 font-bold"
        >
          {{ successMessage.split(':')[1] }}
        </button>!
      </p>
      <p v-else class="text-sm sm:text-base text-green-800 font-semibold">{{ successMessage }}</p>
    </div>

    <div class="mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto">
      <nav class="flex gap-2 sm:gap-4 min-w-max" aria-label="Request tabs">
        <button
          v-for="tab in requestTabs"
          :key="tab.id"
          @click="navigateToSubTab(tab.id)"
          :class="[
            'px-3 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap',
            activeSubTab === tab.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
          ]"
        >
          {{ tab.label }}
          <span
            v-if="tab.count > 0"
            :class="[
              'ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-semibold',
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
        <!-- Empty State for Entire Tab -->
        <div
          v-if="joinRequestsToMyCommunities.length === 0 && myInvitations.length === 0 && ownershipTransferRequests.length === 0"
          class="empty-state-small"
        >
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="text-gray-600 text-lg font-semibold">No incoming requests</p>
          <p class="text-gray-500 text-sm mt-2">You don't have any pending requests at the moment</p>
        </div>

        <div v-else class="space-y-8">
          <!-- Join Requests to My Communities -->
          <div v-if="joinRequestsToMyCommunities.length > 0">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Join Requests</h3>
            <div class="space-y-3">
              <div
                v-for="request in joinRequestsToMyCommunities"
                :key="request.id"
                class="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-center gap-4">
                  <!-- User Avatar -->
                  <router-link v-if="request.user?.username" :to="`/profile/${request.user.username}`" class="flex-shrink-0">
                    <img
                      :src="getAvatarUrl(request.user.name, request.user.avatar)"
                      :alt="request.user.name"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                  </router-link>
                  <div v-else class="flex-shrink-0">
                    <img
                      :src="getAvatarUrl('User')"
                      alt="User"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                  </div>

                  <!-- Request Info -->
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-700">
                      <router-link v-if="request.user?.username" :to="`/profile/${request.user.username}`" class="font-semibold text-gray-900 hover:text-blue-600">
                        {{ request.user.name }}
                      </router-link>
                      <span v-else class="font-semibold text-gray-900">{{ request.user?.name || 'Unknown User' }}</span>
                      <span> requested to join </span>
                      <router-link
                        :to="`/community/${request.communitySlug}`"
                        class="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {{ request.communityName }}
                      </router-link>
                    </p>
                    <p class="text-xs text-gray-500 mt-1">{{ new Date(request.createdAt).toLocaleDateString() }}</p>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-2 flex-shrink-0">
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
          <div v-if="myInvitations.length > 0">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Invitations</h3>
            <div class="space-y-3">
              <div
                v-for="invitation in myInvitations"
                :key="invitation.id"
                class="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-center gap-4">
                  <!-- Inviter Avatar -->
                  <router-link v-if="invitation.invitedByUsername" :to="`/profile/${invitation.invitedByUsername}`" class="flex-shrink-0">
                    <img
                      :src="getAvatarUrl(invitation.invitedByName, invitation.invitedByAvatar)"
                      :alt="invitation.invitedByName"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                  </router-link>
                  <div v-else class="flex-shrink-0">
                    <img
                      :src="getAvatarUrl(invitation.invitedByName || 'User')"
                      :alt="invitation.invitedByName"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                  </div>

                  <!-- Invitation Info -->
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-700">
                      <router-link v-if="invitation.invitedByUsername" :to="`/profile/${invitation.invitedByUsername}`" class="font-semibold text-gray-900 hover:text-blue-600">
                        {{ invitation.invitedByName }}
                      </router-link>
                      <span v-else class="font-semibold text-gray-900">{{ invitation.invitedByName || 'Someone' }}</span>
                      <span> invited you to join </span>
                      <router-link
                        :to="`/community/${invitation.communitySlug}`"
                        class="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {{ invitation.communityName }}
                      </router-link>
                    </p>
                    <p class="text-xs text-gray-500 mt-1">{{ new Date(invitation.createdAt).toLocaleDateString() }}</p>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-2 flex-shrink-0">
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
          <div v-if="ownershipTransferRequests.length > 0">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Ownership Transfers</h3>
            <div class="space-y-3">
              <div
                v-for="transfer in ownershipTransferRequests"
                :key="transfer.id"
                class="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-center gap-4">
                  <!-- Current Owner Avatar -->
                  <router-link v-if="transfer.currentOwner?.username" :to="`/profile/${transfer.currentOwner.username}`" class="flex-shrink-0">
                    <img
                      :src="getAvatarUrl(transfer.currentOwner.name, transfer.currentOwner.avatar)"
                      :alt="transfer.currentOwner.name"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                  </router-link>
                  <div v-else class="flex-shrink-0">
                    <img
                      :src="getAvatarUrl(transfer.currentOwner?.name || 'User')"
                      :alt="transfer.currentOwner?.name"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                  </div>

                  <!-- Transfer Info -->
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-700">
                      <router-link v-if="transfer.currentOwner?.username" :to="`/profile/${transfer.currentOwner.username}`" class="font-semibold text-gray-900 hover:text-blue-600">
                        {{ transfer.currentOwner.name }}
                      </router-link>
                      <span v-else class="font-semibold text-gray-900">{{ transfer.currentOwner?.name || 'Someone' }}</span>
                      <span> invited you to take over ownership of </span>
                      <router-link
                        v-if="transfer.community?.slug"
                        :to="`/community/${transfer.community.slug}`"
                        class="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {{ transfer.community?.name }}
                      </router-link>
                      <span v-else class="font-semibold text-gray-900">{{ transfer.community?.name }}</span>
                    </p>
                    <p class="text-xs text-gray-500 mt-1">{{ new Date(transfer.createdAt).toLocaleDateString() }}</p>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-2 flex-shrink-0">
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
        <!-- Empty State for Entire Tab -->
        <div
          v-if="myJoinRequests.length === 0 && mySentInvitations.length === 0 && sentOwnershipTransferRequests.length === 0"
          class="empty-state-small"
        >
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <p class="text-gray-600 text-lg font-semibold">No outgoing requests</p>
          <p class="text-gray-500 text-sm mt-2">You haven't sent any requests yet</p>
        </div>

        <div v-else class="space-y-8">
          <!-- My Join Requests -->
          <div v-if="myJoinRequests.length > 0">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Join Requests</h3>
            <div class="space-y-3">
              <div
                v-for="community in myJoinRequests"
                :key="community.id"
                class="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-center gap-4">
                  <!-- User's Own Avatar -->
                  <router-link v-if="session.user?.username" :to="`/profile/${session.user.username}`" class="flex-shrink-0">
                    <img
                      :src="getAvatarUrl(session.user.name, session.user.avatar)"
                      :alt="session.user.name"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                  </router-link>
                  <div v-else class="flex-shrink-0">
                    <img
                      :src="getAvatarUrl('User')"
                      alt="User"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                  </div>

                  <!-- Request Info -->
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-700">
                      <span>You requested to join </span>
                      <router-link
                        :to="`/community/${community.communitySlug}`"
                        class="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {{ community.name }}
                      </router-link>
                    </p>
                    <p class="text-xs text-gray-500 mt-1">Request pending approval</p>
                  </div>

                  <!-- Action Button -->
                  <button
                    @click="$emit('cancel-join', community)"
                    class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex-shrink-0"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sent Invitations -->
          <div v-if="mySentInvitations.length > 0">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Invitations</h3>
            <div class="space-y-3">
              <div
                v-for="invitation in mySentInvitations"
                :key="invitation.id"
                class="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-center gap-4">
                  <!-- Recipient Avatar -->
                  <router-link v-if="invitation.recipientUsername" :to="`/profile/${invitation.recipientUsername}`" class="flex-shrink-0">
                    <img
                      :src="getAvatarUrl(invitation.recipientName || 'User', invitation.recipientAvatar)"
                      :alt="invitation.recipientName"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                  </router-link>
                  <div v-else class="flex-shrink-0">
                    <img
                      :src="getAvatarUrl(invitation.recipientName || 'User')"
                      :alt="invitation.recipientName"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                  </div>

                  <!-- Invitation Info -->
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-700">
                      <span>You invited </span>
                      <router-link v-if="invitation.recipientUsername" :to="`/profile/${invitation.recipientUsername}`" class="font-semibold text-gray-900 hover:text-blue-600">
                        {{ invitation.recipientName }}
                      </router-link>
                      <span v-else class="font-semibold text-gray-900">{{ invitation.recipientName }}</span>
                      <span> to join </span>
                      <router-link
                        :to="`/community/${invitation.communitySlug}`"
                        class="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {{ invitation.communityName }}
                      </router-link>
                    </p>
                    <p class="text-xs text-gray-500 mt-1">{{ new Date(invitation.createdAt).toLocaleDateString() }}</p>
                  </div>

                  <!-- Action Button -->
                  <button
                    @click="$emit('cancel-sent-invitation', invitation)"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex-shrink-0"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sent Ownership Transfer Requests -->
          <div v-if="sentOwnershipTransferRequests.length > 0">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Ownership Transfers</h3>
            <div class="space-y-3">
              <div
                v-for="transfer in sentOwnershipTransferRequests"
                :key="transfer.id"
                class="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-center gap-4">
                  <!-- New Owner Avatar -->
                  <router-link v-if="transfer.newOwner?.username" :to="`/profile/${transfer.newOwner.username}`" class="flex-shrink-0">
                    <img
                      :src="getAvatarUrl(transfer.newOwner?.name || 'User', transfer.newOwner?.avatar)"
                      :alt="transfer.newOwner?.name"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                  </router-link>
                  <div v-else class="flex-shrink-0">
                    <img
                      :src="getAvatarUrl(transfer.newOwner?.name || 'User')"
                      :alt="transfer.newOwner?.name"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                  </div>

                  <!-- Transfer Info -->
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-700">
                      <span>You invited </span>
                      <router-link v-if="transfer.newOwner?.username" :to="`/profile/${transfer.newOwner.username}`" class="font-semibold text-gray-900 hover:text-blue-600">
                        {{ transfer.newOwner?.name }}
                      </router-link>
                      <span v-else class="font-semibold text-gray-900">{{ transfer.newOwner?.name }}</span>
                      <span> to take over ownership of </span>
                      <router-link
                        v-if="transfer.community?.slug"
                        :to="`/community/${transfer.community.slug}`"
                        class="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {{ transfer.community?.name }}
                      </router-link>
                      <span v-else class="font-semibold text-gray-900">{{ transfer.community?.name }}</span>
                    </p>
                    <p class="text-xs text-gray-500 mt-1">{{ new Date(transfer.createdAt).toLocaleDateString() }}</p>
                  </div>

                  <!-- Action Button -->
                  <button
                    @click="$emit('cancel-sent-transfer', transfer)"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex-shrink-0"
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
import { useSessionStore } from '../../store/session';

interface Props {
  successMessage?: string;
}

defineProps<Props>();

const router = useRouter();
const route = useRoute();
const session = useSessionStore();

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
        communityId: inv.community?.id,
        invitedByName: inv.invitedBy?.name,
        invitedByUsername: inv.invitedBy?.username,
        invitedByAvatar: inv.invitedBy?.avatar
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

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  /* Make request cards stack vertically on mobile */
  .bg-white.border.border-gray-200.rounded-lg.p-4 > div {
    flex-direction: column;
    gap: 0.75rem;
  }

  /* Adjust avatar size on mobile */
  .w-12.h-12 {
    width: 2.5rem;
    height: 2.5rem;
  }

  /* Make action buttons full width on mobile */
  .flex.gap-2.flex-shrink-0 {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  .flex.gap-2.flex-shrink-0 button {
    width: 100%;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  /* Adjust request info text */
  .text-sm.text-gray-700 {
    font-size: 0.8125rem;
  }

  /* Make the request items more compact */
  .bg-white.border.border-gray-200.rounded-lg {
    padding: 0.875rem;
  }

  /* Adjust spacing between sections */
  .space-y-8 > * + * {
    margin-top: 1.5rem;
  }

  .space-y-3 > * + * {
    margin-top: 0.625rem;
  }

  /* Adjust heading sizes */
  .text-xl {
    font-size: 1rem;
  }

  .text-2xl {
    font-size: 1.25rem;
  }

  /* Empty state adjustments */
  .empty-state-small {
    padding: 1.5rem 1rem;
  }

  .empty-state-small .w-16 {
    width: 3rem;
    height: 3rem;
  }

  .empty-state-small .text-lg {
    font-size: 1rem;
  }

  .empty-state-small .text-sm {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  /* Even more compact for very small screens */
  .bg-white.border.border-gray-200.rounded-lg {
    padding: 0.75rem;
  }

  .text-xs {
    font-size: 0.6875rem;
  }

  .px-4 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
}
</style>
