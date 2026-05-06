<template>
  <article class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
    <div class="p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img
            :src="authorAvatar"
            :alt="authorName"
            @click="navigateToAuthorProfile"
            class="w-12 h-12 rounded-full object-cover border-2 border-blue-100 hover:border-blue-300 transition cursor-pointer"
          />

          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3
                @click="navigateToAuthorProfile"
                class="font-bold text-gray-900 text-base hover:text-blue-600 transition cursor-pointer"
              >
                {{ authorName }}
              </h3>

              <div v-if="isOwner" class="flex gap-1.5">
                <span
                  v-if="post.status === 'draft'"
                  class="text-xs font-semibold px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200"
                >
                  📝 Draft
                </span>
                <span
                  v-if="post.status === 'archived'"
                  class="text-xs font-semibold px-2 py-1 rounded-md bg-gray-50 text-gray-700 border border-gray-200"
                >
                  📦 Archived
                </span>
                <span
                  v-if="post.visibility === 'private'"
                  class="relative group text-xs font-semibold px-2 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 cursor-help inline-block"
                >
                  🔒 Private
                  <span class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-purple-50 text-purple-700 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-purple-200">
                    Only you are able to see this post
                    <span class="absolute right-full top-1/2 transform -translate-y-1/2 mr-0 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-purple-50"></span>
                  </span>
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span class="font-medium">{{ formatDate(post.createdAt) }}</span>
              <span>•</span>
              <span v-if="categoryName" class="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-200">
                {{ categoryName }}
              </span>
              <span v-if="categoryName">•</span>
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ post.viewCount }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="isOwner" class="relative">
          <button
            @click="toggleMenu"
            class="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all"
            title="Post options"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          <div
            v-if="showMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
          >
            <button
              @click="handleEdit"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Post
            </button>

            <button
              @click="handleDelete"
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Post
            </button>

            <button
              @click="handleChangeVisibility"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
            >
              <svg v-if="post.visibility === 'public'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Make {{ post.visibility === 'public' ? 'Private' : 'Public' }}
            </button>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {{ post.title }}
        </h4>

        <p class="text-gray-700 text-base leading-relaxed line-clamp-3">
          {{ contentPreview }}
        </p>
      </div>
    </div>

    <div v-if="post.images && post.images.length > 0" class="relative bg-gray-900">
      <div v-if="post.images.length === 1" class="w-full cursor-pointer" @click="viewPost">
        <img
          :src="post.images[0].url"
          :alt="post.images[0].alt || generateImageAlt(post.images[0].url)"
          class="w-full h-[500px] object-contain bg-black"
        />
      </div>

      <div v-else-if="post.images.length === 2" class="grid grid-cols-2 gap-1 cursor-pointer" @click="viewPost">
        <img
          v-for="(image, index) in post.images"
          :key="index"
          :src="image.url"
          :alt="image.alt || generateImageAlt(image.url)"
          class="w-full h-[400px] object-cover"
        />
      </div>

      <div v-else-if="post.images.length === 3" class="grid grid-cols-2 gap-1 cursor-pointer" @click="viewPost">
        <img
          :src="post.images[0].url"
          :alt="post.images[0].alt || generateImageAlt(post.images[0].url)"
          class="w-full h-[400px] object-cover col-span-2"
        />
        <img
          v-for="(image, index) in post.images.slice(1)"
          :key="index + 1"
          :src="image.url"
          :alt="image.alt || generateImageAlt(image.url)"
          class="w-full h-[300px] object-cover"
        />
      </div>
    </div>

    <div class="px-4 py-3 border-t border-gray-100">
      <div class="flex items-center gap-6 text-sm">
        <span class="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer transition">
          <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          <span class="font-semibold">{{ post.likeCount }}</span>
        </span>

        <span class="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span class="font-semibold">{{ post.commentCount }}</span>
        </span>
      </div>
    </div>

    <div class="px-4 py-2 flex items-center gap-2 border-t border-gray-100">
      <button
        @click="viewPost"
        class="flex-1 flex items-center justify-center gap-2 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-semibold text-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View Post
      </button>

      <button
        v-if="!isOwner"
        class="flex-1 flex items-center justify-center gap-2 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-semibold text-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </button>
    </div>

    <div v-if="actionError" class="px-4 pb-3 pt-0">
      <div class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
        {{ actionError }}
      </div>
    </div>

    <ConfirmModal
      :show="showDeleteModal"
      title="Delete Post?"
      message="This post will be permanently deleted. This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />

    <PostModal
      :show="showPostModal"
      :post="post"
      @close="showPostModal = false"
    />
  </article>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import type { SafePost } from '../types/post';
