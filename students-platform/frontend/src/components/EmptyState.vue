<template>
  <div class="text-center" :class="containerClasses">
    <div :class="iconContainerClasses">
      <div v-html="icon" :class="iconClasses"></div>
    </div>
    <span v-if="badge" class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-3">
      {{ badge }}
    </span>
    <h3 :class="titleClasses">{{ title }}</h3>
    <p :class="descriptionClasses">{{ description }}</p>
    <button
      v-if="actionText"
      @click="emit('action')"
      class="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 mx-auto"
    >
      <div v-if="actionIcon" v-html="actionIcon" class="w-5 h-5"></div>
      {{ actionText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type EmptyStateSize = 'sm' | 'md' | 'lg';

interface Props {
  icon: string;
  title: string;
  description: string;
  actionText?: string;
  actionIcon?: string;
  badge?: string;
  size?: EmptyStateSize;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const emit = defineEmits<{
  action: [];
}>();

const sizeConfig = computed(() => {
  const configs = {
    sm: {
      container: 'py-8',
      iconContainer: 'w-12 h-12 mb-3',
      icon: 'w-6 h-6',
      title: 'text-base',
      description: 'text-sm max-w-xs',
    },
    md: {
      container: 'py-12',
      iconContainer: 'w-16 h-16 mb-4',
      icon: 'w-8 h-8',
      title: 'text-lg',
      description: 'text-sm max-w-md',
    },
    lg: {
      container: 'py-16',
      iconContainer: 'w-20 h-20 mb-4',
      icon: 'w-10 h-10',
      title: 'text-xl',
      description: 'text-base max-w-lg',
    },
  };
  return configs[props.size];
});

const containerClasses = computed(() => sizeConfig.value.container);

const iconContainerClasses = computed(() => [
  sizeConfig.value.iconContainer,
  'bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto',
]);

const iconClasses = computed(() => [
  sizeConfig.value.icon,
  'text-blue-600',
]);

const titleClasses = computed(() => [
  sizeConfig.value.title,
  'font-bold text-gray-900 mb-2',
]);

const descriptionClasses = computed(() => [
  sizeConfig.value.description,
  'text-gray-600 mx-auto',
]);
</script>
