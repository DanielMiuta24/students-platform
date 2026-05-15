<template>
  <div :class="vertical ? 'flex flex-col gap-2' : 'flex flex-wrap gap-3'">
    <button
      @click="selectCategory(null)"
      :class="[
        'px-4 py-2 rounded-full font-semibold transition',
        vertical ? 'w-full text-left' : '',
        selectedCategory === null
          ? 'bg-blue-600 text-white'
          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
      ]"
    >
      All
    </button>

    <button
      v-for="category in categories"
      :key="category.id"
      @click="selectCategory(category.id)"
      :class="[
        'px-4 py-2 rounded-full font-semibold transition',
        vertical ? 'w-full text-left' : '',
        selectedCategory === category.id
          ? 'bg-blue-600 text-white'
          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
      ]"
    >
      {{ category.name }}
    </button>

    <div v-if="loading" class="flex items-center gap-2 text-gray-500 text-sm">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      Loading categories...
    </div>

    <div v-if="error" class="text-red-600 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getActiveCategories } from '../api/category';
import type { Category } from '../types/category';

interface Props {
  vertical?: boolean;
}

withDefaults(defineProps<Props>(), {
  vertical: false
});

const emit = defineEmits<{
  (e: 'change', categoryId: string | null): void;
}>();

const categories = ref<Category[]>([]);
const selectedCategory = ref<string | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  await fetchCategories();
});

const fetchCategories = async () => {
  loading.value = true;
  error.value = null;

  try {
    categories.value = await getActiveCategories();
  } catch (err: any) {
    error.value = 'Failed to load categories';
  } finally {
    loading.value = false;
  }
};

const selectCategory = (categoryId: string | null) => {
  selectedCategory.value = categoryId;
  emit('change', categoryId);
};
</script>

<style scoped>
@media (max-width: 768px) {
  /* Make buttons slightly larger and more readable */
  button {
    padding: 0.625rem 1rem !important;
    font-size: 0.875rem;
    white-space: nowrap;
  }

  /* Center and add consistent spacing */
  .flex.flex-wrap {
    gap: 0.625rem !important;
    justify-content: center;
  }

  /* Loading and error text */
  .text-sm {
    font-size: 0.8125rem;
  }

  .h-4.w-4 {
    height: 0.875rem;
    width: 0.875rem;
  }
}

@media (max-width: 480px) {
  /* Keep text visible on small screens */
  button {
    padding: 0.5rem 0.875rem !important;
    font-size: 0.8125rem;
  }

  .flex.flex-wrap {
    gap: 0.5rem !important;
  }
}
</style>

