<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-bold text-gray-900">My Drafts</h2>
      <div class="text-sm text-gray-600">
        <span class="font-semibold text-gray-900">{{ drafts.length }}</span> draft{{ drafts.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
      <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <p class="text-green-800 font-medium">{{ successMessage }}</p>
    </div>

    <div v-if="isLoading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      <p class="mt-4 text-gray-600 font-medium">Loading drafts...</p>
    </div>

    <div v-else-if="drafts.length === 0" class="empty-state">
      <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
      <p class="text-xl font-bold text-gray-900 mb-2">No drafts yet</p>
      <p class="text-gray-600">Start creating posts and save them as drafts.</p>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="draft in drafts"
        :key="draft.id"
        class="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
      >
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-bold text-gray-900 text-lg mb-1">{{ draft.title }}</h3>
              <div class="flex items-center gap-3 text-xs text-gray-600">
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatDate(draft.updatedAt) }}
                </span>
                <span v-if="draft.community" class="flex items-center gap-1 text-purple-600 font-medium">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {{ typeof draft.community === 'string' ? draft.community : draft.community?.name }}
                </span>
              </div>
            </div>
            <span class="px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">DRAFT</span>
          </div>
        </div>

        <div class="px-6 py-3 bg-gray-50 flex items-center gap-2">
          <button
            @click="$emit('edit', draft)"
            class="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            @click="$emit('delete', draft)"
            class="flex items-center gap-1.5 px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../../services/api';

interface Props {
  successMessage?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'edit', draft: any): void;
  (e: 'delete', draft: any): void;
}>();

const drafts = ref<any[]>([]);
const isLoading = ref(false);

onMounted(() => {
  fetchDrafts();
});

const fetchDrafts = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('posts/my-drafts');
    drafts.value = response.data.drafts || [];
  } catch (error) {
    console.error('Failed to fetch drafts:', error);
    drafts.value = [];
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

defineExpose({
  fetchDrafts
});
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 64px 32px;
}
</style>
