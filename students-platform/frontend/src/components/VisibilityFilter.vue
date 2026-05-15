<template>
  <div class="visibility-filter">
    <button
      v-for="option in filterOptions"
      :key="option.value"
      @click="selectFilter(option.value)"
      :class="[
        'filter-button',
        selectedFilter === option.value ? 'filter-button-active' : 'filter-button-inactive'
      ]"
    >
      <component :is="option.icon" class="w-4 h-4" />
      <span>{{ option.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';

type VisibilityFilter = 'all' | 'public' | 'private' | 'friends';

interface FilterOption {
  value: VisibilityFilter;
  label: string;
  icon: any;
}

const emit = defineEmits<{
  change: [filter: VisibilityFilter];
}>();

const selectedFilter = ref<VisibilityFilter>('all');

const filterOptions: FilterOption[] = [
  {
    value: 'all',
    label: 'All',
    icon: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M4 6h16M4 12h16M4 18h16',
      }),
    ]),
  },
  {
    value: 'public',
    label: 'Public',
    icon: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      }),
    ]),
  },
  {
    value: 'private',
    label: 'Private',
    icon: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      }),
    ]),
  },
  {
    value: 'friends',
    label: 'Friends',
    icon: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      }),
    ]),
  },
];

const selectFilter = (filter: VisibilityFilter) => {
  selectedFilter.value = filter;
  emit('change', filter);
};
</script>

<style scoped>
.visibility-filter {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s;
  border: 2px solid transparent;
  cursor: pointer;
}

.filter-button-active {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.2);
}

.filter-button-inactive {
  background: white;
  color: #6b7280;
  border-color: #e5e7eb;
}

.filter-button-inactive:hover {
  background: #f9fafb;
  border-color: #3b82f6;
  color: #3b82f6;
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .visibility-filter {
    gap: 0.625rem;
    justify-content: center;
  }

  .filter-button {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    gap: 0.5rem;
  }

  .filter-button .w-4 {
    width: 1rem;
    height: 1rem;
  }
}

@media (max-width: 480px) {
  .visibility-filter {
    gap: 0.5rem;
  }

  .filter-button {
    padding: 0.5rem 0.875rem;
    font-size: 0.8125rem;
    gap: 0.375rem;
  }

  .filter-button .w-4 {
    width: 0.875rem;
    height: 0.875rem;
  }
}
</style>

