<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
    <section class="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <p class="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full mb-5">
            Student communities
          </p>

          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Find your study abroad circle.
          </h1>

          <p class="text-lg text-gray-600 leading-relaxed max-w-xl">
            Join focused communities based on countries, scholarships, study fields, and student life topics.
          </p>
        </div>

        <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <div class="community-hero-image"></div>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 mb-8">
      <div class="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100">
        <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div class="flex-1">
            <div class="relative">
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchInput"
                placeholder="Search communities, e.g. Germany, scholarships, nursing..."
                class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>
          <button
            @click="router.push('/community/create')"
            class="px-6 py-3 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
            style="background-color: #0f2a5f;"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Community
          </button>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside class="bg-white rounded-2xl shadow-xl p-6 h-fit border-2 border-blue-100">
          <h3 class="font-bold text-gray-900 mb-4 text-lg">Categories</h3>
          <CategoryFilter :vertical="true" @change="handleCategoryChange" />
        </aside>

        <main>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900">
              Communities
            </h2>

            <p class="text-sm text-gray-500 bg-white px-4 py-2 rounded-full border-2 border-gray-200">
              {{ filteredCommunities.length }} found
            </p>
          </div>

          <div v-if="loading" class="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-blue-100">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Loading communities...</h3>
          </div>

          <div v-else-if="error" class="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-red-100">
            <div class="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Failed to load communities</h3>
            <p class="text-gray-600 mb-4">{{ error }}</p>
            <button
              @click="refresh"
              class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>

          <div v-else-if="isEmpty" class="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-blue-100">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No communities yet</h3>
            <p class="text-gray-600 mb-4">Be the first to create a community!</p>
            <button
              @click="router.push('/community/create')"
              class="px-6 py-2 text-white font-semibold rounded-lg transition-all"
              style="background-color: #0f2a5f;"
            >
              Create Community
            </button>
          </div>

          <div v-else-if="filteredCommunities.length === 0" class="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-blue-100">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No communities found</h3>
            <p class="text-gray-600">Try adjusting your search or category filter</p>
          </div>

          <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CommunityCard
                v-for="community in filteredCommunities"
                :key="community.id"
                :community="community"
                @toggle-join="handleToggleJoin"
                @view="viewCommunity"
              />
            </div>

            <div v-if="hasMore" class="mt-8 text-center">
              <button
                @click="loadMore"
                :disabled="loading"
                class="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? 'Loading...' : 'Load More' }}
              </button>
            </div>
          </div>
        </main>
      </div>
    </section>

    <!-- Leave Confirmation Modal -->
    <ConfirmationModal
      :is-open="showLeaveConfirmation"
      variant="warning"
      title="Leave Community?"
      subtitle="This action cannot be undone"
      :message="`Are you sure you want to leave ${selectedCommunityToLeave?.name}?`"
      :info-box="{
        icon: '<svg fill=\'currentColor\' viewBox=\'0 0 20 20\'><path fill-rule=\'evenodd\' d=\'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\' clip-rule=\'evenodd\' /></svg>',
        title: 'You will lose access to:',
        items: [
          'Community posts and discussions',
          'Member connections and network',
          'Community events and updates'
        ]
      }"
      confirm-text="Leave Community"
      cancel-text="Cancel"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1\' /></svg>'"
      @close="cancelLeave"
      @confirm="confirmLeave"
    />

    <!-- Join Request Success Modal -->
    <ConfirmationModal
      :is-open="showJoinRequestSuccess"
      variant="info"
      title="Join Request Sent!"
      subtitle="Waiting for approval"
      :message="`Your request to join ${selectedJoinedCommunity?.name} has been sent to the community administrators.`"
      :info-box="{
        icon: '<svg fill=\'currentColor\' viewBox=\'0 0 20 20\'><path fill-rule=\'evenodd\' d=\'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\' clip-rule=\'evenodd\' /></svg>',
        title: 'What happens next?',
        items: [
          'Community admins will review your request',
          'You\'ll be notified when your request is approved',
          'You can cancel the request anytime'
        ]
      }"
      confirm-text="Got it"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showJoinRequestSuccess = false"
      @confirm="showJoinRequestSuccess = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import CategoryFilter from "../components/CategoryFilter.vue";
import CommunityCard from "../components/CommunityCard.vue";
import ConfirmationModal from "../components/ConfirmationModal.vue";
import { useCommunities } from "../composables/useCommunities";

const router = useRouter();

const searchInput = ref("");
const selectedCategory = ref<string | null>(null);
const showLeaveConfirmation = ref(false);
const selectedCommunityToLeave = ref<any>(null);
const showJoinRequestSuccess = ref(false);
const selectedJoinedCommunity = ref<any>(null);

const {
  communities,
  loading,
  error,
  hasMore,
  isEmpty,
  fetchCommunities,
  loadMore,
  refresh,
  setCategory,
  setSearch,
  toggleJoin,
} = useCommunities();

const filteredCommunities = computed(() => {
  if (!searchInput.value) {
    return communities.value;
  }

  const query = searchInput.value.toLowerCase();
  return communities.value.filter((community) => {
    const name = community.name.toLowerCase();
    const description = community.description?.toLowerCase() || '';
    const categoryName = typeof community.category === 'string'
      ? ''
      : community.category.name.toLowerCase();

    return name.includes(query) ||
           description.includes(query) ||
           categoryName.includes(query);
  });
});

const handleCategoryChange = (categoryId: string | null) => {
  selectedCategory.value = categoryId;
  setCategory(categoryId);
};

const handleToggleJoin = async (community: any) => {
  // Check if user is trying to leave the community
  if (community.joined && !community.hasPendingRequest) {
    // Show confirmation modal for leaving
    selectedCommunityToLeave.value = community;
    showLeaveConfirmation.value = true;
    return;
  }

  // For join or cancel request, proceed directly
  try {
    const wasNotMember = !community.joined && !community.hasPendingRequest;
    const requiresApproval = community.requiresApproval;

    await toggleJoin(community.id);

    // If community required approval and user just requested to join
    if (wasNotMember && requiresApproval) {
      selectedJoinedCommunity.value = community;
      showJoinRequestSuccess.value = true;
      setTimeout(() => {
        showJoinRequestSuccess.value = false;
      }, 3000);
    }
  } catch (err: any) {
    alert(err.message || 'Failed to join/leave community');
  }
};

const confirmLeave = async () => {
  if (!selectedCommunityToLeave.value) return;

  try {
    await toggleJoin(selectedCommunityToLeave.value.id);
    showLeaveConfirmation.value = false;
    selectedCommunityToLeave.value = null;
  } catch (err: any) {
    alert(err.message || 'Failed to leave community');
  }
};

const cancelLeave = () => {
  showLeaveConfirmation.value = false;
  selectedCommunityToLeave.value = null;
};

const viewCommunity = (community: any) => {
  console.log('viewCommunity called with:', community);
  console.log('slug:', community.slug);
  if (community.slug) {
    router.push(`/community/${community.slug}`);
  } else {
    console.error('Community has no slug:', community);
  }
};

// Debounce search input
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
watch(searchInput, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  // Use client-side filtering, so no need to call API
});

onMounted(() => {
  fetchCommunities(true);
});
</script>

<style scoped>
.community-hero-image {
  min-height: 280px;
  border-radius: 20px;
  background:
    linear-gradient(rgba(239, 246, 255, 0.15), rgba(239, 246, 255, 0.15)),
    url("../images/community-hero.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
