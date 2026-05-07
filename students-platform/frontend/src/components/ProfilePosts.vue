<template>
  <section>
    <div class="bg-white rounded-t-2xl shadow-sm px-6 py-4 border-b border-gray-100">
      <h2 class="text-xl font-bold text-gray-900">
        {{ isOwner ? 'My Posts' : 'Posts' }}
      </h2>
    </div>

    <div v-if="loading && posts.length === 0" class="bg-white rounded-b-2xl shadow-sm">
      <div class="flex justify-center items-center py-16">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading posts...</p>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="bg-white rounded-b-2xl shadow-sm">
      <div class="text-center py-16 px-4">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-red-600 mb-4 font-medium">{{ error }}</p>
        <button
          @click="refresh"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition"
        >
          Try Again
        </button>
      </div>
    </div>

    <div v-else-if="posts.length === 0" class="bg-white rounded-b-2xl shadow-sm">
      <div class="text-center py-16 px-4">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ isOwner ? 'No posts yet' : 'No posts to show' }}
        </h3>
        <p class="text-gray-600 mb-6 max-w-sm mx-auto">
          {{ isOwner ? 'Share your first thought with the community.' : 'This user hasn\'t shared any posts yet.' }}
        </p>
        <button
          v-if="isOwner"
          @click="createPost"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition inline-flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Post
        </button>
      </div>
    </div>

    <div v-else class="space-y-4">
      <PostCard
        v-for="post in posts"
        :key="`post-${post.id}-${post.updatedAt}`"
        :post="post"
        :isOwner="isOwner"
        @update="handlePostUpdate"
        @delete="handlePostDelete"
      />

      <div v-if="hasMore" class="flex justify-center pt-2 pb-4">
        <button
          @click="loadMore"
          :disabled="loading"
          class="bg-white hover:bg-gray-50 text-gray-700 font-medium px-8 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-200"
        >
          <span v-if="loading" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
          <span v-else>Load More Posts</span>
        </button>
      </div>

      <div v-if="!hasMore && posts.length > 0" class="text-center py-6 text-gray-400 text-sm">
        You've reached the end
      </div>
    </div>

    <Toast
      :show="showToast"
      :title="toastTitle"
      :message="toastMessage"
      :type="toastType"
      @close="showToast = false"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProfilePosts } from '../composables/useProfilePosts';
import PostCard from './PostCard.vue';
import Toast from './Toast.vue';
import type { SafePost } from '../types/post';

interface Props {
  userId: string;
  categoryId?: string | null;
  visibilityFilter?: 'all' | 'public' | 'private' | 'friends';
  isFriend?: boolean;
}

const props = defineProps<Props>();
const router = useRouter();

const emit = defineEmits<{
  (e: 'focusCreatePost'): void;
}>();

const {
  posts,
  loading,
  error,
  hasMore,
  isOwner,
  fetchPosts,
  loadMore,
  refresh,
  updatePost,
  removePost,
  setCategory,
  setVisibility,
  setUserId,
  setIsFriend,
} = useProfilePosts(props.userId);

const showToast = ref(false);
const toastTitle = ref('');
const toastMessage = ref('');
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('success');

const showNotification = (
  title: string,
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'success'
) => {
  toastTitle.value = title;
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
};

onMounted(async () => {
  await fetchPosts(true);
});

watch(() => props.userId, async (newUserId) => {
  setUserId(newUserId);
  await fetchPosts(true);
});

watch(() => props.categoryId, (newCategoryId) => {
  setCategory(newCategoryId || null);
}, { immediate: true });

watch(() => props.visibilityFilter, (newVisibility) => {
  if (newVisibility) {
    setVisibility(newVisibility);
  }
}, { immediate: true });

watch(() => props.isFriend, (newIsFriend) => {
  setIsFriend(newIsFriend || false);
}, { immediate: true });

const handlePostUpdate = (updatedPost: SafePost) => {
  updatePost(updatedPost);
  showNotification('Post Updated', 'Your post has been updated successfully.');
  refresh();
};

const handlePostDelete = (postId: string) => {
  removePost(postId);
  showNotification('Post Deleted', 'Your post has been permanently deleted.');
  refresh();
};

const createPost = () => {
  emit('focusCreatePost');
};
</script>
