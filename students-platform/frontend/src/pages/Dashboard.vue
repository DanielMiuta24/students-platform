<template>
  <div>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      <!-- Mobile Menu Button -->
      <div class="lg:hidden fixed top-24 left-4 z-40">
        <button
          @click="toggleMobileSidebar"
          class="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/20 hover:bg-white transition-all"
          aria-label="Toggle menu"
        >
          <svg v-if="!isMobileSidebarOpen" class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Sidebar Overlay -->
      <Transition name="overlay">
        <div
          v-if="isMobileSidebarOpen"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          @click="closeMobileSidebar"
        />
      </Transition>

      <div class="px-4 sm:px-6 py-6 sm:py-8">
        <div class="flex gap-6">
          <!-- Sidebar -->
        <Transition name="sidebar">
          <aside
            v-show="isMobileSidebarOpen || !isMobile"
            :class="[
              'w-72 flex-shrink-0',
              'lg:block',
              isMobileSidebarOpen ? 'fixed left-0 top-0 bottom-0 z-50 pt-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 overflow-y-auto' : ''
            ]"
          >
            <!-- Mobile Close Button -->
            <button
              v-if="isMobileSidebarOpen"
              @click="closeMobileSidebar"
              class="lg:hidden absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 hover:bg-white transition-all"
              aria-label="Close menu"
            >
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden lg:sticky lg:top-20">
              <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div class="flex items-center gap-3">
                  <svg class="w-7 h-7 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
                  </svg>
                  <div>
                    <h2 class="text-2xl font-bold text-white">Dashboard</h2>
                    <p class="text-blue-100 text-sm mt-1">Manage your account</p>
                  </div>
                </div>
              </div>

              <nav class="p-4">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="navigateToTab(tab.id)"
                  :class="[
                    'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-medium transition-all mb-2',
                    currentTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transform scale-[1.02]'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  ]"
                >
                  <component :is="tab.icon" class="w-5 h-5 flex-shrink-0" />
                  <span>{{ tab.label }}</span>
                </button>
              </nav>
            </div>
          </aside>
        </Transition>

        <main class="flex-1 min-w-0 w-full">
          <DashboardGeneral
            v-if="currentTab === 'general'"
            :user="user"
            :saved-universities-count="savedUniversities.length"
            :communities-count="communitiesCount"
            :posts-count="postsCount"
          />

          <DashboardChangePassword v-else-if="currentTab === 'change-password'" />

          <DashboardStudentStatus v-else-if="currentTab === 'student-status'" />

          <DashboardSavedUniversities v-else-if="currentTab === 'saved-universities'" />

          <DashboardSavedScholarships v-else-if="currentTab === 'saved-scholarships'" />

          <DashboardDrafts
            v-else-if="currentTab === 'drafts'"
            ref="draftsRef"
            :success-message="deleteSuccessMessage"
            @edit="editDraft"
            @delete="deleteDraft"
          />

          <DashboardNotifications v-else-if="currentTab === 'notifications'" />

          <DashboardRequests
            v-else-if="currentTab === 'requests'"
            ref="requestsRef"
            :success-message="requestSuccessMessage"
            @approve-join="approveJoinRequest"
            @reject-join="rejectJoinRequest"
            @cancel-join="cancelMyJoinRequest"
            @accept-invitation="acceptInvitation"
            @decline-invitation="declineInvitation"
            @cancel-sent-invitation="cancelSentInvitation"
            @accept-transfer="acceptOwnershipTransfer"
            @reject-transfer="rejectOwnershipTransfer"
            @cancel-sent-transfer="cancelSentOwnershipTransfer"
          />
        </main>
      </div>
    </div>
    </div>

    <EditPostModal
      v-if="showEditPostModal && selectedPost"
      :post="selectedPost"
      :is-open="showEditPostModal"
      :is-community-post="!!selectedPost.community"
      @close="handleCloseEditModal"
      @updated="handlePostUpdated"
    />

    <ConfirmModal
      :show="showDeleteModal"
      title="Delete Draft"
      message="Are you sure you want to delete this draft? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDeleteDraft"
      @cancel="cancelDeleteDraft"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onBeforeUnmount, h, computed, watch } from 'vue';
