<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div
      v-for="(stat, index) in stats"
      :key="index"
      class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200"
    >
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <div v-html="stat.icon" class="w-5 h-5 text-white"></div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-600 font-medium">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-gray-900 truncate">{{ formatValue(stat.value) }}</p>
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
