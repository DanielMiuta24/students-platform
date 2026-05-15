<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
    <div class="max-w-6xl mx-auto px-4 py-12 text-center">
      <p class="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full mb-5">
        Student Feed
      </p>

      <h1 class="text-5xl font-bold text-blue-900 mb-4">
        See what students are talking about
      </h1>

      <p class="text-xl text-gray-700 max-w-2xl mx-auto">
        Discover questions, experiences, tips, and updates from students around the world.
      </p>
    </div>

    <!-- Create Post -->
    <div class="max-w-6xl mx-auto px-4 mb-8">
      <CreatePostForm @success="handlePostSuccess" @error="handlePostError" />
    </div>

    <!-- Filters -->
    <div class="max-w-6xl mx-auto px-4 mb-10 space-y-4">
      <!-- Category Filter -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Filter by Category</h3>
        <CategoryFilter @change="handleCategoryChange" />
      </div>

      <!-- User Status Filter -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Filter by User Type</h3>
        <UserStatusFilter @change="handleStatusChange" />
      </div>
    </div>

    <!-- Feed Listing -->
    <div class="max-w-6xl mx-auto px-4 pb-16">
      <FeedListing />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import CreatePostForm from '../components/CreatePostForm.vue';
import CategoryFilter from '../components/CategoryFilter.vue';
import UserStatusFilter from '../components/UserStatusFilter.vue';
import FeedListing from '../components/FeedListing.vue';
import { usePostFeedStore } from '../store/postFeed';

type UserStatus = 'Student' | 'StudySeeker' | 'Admin' | null;

const postFeedStore = usePostFeedStore();

onMounted(async () => {
  // Feed will load automatically via FeedListing component
});

const handlePostSuccess = async (post: any) => {
  // Refresh the feed to show the new post
  await postFeedStore.refreshPosts();
};

const handlePostError = (error: any) => {
  console.error('[Feed] Post creation failed:', error);
};

const handleCategoryChange = async (categoryId: string | null) => {
  console.log('Category changed:', categoryId);
  // Filter feed by category
  await postFeedStore.filterByCategory(categoryId);
};

const handleStatusChange = (status: UserStatus) => {
  console.log('Status changed:', status);
  // Filter feed by user status (client-side filtering)
  postFeedStore.setStatus(status);
};
</script>

<style scoped>
@media (max-width: 768px) {
  .max-w-6xl.mx-auto.px-4.py-12 {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }

  .text-5xl {
    font-size: 2rem !important;
    line-height: 2.5rem !important;
  }

  .text-xl {
    font-size: 1rem !important;
    line-height: 1.5rem !important;
  }

  .inline-block.bg-blue-100 {
    font-size: 0.875rem !important;
    padding: 0.5rem 0.875rem !important;
  }

  .bg-white.rounded-xl.shadow-lg.p-6 {
    padding: 1rem !important;
  }

  .bg-white.rounded-xl.shadow-lg.p-6 h3 {
    font-size: 0.75rem !important;
    margin-bottom: 0.75rem !important;
  }

  .max-w-6xl.mx-auto.px-4 {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }

  .max-w-6xl.mx-auto.px-4.mb-8 {
    margin-bottom: 1.5rem !important;
  }

  .max-w-6xl.mx-auto.px-4.mb-10 {
    margin-bottom: 1.5rem !important;
  }

  .space-y-4 {
    gap: 1rem !important;
  }
}

@media (max-width: 480px) {
  .text-5xl {
    font-size: 1.75rem !important;
    line-height: 2.25rem !important;
  }

  .text-xl {
    font-size: 0.9375rem !important;
    line-height: 1.375rem !important;
  }

  .bg-white.rounded-xl.shadow-lg.p-6 {
    padding: 0.875rem !important;
    border-radius: 0.75rem !important;
  }
}
</style>
