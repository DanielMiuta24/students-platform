<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" @click="handleClose"></div>

        <div
          :class="[
            'relative bg-white rounded-2xl shadow-2xl w-full overflow-hidden transform transition-all',
            sizeClasses
          ]"
        >
          <!-- Header -->
          <div :class="['px-6 py-5', headerClass]">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div v-if="icon" :class="['w-12 h-12 rounded-full flex items-center justify-center', iconBgClass]">
                  <component :is="icon" class="w-6 h-6" :class="iconColorClass" />
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
          <div v-if="$slots.footer" :class="['px-6 py-4 flex items-center justify-end gap-3', footerClass]">
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
  icon?: any;
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
      iconBg: 'bg-white bg-opacity-20',
      iconColor: 'text-white',
      title: 'text-white',
      subtitle: 'text-gray-100',
      closeButton: 'text-white hover:bg-white',
    },
    primary: {
      header: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      iconBg: 'bg-white bg-opacity-20',
      iconColor: 'text-white',
      title: 'text-white',
      subtitle: 'text-blue-100',
      closeButton: 'text-white hover:bg-white',
    },
    success: {
      header: 'bg-gradient-to-r from-green-500 to-emerald-600',
      iconBg: 'bg-white bg-opacity-20',
      iconColor: 'text-white',
      title: 'text-white',
      subtitle: 'text-green-100',
      closeButton: 'text-white hover:bg-white',
    },
    warning: {
      header: 'bg-gradient-to-r from-amber-500 to-orange-600',
      iconBg: 'bg-white bg-opacity-20',
      iconColor: 'text-white',
      title: 'text-white',
      subtitle: 'text-amber-100',
      closeButton: 'text-white hover:bg-white',
    },
    danger: {
      header: 'bg-gradient-to-r from-red-500 to-red-600',
      iconBg: 'bg-white bg-opacity-20',
      iconColor: 'text-white',
      title: 'text-white',
      subtitle: 'text-red-100',
      closeButton: 'text-white hover:bg-white',
    },
  };
  return variants[props.variant];
});

const iconBgClass = computed(() => props.headerClass || variantClasses.value.iconBg);
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
