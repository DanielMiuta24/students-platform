<template>
  <div class="feed-listing">
    <!-- Loading State -->
    <div v-if="postFeedStore.isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="text-gray-600 mt-4">Loading posts...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="postFeedStore.error" class="error-container">
      <div class="text-red-600 mb-4">
        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="font-semibold">{{ postFeedStore.error }}</p>
      </div>
      <button @click="handleRetry" class="btn-primary">
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="postFeedStore.isEmpty" class="empty-container">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        <p class="text-xl font-semibold">No posts yet</p>
        <p class="text-sm mt-2">Be the first to create a post!</p>
      </div>
    </div>

    <!-- Empty Filtered State -->
    <div v-else-if="postFeedStore.filteredPosts.length === 0" class="empty-container">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <p class="text-xl font-semibold">No posts found</p>
        <p class="text-sm mt-2">Try adjusting your filters to see more posts.</p>
      </div>
    </div>

    <!-- Posts List -->
    <div v-else class="posts-container">
      <TransitionGroup name="post-list" tag="div" class="space-y-6">
        <PostCard
          v-for="post in postFeedStore.filteredPosts"
          :key="post.id"
          :post="post"
          :is-owner="isOwner(post)"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </TransitionGroup>

      <!-- Load More Button / Infinite Scroll Trigger -->
      <div ref="loadMoreTrigger" class="load-more-container">
        <div v-if="postFeedStore.isLoadingMore" class="loading-more">
          <div class="loading-spinner-small"></div>
          <p class="text-gray-600 ml-3">Loading more posts...</p>
        </div>

        <button
          v-else-if="postFeedStore.hasMore"
          @click="handleLoadMore"
          class="btn-secondary w-full"
        >
          Load More Posts
        </button>

        <p v-else-if="postFeedStore.filteredPosts.length > 0" class="text-center text-gray-500 py-8">
          You've reached the end of the feed
        </p>
      </div>
    </div>

    <!-- Edit Post Modal -->
    <EditPostModal
      v-if="editingPost"
      :post="editingPost"
      @close="editingPost = null"
      @updated="handlePostUpdated"
    />

    <!-- Success Toast -->
    <Toast
      :show="showSuccessToast"
      title="Post deleted"
      message="Your post has been successfully deleted."
      type="success"
      @close="showSuccessToast = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { usePostFeedStore } from '../store/postFeed';
import { useSessionStore } from '../store/session';
import type { SafePost } from '../types/post';
import PostCard from './PostCard.vue';
import EditPostModal from './EditPostModal.vue';
import Toast from './Toast.vue';

const postFeedStore = usePostFeedStore();
const sessionStore = useSessionStore();
const loadMoreTrigger = ref<HTMLElement | null>(null);
const editingPost = ref<SafePost | null>(null);
const showSuccessToast = ref(false);
let observer: IntersectionObserver | null = null;

// Check if the current user owns a post
const isOwner = (post: SafePost): boolean => {
  if (!sessionStore.user) return false;

  const authorId = typeof post.author === 'object' && post.author !== null
    ? post.author.id
    : post.author;

  return sessionStore.user.id === authorId;
};

// Load initial posts on mount
onMounted(async () => {
  try {
    await postFeedStore.loadInitialPosts();
    setupInfiniteScroll();
  } catch (error) {
    console.error('Failed to load posts:', error);
  }
});

// Cleanup observer on unmount
onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

// Setup Intersection Observer for infinite scrolling
const setupInfiniteScroll = () => {
  if (!loadMoreTrigger.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && postFeedStore.hasMore && !postFeedStore.isLoadingMore) {
        handleLoadMore();
      }
    },
    {
      rootMargin: '200px', // Trigger 200px before reaching the element
    }
  );

  observer.observe(loadMoreTrigger.value);
};

const handleLoadMore = async () => {
  try {
    await postFeedStore.loadMorePosts();
  } catch (error) {
    console.error('Failed to load more posts:', error);
  }
};

const handleRetry = async () => {
  try {
    await postFeedStore.loadInitialPosts();
    setupInfiniteScroll();
  } catch (error) {
    console.error('Failed to retry loading posts:', error);
  }
};

const handleEdit = (post: SafePost) => {
  editingPost.value = post;
};

const handleDelete = async (postId: string) => {
  // PostCard already deleted from API, just remove from store and show success
  const index = postFeedStore.posts.findIndex(p => p.id === postId);
  if (index !== -1) {
    postFeedStore.posts.splice(index, 1);
  }

  // Show success toast
  showSuccessToast.value = true;
};

const handlePostUpdated = () => {
  editingPost.value = null;
};
</script>

<style scoped>
.feed-listing {
  max-width: 48rem;
  margin: 0 auto;
  padding: 1rem;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-spinner-small {
  width: 24px;
  height: 24px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.posts-container {
  display: flex;
  flex-direction: column;
}

.load-more-container {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: white;
  color: #3b82f6;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: 2px solid #3b82f6;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #eff6ff;
}

/* Transition animations */
.post-list-enter-active,
.post-list-leave-active {
  transition: all 0.3s ease;
}

.post-list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.post-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.post-list-move {
  transition: transform 0.3s ease;
}
</style>