import { api } from '../services/api';
import { deletePost } from '../api/post';
import { useRouter, useRoute } from 'vue-router';
import DashboardGeneral from '../components/dashboard/DashboardGeneral.vue';
import DashboardChangePassword from '../components/dashboard/DashboardChangePassword.vue';
import DashboardStudentStatus from '../components/dashboard/DashboardStudentStatus.vue';
import DashboardSavedUniversities from '../components/dashboard/DashboardSavedUniversities.vue';
import DashboardSavedScholarships from '../components/dashboard/DashboardSavedScholarships.vue';
import DashboardDrafts from '../components/dashboard/DashboardDrafts.vue';
import DashboardNotifications from '../components/dashboard/DashboardNotifications.vue';
import DashboardRequests from '../components/dashboard/DashboardRequests.vue';
import EditPostModal from '../components/EditPostModal.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const router = useRouter();
const route = useRoute();
const user = ref<any>(null);
const savedUniversities = ref<any[]>([]);
const communitiesCount = ref(0);
const postsCount = ref(0);
const showEditPostModal = ref(false);
const selectedPost = ref<any>(null);
const showDeleteModal = ref(false);
const draftToDelete = ref<any>(null);
const deleteSuccessMessage = ref('');
const requestSuccessMessage = ref('');
const draftsRef = ref<InstanceType<typeof DashboardDrafts> | null>(null);
const requestsRef = ref<InstanceType<typeof DashboardRequests> | null>(null);

// Mobile sidebar state
const isMobile = ref(false);
const isMobileSidebarOpen = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024; // lg breakpoint
};

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
  if (isMobileSidebarOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false;
  document.body.style.overflow = '';
};

// Watch for route changes and close mobile sidebar when navigating away
watch(() => route.path, (newPath, oldPath) => {
  // Close sidebar when route changes, especially when leaving dashboard
  if (isMobileSidebarOpen.value && newPath !== oldPath) {
    closeMobileSidebar();
  }
}, { immediate: false });

// Also watch for when we're navigating away from dashboard entirely
watch(() => route.path, (newPath) => {
  // If we're leaving the dashboard, ensure cleanup
  if (!newPath.startsWith('/dashboard')) {
    isMobileSidebarOpen.value = false;
    document.body.style.overflow = '';
  }
}, { immediate: true });

const currentTab = computed(() => {
  const pathParts = route.path.split('/').filter(p => p);
  // If we're in a requests subtab, return 'requests'
  if (pathParts.length >= 3 && pathParts[1] === 'requests') {
    return 'requests';
  }
  const lastPart = pathParts[pathParts.length - 1];
  return lastPart === 'dashboard' ? 'general' : lastPart;
});

const tabs = [
  {
    id: 'general',
    label: 'General',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
    ])
  },
  {
    id: 'change-password',
    label: 'Change Password',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' })
    ])
  },
  {
    id: 'student-status',
    label: 'Student Status',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' })
    ])
  },
  {
    id: 'saved-universities',
    label: 'Saved Universities',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' })
    ])
  },
  {
    id: 'saved-scholarships',
    label: 'Saved Scholarships',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ])
  },
  {
    id: 'drafts',
    label: 'Post Drafts',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' })
    ])
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' })
    ])
  },
  {
    id: 'requests',
    label: 'Requests',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' })
    ])
  }
];

onMounted(async () => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  await fetchUserProfile();
  // fetchSavedUniversitiesCount(); // TODO: Implement backend API
  fetchCommunitiesCount();
  fetchPostsCount();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  // Ensure body overflow is restored when leaving dashboard
  document.body.style.overflow = '';
  isMobileSidebarOpen.value = false;
});

