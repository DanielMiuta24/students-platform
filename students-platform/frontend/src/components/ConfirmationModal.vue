<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="handleClose"></div>

    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden transform transition-all">
      <div
        class="relative h-32 bg-gradient-to-r overflow-hidden"
        :class="headerClasses"
      >
        <div class="absolute inset-0 opacity-20">
          <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="confirmation-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#confirmation-pattern)" />
          </svg>
        </div>

        <div class="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-lg"
            :class="iconBackgroundClasses"
          >
            <div v-html="icon" class="w-8 h-8" :class="iconColorClasses"></div>
          </div>
          <h3 class="text-2xl font-bold text-white">{{ title }}</h3>
          <p v-if="subtitle" class="text-sm text-white/90 mt-1">{{ subtitle }}</p>
        </div>
      </div>

      <div class="p-6">
        <p v-if="message" class="text-gray-700 text-center mb-4">{{ message }}</p>

        <div v-if="infoBox" class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
          <div class="flex items-start gap-3">
            <div v-html="infoBox.icon" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></div>
            <div class="flex-1">
              <h4 v-if="infoBox.title" class="font-semibold text-gray-900 mb-2">{{ infoBox.title }}</h4>
              <ul class="space-y-1.5">
                <li v-for="(item, index) in infoBox.items" :key="index" class="text-sm text-gray-700 flex items-start gap-2">
                  <span class="text-blue-600 mt-0.5">•</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            v-if="showCancel"
            @click="handleClose"
            class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            {{ cancelText }}
          </button>
          <button
            @click="handleConfirm"
            class="flex-1 px-6 py-3 font-semibold rounded-xl transition-colors shadow-lg"
            :class="confirmButtonClasses"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ModalVariant = 'warning' | 'success' | 'info' | 'danger';

interface InfoBox {
  icon: string;
  title?: string;
  items: string[];
}

interface Props {
  isOpen: boolean;
  variant?: ModalVariant;
  title: string;
  subtitle?: string;
  message?: string;
  infoBox?: InfoBox;
  confirmText: string;
  cancelText?: string;
  showCancel?: boolean;
  icon: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  cancelText: 'Cancel',
  showCancel: true,
});

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const headerClasses = computed(() => {
  const variants = {
    warning: 'from-amber-500 via-amber-600 to-orange-600',
    success: 'from-emerald-500 via-emerald-600 to-teal-600',
    info: 'from-blue-500 via-blue-600 to-indigo-600',
    danger: 'from-red-500 via-red-600 to-rose-600',
  };
  return variants[props.variant];
});

const iconBackgroundClasses = computed(() => {
  const variants = {
    warning: 'bg-amber-100',
    success: 'bg-emerald-100',
    info: 'bg-blue-100',
    danger: 'bg-red-100',
  };
  return variants[props.variant];
});

const iconColorClasses = computed(() => {
  const variants = {
    warning: 'text-amber-600',
    success: 'text-emerald-600',
    info: 'text-blue-600',
    danger: 'text-red-600',
  };
  return variants[props.variant];
});

const confirmButtonClasses = computed(() => {
  const variants = {
    warning: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white',
    info: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white',
  };
  return variants[props.variant];
});

const handleClose = () => emit('close');
const handleConfirm = () => emit('confirm');
</script>
