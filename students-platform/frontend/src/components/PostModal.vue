<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 bg-black bg-opacity-90"
        @click.self="closeModal"
      >
        <div
          class="relative w-full h-full bg-white flex flex-col"
          @click.stop
        >
          <button
            @click="closeModal"
            class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-full shadow-lg hover:bg-opacity-70 transition text-white"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="flex flex-col md:flex-row h-full">
            <div v-if="post.images && post.images.length > 0" class="md:w-3/5 bg-black flex items-center justify-center relative">
              <img
                :src="post.images[currentImageIndex].url"
                :alt="post.images[currentImageIndex].alt || generateImageAlt(post.images[currentImageIndex].url)"
                class="max-w-full max-h-full object-contain"
              />

              <div v-if="post.images.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <button
                  v-for="(_, index) in post.images"
                  :key="index"
                  @click="currentImageIndex = index"
                  :class="[
                    'w-2 h-2 rounded-full transition',
                    currentImageIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                  ]"
                ></button>
              </div>

              <button
                v-if="post.images.length > 1 && currentImageIndex > 0"
                @click="currentImageIndex--"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-lg hover:bg-white transition"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                v-if="post.images.length > 1 && currentImageIndex < post.images.length - 1"
                @click="currentImageIndex++"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-lg hover:bg-white transition"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div class="md:w-2/5 flex flex-col overflow-hidden bg-white">
              <div class="p-4 border-b border-gray-200">
                <div class="flex items-center gap-3">
                  <img
                    :src="authorAvatar"
                    :alt="authorName"
                    @click="navigateToAuthorProfile"
                    class="w-12 h-12 rounded-full object-cover border-2 border-blue-100 hover:border-blue-300 transition cursor-pointer"
                  />
                  <div>
                    <h3
                      @click="navigateToAuthorProfile"
                      class="font-bold text-gray-900 hover:text-blue-600 transition cursor-pointer"
                    >
                      {{ authorName }}
                    </h3>
                    <div class="flex items-center gap-2 text-xs text-gray-500">
                      <p>{{ formatDate(post.createdAt) }}</p>
                      <span v-if="categoryName">•</span>
                      <span v-if="categoryName" class="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-200">
                        {{ categoryName }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex-1 overflow-y-auto p-4">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ post.title }}</h2>
                <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed" v-html="formattedContent"></div>
              </div>

              <div class="border-t border-gray-200 p-4">
                <div class="flex items-center gap-6 mb-4 text-sm">
                  <span class="flex items-center gap-2 text-gray-600">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <span class="font-semibold">{{ post.likeCount }}</span>
                  </span>

                  <span class="flex items-center gap-2 text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span class="font-semibold">{{ post.commentCount }}</span>
                  </span>

                  <span class="flex items-center gap-2 text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span class="font-semibold">{{ post.viewCount }}</span>
                  </span>
                </div>

                <div class="flex gap-2">
                  <button class="flex-1 flex items-center justify-center gap-2 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition font-semibold text-sm">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    Like
                  </button>
                  <button class="flex-1 flex items-center justify-center gap-2 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition font-semibold text-sm">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { SafePost } from '../types/post';
import { generateImageAlt } from '../utils/imageAlt';
import { getAvatarUrl } from '../utils/avatar';
import { useCategoryLookup } from '../composables/useCategoryLookup';

interface Props {
  show: boolean;
  post: SafePost | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const router = useRouter();
const currentImageIndex = ref(0);

const { fetchCategories: loadCategories, getCategoryName } = useCategoryLookup();

onMounted(() => {
  loadCategories();
});

watch(() => props.show, (newVal) => {
  if (newVal) {
    currentImageIndex.value = 0;
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

const closeModal = () => {
  emit('close');
};

const authorName = computed(() => {
  if (!props.post) return 'Unknown Author';
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
  if (!props.post) return getAvatarUrl('User');
  const author = props.post.author;

  if (author && typeof author === 'object') {
    const authorObj = author as any;
    return getAvatarUrl(authorName.value, authorObj.avatar);
  }

  return getAvatarUrl(authorName.value);
});

const authorUsername = computed(() => {
  if (!props.post) return null;
  const author = props.post.author;

  if (author && typeof author === 'object') {
    const authorObj = author as any;
    return authorObj.username || null;
  }

  return null;
});

const categoryName = computed(() => {
  if (!props.post || !props.post.category) return null;

  if (typeof props.post.category === 'object' && props.post.category !== null) {
    const categoryObj = props.post.category as any;
    return categoryObj.name || null;
  }

  if (typeof props.post.category === 'string') {
    return getCategoryName(props.post.category);
  }

  return null;
});

const formattedContent = computed(() => {
  if (!props.post || !props.post.content) return '';

  if (typeof props.post.content === 'string') {
    return props.post.content.replace(/\n/g, '<br>');
  }

  try {
    const lexicalContent = props.post.content as any;
    if (lexicalContent.root && lexicalContent.root.children) {
      let html = '';
      const processNode = (node: any): string => {
        if (node.type === 'text' && node.text) {
          let text = node.text;
          if (node.format) {
            if (node.format & 1) text = `<strong>${text}</strong>`;
            if (node.format & 2) text = `<em>${text}</em>`;
            if (node.format & 4) text = `<u>${text}</u>`;
          }
          return text;
        }
        if (node.type === 'paragraph') {
          const content = node.children?.map(processNode).join('') || '';
          return `<p class="mb-3">${content}</p>`;
        }
        if (node.type === 'heading' && node.tag) {
          const content = node.children?.map(processNode).join('') || '';
          return `<${node.tag} class="font-bold mb-2">${content}</${node.tag}>`;
        }
        if (node.children && Array.isArray(node.children)) {
          return node.children.map(processNode).join('');
        }
        return '';
      };
      html = lexicalContent.root.children.map(processNode).join('');
      return html;
    }
  } catch (err) {
    console.error('Error parsing content:', err);
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

const navigateToAuthorProfile = () => {
  if (authorUsername.value) {
    router.push(`/profile/${authorUsername.value}`);
    emit('close');
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>