import { updatePost, deletePost, updatePostVisibility } from '../api/post';
import ConfirmModal from './ConfirmModal.vue';
import PostModal from './PostModal.vue';
import { generateImageAlt } from '../utils/imageAlt';
import { getAvatarUrl } from '../utils/avatar';

interface Props {
  post: SafePost;
  isOwner: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update', post: SafePost): void;
  (e: 'delete', postId: string): void;
}>();

const router = useRouter();
const actionLoading = ref(false);
const actionError = ref<string | null>(null);
const showMenu = ref(false);
const showDeleteModal = ref(false);
const showPostModal = ref(false);

import { useCategoryLookup } from '../composables/useCategoryLookup';
const { fetchCategories: loadCategories, getCategoryName } = useCategoryLookup();

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const closeMenuOnClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (showMenu.value && !target.closest('.relative')) {
    showMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeMenuOnClickOutside);
  loadCategories();
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenuOnClickOutside);
});

const authorName = computed(() => {
  const author = props.post.author;

  if (author && typeof author === 'object') {
    const authorObj = author as any;

    if (authorObj.name && typeof authorObj.name === 'string') {
      return authorObj.name;
    }
    if (authorObj.username && typeof authorObj.username === 'string') {
      return authorObj.username;
    }
  }

  if (typeof author === 'string') {
    return author;
  }

  return 'Unknown Author';
});

const authorAvatar = computed(() => {
  const author = props.post.author;

  if (author && typeof author === 'object') {
    const authorObj = author as any;
    return getAvatarUrl(authorName.value, authorObj.avatar);
  }

  return getAvatarUrl(authorName.value);
});

const authorUsername = computed(() => {
  const author = props.post.author;

  if (author && typeof author === 'object') {
    const authorObj = author as any;
    return authorObj.username || null;
  }

  return null;
});

const categoryName = computed(() => {
  if (!props.post.category) return null;

  if (typeof props.post.category === 'object' && props.post.category !== null) {
    const categoryObj = props.post.category as any;
    return categoryObj.name || null;
  }

  if (typeof props.post.category === 'string') {
    return getCategoryName(props.post.category);
  }

  return null;
});

const contentPreview = computed(() => {
  if (!props.post.content) return '';

  if (typeof props.post.content === 'string') {
    return props.post.content.length > 200
      ? props.post.content.substring(0, 200) + '...'
      : props.post.content;
  }

  try {
    const lexicalContent = props.post.content as any;
    if (lexicalContent.root && lexicalContent.root.children) {
      let text = '';
      const extractText = (node: any): void => {
        if (node.type === 'text' && node.text) {
          text += node.text + ' ';
        }
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach(extractText);
        }
      };
      lexicalContent.root.children.forEach(extractText);
      const trimmed = text.trim();
      return trimmed.length > 200 ? trimmed.substring(0, 200) + '...' : trimmed;
    }
  } catch (err) {
  }

  return 'No content available';
});

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const viewPost = () => {
  showPostModal.value = true;
};

const editPost = () => {
  router.push(`/posts/${props.post.id}/edit`);
};

const handleEdit = () => {
  showMenu.value = false;
  editPost();
};

const handleDelete = () => {
  showMenu.value = false;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  showDeleteModal.value = false;

  try {
    actionLoading.value = true;
    actionError.value = null;

    await deletePost(props.post.id);
    emit('delete', props.post.id);
  } catch (err: any) {
    actionError.value = err.message || 'Failed to delete post';
  } finally {
    actionLoading.value = false;
  }
};

const handleChangeVisibility = () => {
  showMenu.value = false;
  toggleVisibility();
};

const toggleVisibility = async () => {
  if (!props.isOwner) return;

  try {
    actionLoading.value = true;
    actionError.value = null;

    const newVisibility = props.post.visibility === 'public' ? 'private' : 'public';

    const updatedPost = await updatePostVisibility(props.post.id, newVisibility);
    emit('update', updatedPost);
  } catch (err: any) {
    actionError.value = err.message || 'Failed to update visibility';
  } finally {
    actionLoading.value = false;
  }
};

const navigateToAuthorProfile = () => {
  if (authorUsername.value) {
    router.push(`/profile/${authorUsername.value}`);
  }
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
