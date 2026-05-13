<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <div
          :class="[
            'relative bg-white rounded-2xl shadow-2xl w-full overflow-hidden transform transition-all',
            sizeClasses
          ]"
        >
          <!-- Header -->
          <div :class="['px-6 py-5', props.headerClass || variantClasses.header]">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div v-if="icon" :class="['w-12 h-12 rounded-full flex items-center justify-center', iconBgClass]">
                  <svg v-if="icon === 'edit'" class="w-6 h-6" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <svg v-else-if="icon === 'warning'" class="w-6 h-6" :class="iconColorClass" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else-if="icon === 'danger'" class="w-6 h-6" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <svg v-else class="w-6 h-6" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold" :class="titleColorClass">{{ title }}</h3>
                  <p v-if="subtitle" class="text-sm" :class="subtitleColorClass">{{ subtitle }}</p>
                </div>
              </div>
              <button
                v-if="closable"
                @click="handleClose"
                :class="['hover:bg-opacity-20 rounded-lg p-2 transition-colors', closeButtonClass]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div :class="['p-6', bodyClass, maxHeight ? 'overflow-y-auto' : '']" :style="maxHeight ? `max-height: ${maxHeight}` : ''">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" :class="['bg-gray-50 px-6 py-4 flex items-center justify-end gap-3', footerClass]">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: boolean;
  title: string;
  subtitle?: string;
  icon?: 'edit' | 'warning' | 'danger' | 'info';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  closeOnClickOutside?: boolean;
  maxHeight?: string;
  headerClass?: string;
  bodyClass?: string;
  footerClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  closable: true,
  closeOnClickOutside: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };
  return sizes[props.size];
});

const variantClasses = computed(() => {
  const variants = {
    default: {
      header: 'bg-gradient-to-r from-gray-600 to-gray-700',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      title: 'text-white',
      subtitle: 'text-gray-100',
      closeButton: 'text-white hover:bg-white',
    },
    primary: {
      header: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      title: 'text-white',
      subtitle: 'text-white/90',
      closeButton: 'text-white hover:bg-white',
    },
    success: {
      header: 'bg-gradient-to-r from-green-500 to-emerald-600',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      title: 'text-white',
      subtitle: 'text-green-100',
      closeButton: 'text-white hover:bg-white',
    },
    warning: {
      header: 'bg-gradient-to-r from-amber-500 to-orange-600',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      title: 'text-white',
      subtitle: 'text-amber-100',
      closeButton: 'text-white hover:bg-white',
    },
    danger: {
      header: 'bg-gradient-to-r from-red-500 to-red-600',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      title: 'text-white',
      subtitle: 'text-red-100',
      closeButton: 'text-white hover:bg-white',
    },
  };
  return variants[props.variant];
});

const iconBgClass = computed(() => variantClasses.value.iconBg);
const iconColorClass = computed(() => variantClasses.value.iconColor);
const titleColorClass = computed(() => variantClasses.value.title);
const subtitleColorClass = computed(() => variantClasses.value.subtitle);
const closeButtonClass = computed(() => variantClasses.value.closeButton);

const handleClose = () => {
  if (props.closeOnClickOutside || props.closable) {
    emit('update:modelValue', false);
    emit('close');
  }
};
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

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.modal-enter-from > div:last-child {
  transform: scale(0.9);
}

.modal-leave-to > div:last-child {
  transform: scale(0.9);
}
</style>