// Also use onBeforeUnmount to cleanup even earlier
onBeforeUnmount(() => {
  document.body.style.overflow = '';
  isMobileSidebarOpen.value = false;
});

const navigateToTab = (tabId: string) => {
  router.push(`/dashboard/${tabId}`);
  if (isMobile.value) {
    closeMobileSidebar();
  }
};

const fetchUserProfile = async () => {
  try {
    const response = await api.get('users/get-profile');
    user.value = response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
  }
};

// TODO: Implement saved universities backend API
// const fetchSavedUniversitiesCount = async () => {
//   try {
//     const response = await api.get('users/my-saved-universities');
//     savedUniversities.value = response.data;
//   } catch (error) {
//     console.error('Failed to fetch saved universities:', error);
//   }
// };

const fetchCommunitiesCount = async () => {
  try {
    const response = await api.get('communities?limit=1000');
    const communities = response.data.communities || [];
    const joinedCount = communities.filter((c: any) => c.joined).length;
    communitiesCount.value = joinedCount;
  } catch (error) {
    console.error('Failed to fetch communities count:', error);
  }
};

const fetchPostsCount = async () => {
  try {
    const response = await api.get('posts/my-posts/count');
    postsCount.value = response.data.count || 0;
  } catch (error) {
    console.error('Failed to fetch posts count:', error);
  }
};

const editDraft = (draft: any) => {
  selectedPost.value = draft;
  showEditPostModal.value = true;
};

const handlePostUpdated = async (updatedPost?: any) => {
  showEditPostModal.value = false;
  const wasPublished = updatedPost && updatedPost.status !== 'draft';
  selectedPost.value = null;

  if (wasPublished) {
    deleteSuccessMessage.value = `Post "${updatedPost.title}" has been published successfully!`;
    setTimeout(() => {
      deleteSuccessMessage.value = '';
    }, 5000);
  }

  if (draftsRef.value) {
    draftsRef.value.fetchDrafts();
  }
};

const handleCloseEditModal = () => {
  showEditPostModal.value = false;
  selectedPost.value = null;
};

const deleteDraft = (draft: any) => {
  draftToDelete.value = draft;
  showDeleteModal.value = true;
};

const confirmDeleteDraft = async () => {
  if (!draftToDelete.value) return;

  try {
    await deletePost(draftToDelete.value.id);
    showDeleteModal.value = false;
    const deletedTitle = draftToDelete.value.title;
    draftToDelete.value = null;

    deleteSuccessMessage.value = `Draft "${deletedTitle}" has been successfully deleted.`;
    setTimeout(() => {
      deleteSuccessMessage.value = '';
    }, 5000);

    if (draftsRef.value) {
      draftsRef.value.fetchDrafts();
    }
  } catch (error: any) {
    console.error('Failed to delete draft:', error);
    alert(error.message || 'Failed to delete draft. Please try again.');
  }
};

const cancelDeleteDraft = () => {
  showDeleteModal.value = false;
  draftToDelete.value = null;
};

const approveJoinRequest = async (request: any) => {
  try {
    const { approveJoinRequest: approveAPI } = await import('../api/community');
    await approveAPI(request.community, request.id);
    requestSuccessMessage.value = `Approved ${request.user?.name || 'user'}'s request to join ${request.communityName}`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);

    if (requestsRef.value) {
      requestsRef.value.fetchRequests();
    }
  } catch (error: any) {
    alert(error.message || 'Failed to approve request');
  }
};

const rejectJoinRequest = async (request: any) => {
  try {
    const { rejectJoinRequest: rejectAPI } = await import('../api/community');
    await rejectAPI(request.community, request.id);
    requestSuccessMessage.value = `Rejected ${request.user?.name || 'user'}'s request to join ${request.communityName}`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);

    if (requestsRef.value) {
      requestsRef.value.fetchRequests();
    }
  } catch (error: any) {
    alert(error.message || 'Failed to reject request');
  }
};

