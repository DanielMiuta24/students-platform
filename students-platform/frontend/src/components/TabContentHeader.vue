<template>
  <div class="relative h-32 sm:h-40 md:h-48 bg-gradient-to-r overflow-hidden" :style="gradientStyle">
    <div class="absolute inset-0 opacity-10">
      <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern :id="patternId" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
      </svg>
    </div>

    <div class="relative h-full flex items-center px-4 sm:px-6 md:px-8">
      <div class="flex items-center gap-3 sm:gap-4 md:gap-6">
        <div class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
          <component :is="iconComponent" v-if="iconComponent" class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-600" />
          <div v-else v-html="icon" class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-600"></div>
        </div>
        <div>
          <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{{ title }}</h2>
          <p class="text-xs sm:text-sm md:text-base text-blue-100">{{ subtitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  icon: string;
  title: string;
  subtitle: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientVia?: string;
  iconComponent?: any;
}

const props = withDefaults(defineProps<Props>(), {
  gradientFrom: '#3b82f6',
  gradientTo: '#6366f1',
  gradientVia: '#4f46e5',
});

const gradientStyle = computed(() => ({
  backgroundImage: props.gradientVia
    ? `linear-gradient(to right, ${props.gradientFrom}, ${props.gradientVia}, ${props.gradientTo})`
    : `linear-gradient(to right, ${props.gradientFrom}, ${props.gradientTo})`,
}));

const patternId = computed(() => `pattern-${Math.random().toString(36).substr(2, 9)}`);
</script>
