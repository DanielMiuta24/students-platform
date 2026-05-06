<template>
  <Transition name="toast">
    <div v-if="show" class="fixed top-4 right-4 z-50 max-w-md">
      <div
        class="bg-white rounded-lg shadow-xl border-l-4 p-4 flex items-start gap-3"
        :class="borderColorClass"
      >
        <div class="flex-shrink-0">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="iconBgClass"
          >
            <svg
              class="w-5 h-5"
              :class="iconColorClass"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="type === 'success'"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
              <path
                v-else-if="type === 'error'"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
              <path
                v-else-if="type === 'warning'"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900">{{ title }}</p>
          <p v-if="message" class="text-sm text-gray-600 mt-1">{{ message }}</p>
        </div>

        <button
          @click="close"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue';

interface Props {
  show: boolean;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success',
  duration: 3000,
});

const emit = defineEmits<{ (e: 'close'): void }>();

const timer = ref<ReturnType<typeof setTimeout> | null>(null);

const close = () => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
  emit('close');
};

watch(() => props.show, (newShow) => {
  if (newShow && props.duration > 0) {
    timer.value = setTimeout(close, props.duration);
  }
});

const borderColorClass = computed(() => {
  const classes = {
    success: 'border-green-500',
    error: 'border-red-500',
    warning: 'border-amber-500',
    info: 'border-blue-500',
  };
  return classes[props.type];
});

const iconBgClass = computed(() => {
  const classes = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    warning: 'bg-amber-100',
    info: 'bg-blue-100',
  };
  return classes[props.type];
});

const iconColorClass = computed(() => {
  const classes = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
  };
  return classes[props.type];
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
