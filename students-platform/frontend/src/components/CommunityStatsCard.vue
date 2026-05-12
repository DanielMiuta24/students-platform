<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="(stat, index) in stats"
      :key="index"
      class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200 hover:shadow-lg transition-shadow"
    >
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
          <div v-html="stat.icon" class="w-5 h-5 text-white"></div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-600 mb-1">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-gray-900 break-words">{{ formatValue(stat.value) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Stat {
  icon: string;
  label: string;
  value: string | number;
  iconColor?: string;
}

interface Props {
  stats: Stat[];
}

defineProps<Props>();

const formatValue = (value: string | number): string => {
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return value;
};
</script>
