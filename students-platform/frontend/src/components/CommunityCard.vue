<template>
  <div
    class="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-100 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
  >
    <!-- Cover Image Section -->
    <div class="relative h-32 overflow-hidden">
      <!-- Background: Cover Image or Gradient -->
      <div
        v-if="community.coverImage"
        class="absolute inset-0"
      >
        <img
          :src="community.coverImage"
          :alt="`${community.name} cover`"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
      </div>

      <!-- Fallback Gradient when no cover image -->
      <div
        v-else
        class="absolute inset-0"
        style="background: linear-gradient(to right, #2563eb, #4f46e5, #0f2a5f);"
      >
        <div class="absolute inset-0 opacity-20">
          <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div class="absolute top-4 left-1/4 animate-float">
          <svg class="w-8 h-8 text-white/30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div class="absolute top-8 right-1/4 animate-float-delayed">
          <svg class="w-6 h-6 text-white/30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <div class="absolute bottom-4 left-1/3 animate-float">
          <svg class="w-5 h-5 text-white/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>

      <!-- Category Badge -->
      <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200 shadow-lg z-10">
        {{ getCategoryName(community.category) }}
      </span>
    </div>

    <!-- Content Section -->
    <div class="p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-2">
        {{ community.name }}
      </h3>

      <p class="text-gray-600 mb-4 leading-relaxed line-clamp-2">
        {{ community.description }}
      </p>

      <div class="flex items-center gap-2 text-sm text-gray-500 mb-5">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
        <span class="font-semibold">{{ community.memberCount.toLocaleString() }}</span> members
      </div>

      <div class="flex gap-3">
        <button
          @click="handleJoinToggle"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
          :disabled="isFounder"
          :class="['flex-1 font-bold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2', getButtonClass()]"
        >
          <svg v-if="hasPendingRequest && !isHovered" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ getButtonText() }}
        </button>

        <button
          @click="handleView"
          class="px-5 py-2.5 border-2 border-blue-300 text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all"
        >
          View
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { SafeCommunity } from '../types/community';

interface Props {
  community: SafeCommunity;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'toggle-join', community: SafeCommunity): void;
  (e: 'view', community: SafeCommunity): void;
}>();

const isHovered = ref(false);

const isFounder = computed(() => {
  return props.community.role === 'founder';
});

const hasPendingRequest = computed(() => {
  return props.community.hasPendingRequest === true;
});

const getInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};

const getCategoryName = (category: string | { id: string; name: string; slug: string } | undefined) => {
  if (!category) {
    return 'Uncategorized';
  }
  if (typeof category === 'string') {
    return category;
  }
  return category.name;
};

const getButtonText = () => {
  if (hasPendingRequest.value) {
    return isHovered.value ? 'Cancel Request' : 'Requested';
  }
  if (!props.community.joined) return 'Join';
  if (isFounder.value) return 'Joined';
  return isHovered.value ? 'Leave' : 'Joined';
};

const getButtonClass = () => {
  if (hasPendingRequest.value) {
    return isHovered.value
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-yellow-100 text-yellow-700';
  }
  if (!props.community.joined) {
    return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700';
  }
  if (isFounder.value) {
    return 'bg-blue-100 text-blue-700 cursor-not-allowed';
  }
  return isHovered.value
    ? 'bg-red-600 text-white hover:bg-red-700'
    : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
};

const handleJoinToggle = () => {
  if (!isFounder.value) {
    emit('toggle-join', props.community);
  }
};

const handleView = () => {
  emit('view', props.community);
};
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 4s ease-in-out infinite;
  animation-delay: 1s;
}
</style>