const cancelMyJoinRequest = async (community: any) => {
  try {
    const { cancelJoinRequest } = await import('../api/community');
    await cancelJoinRequest(community.id);
    requestSuccessMessage.value = `Cancelled request to join ${community.name}`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);

    if (requestsRef.value) {
      requestsRef.value.fetchRequests();
    }
  } catch (error: any) {
    alert(error.message || 'Failed to cancel request');
  }
};

const acceptOwnershipTransfer = async (transfer: any) => {
  try {
    const { acceptOwnershipTransfer: acceptAPI } = await import('../api/community');
    await acceptAPI(transfer.id);
    requestSuccessMessage.value = `ownership-transfer:${transfer.community?.name}:${transfer.community?.slug}`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);

    if (requestsRef.value) {
      requestsRef.value.fetchRequests();
    }
  } catch (error: any) {
    alert(error.message || 'Failed to accept ownership transfer');
  }
};

const rejectOwnershipTransfer = async (transfer: any) => {
  try {
    const { rejectOwnershipTransfer: rejectAPI } = await import('../api/community');
    await rejectAPI(transfer.id);
    requestSuccessMessage.value = `Rejected ownership transfer for ${transfer.community?.name}`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);

    if (requestsRef.value) {
      requestsRef.value.fetchRequests();
    }
  } catch (error: any) {
    alert(error.message || 'Failed to reject ownership transfer');
  }
};

const acceptInvitation = async (invitation: any) => {
  try {
    const { acceptInvitation: acceptAPI } = await import('../api/community');
    await acceptAPI(invitation.id);
    requestSuccessMessage.value = `You have joined ${invitation.communityName}!`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);

    if (requestsRef.value) {
      requestsRef.value.fetchRequests();
    }
  } catch (error: any) {
    alert(error.message || 'Failed to accept invitation');
  }
};

const declineInvitation = async (invitation: any) => {
  try {
    const { cancelInvitation } = await import('../api/community');
    await cancelInvitation(invitation.communityId, invitation.id);
    requestSuccessMessage.value = `Declined invitation to ${invitation.communityName}`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);

    if (requestsRef.value) {
      requestsRef.value.fetchRequests();
    }
  } catch (error: any) {
    alert(error.message || 'Failed to decline invitation');
  }
};

const cancelSentInvitation = async (invitation: any) => {
  try {
    const { cancelInvitation } = await import('../api/community');
    await cancelInvitation(invitation.communityId, invitation.id);
    requestSuccessMessage.value = `Cancelled invitation to ${invitation.recipientName}`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);

    if (requestsRef.value) {
      requestsRef.value.fetchRequests();
    }
  } catch (error: any) {
    alert(error.message || 'Failed to cancel invitation');
  }
};

const cancelSentOwnershipTransfer = async (transfer: any) => {
  try {
    const { cancelOwnershipTransferById } = await import('../api/community');
    await cancelOwnershipTransferById(transfer.id);
    requestSuccessMessage.value = `Cancelled ownership transfer request for ${transfer.community?.name}`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);

    if (requestsRef.value) {
      requestsRef.value.fetchRequests();
    }
  } catch (error: any) {
    alert(error.message || 'Failed to cancel ownership transfer');
  }
};
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 64px 32px;
}

.empty-state-small {
  text-align: center;
  padding: 32px 24px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 1rem;
  border: 2px dashed #e5e7eb;
}

/* Mobile sidebar transitions */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease;
}

.sidebar-enter-from {
  transform: translateX(-100%);
}

.sidebar-leave-to {
  transform: translateX(-100%);
}

@media (min-width: 1024px) {
  .sidebar-enter-from,
  .sidebar-leave-to {
    transform: translateX(0);
  }
}

/* Overlay transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
