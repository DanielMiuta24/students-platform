<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="handleClose"></div>

        <div
          class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all"
          @click.stop
        >
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              {{ title }}
            </h3>

            <p class="text-gray-600 mb-6">
              {{ message }}
            </p>

            <div v-if="showActions" class="flex gap-3">
              <button
                v-if="showSecondaryAction"
                @click="handleSecondaryAction"
                class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                {{ secondaryActionText }}
              </button>

              <button
                @click="handlePrimaryAction"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
              >
                {{ primaryActionText }}
              </button>
            </div>
          </div>

          <button
            v-if="showCloseButton"
            @click="handleClose"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue';

interface Props {
  isOpen: boolean;
  title?: string;
  message?: string;
  primaryActionText?: string;
  secondaryActionText?: string;
  showSecondaryAction?: boolean;
  showCloseButton?: boolean;
  showActions?: boolean;
  autoClose?: number;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Success!',
  message: 'Your action was completed successfully.',
  primaryActionText: 'Continue',
  secondaryActionText: 'Cancel',
  showSecondaryAction: false,
  showCloseButton: true,
  showActions: true,
  autoClose: 0,
});

const emit = defineEmits<{
  close: [];
  primaryAction: [];
  secondaryAction: [];
}>();

const handleClose = () => {
  emit('close');
};

const handlePrimaryAction = () => {
  emit('primaryAction');
  handleClose();
};

const handleSecondaryAction = () => {
  emit('secondaryAction');
  handleClose();
};

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';

    if (props.autoClose > 0) {
      setTimeout(() => {
        handleClose();
      }, props.autoClose);
    }
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
