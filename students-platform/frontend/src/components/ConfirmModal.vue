<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="onCancel">
      <div class="fixed inset-0 bg-white/30 backdrop-blur-sm transition-all"></div>

      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all"
          @click.stop
        >
          <div class="pt-8 px-6 text-center">
            <div
              class="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
              :class="iconBgClass"
            >
              <svg
                class="w-8 h-8"
                :class="iconColorClass"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="type === 'danger'"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <div class="px-6 py-6 text-center">
            <h3 class="text-2xl font-bold text-gray-900 mb-3">
              {{ title }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ message }}
            </p>
          </div>

          <div class="px-6 pb-6 flex gap-3">
            <button
              @click="onCancel"
              class="flex-1 px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {{ cancelText }}
            </button>
            <button
              @click="onConfirm"
              class="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors"
              :class="confirmButtonClass"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  show: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Are you sure?',
  message: 'This action cannot be undone.',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'danger',
});

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const onConfirm = () => emit('confirm');
const onCancel = () => emit('cancel');

const iconBgClass = computed(() => {
  const classes = {
    danger: 'bg-red-100',
    warning: 'bg-amber-100',
    info: 'bg-blue-100',
  };
  return classes[props.type];
});

const iconColorClass = computed(() => {
  const classes = {
    danger: 'text-red-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
  };
  return classes[props.type];
});

const confirmButtonClass = computed(() => {
  const classes = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  };
  return classes[props.type];
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
  opacity: 0;
}
</style>
