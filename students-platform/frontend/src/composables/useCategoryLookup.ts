import { ref, computed } from 'vue';
import { getActiveCategories } from '../api/category';
import type { Category } from '../types/category';

const categories = ref<Category[]>([]);
const loading = ref(false);
const loaded = ref(false);

export const useCategoryLookup = () => {
  const fetchCategories = async () => {
    if (loaded.value || loading.value) return;

    try {
      loading.value = true;
      categories.value = await getActiveCategories();
      loaded.value = true;
    } catch (error) {
      console.error('[useCategoryLookup] Failed to fetch categories:', error);
    } finally {
      loading.value = false;
    }
  };

  const getCategoryName = (categoryId: string | null | undefined): string | null => {
    if (!categoryId) return null;
    const category = categories.value.find(cat => cat.id === categoryId);
    return category?.name || null;
  };

  const categoryMap = computed(() => {
    const map = new Map<string, string>();
    categories.value.forEach(cat => {
      map.set(cat.id, cat.name);
    });
    return map;
  });

  return {
    categories,
    loading,
    loaded,
    fetchCategories,
    getCategoryName,
    categoryMap,
  };
};
