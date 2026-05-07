<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">Post Audience</h3>
        <button @click="handleClose" class="close-button">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <p class="modal-description">
          Who can see this post?
        </p>

        <div class="audience-options">
          <button
            v-for="option in visibilityOptions"
            :key="option.value"
            @click="selectVisibility(option.value)"
            :class="['audience-option', { 'audience-option-selected': selectedVisibility === option.value }]"
          >
            <div class="option-icon">
              <component :is="option.icon" class="w-6 h-6" />
            </div>
            <div class="option-content">
              <div class="option-title">{{ option.label }}</div>
              <div class="option-description">{{ option.description }}</div>
            </div>
            <div v-if="selectedVisibility === option.value" class="option-check">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="handleClose" class="btn btn-secondary">
          Cancel
        </button>
        <button @click="handleSave" class="btn btn-primary">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, h } from 'vue';

interface Props {
  show: boolean;
  currentVisibility: 'public' | 'private' | 'friends';
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  save: [visibility: 'public' | 'private' | 'friends'];
}>();

const selectedVisibility = ref<'public' | 'private' | 'friends'>(props.currentVisibility);

watch(() => props.currentVisibility, (newValue) => {
  selectedVisibility.value = newValue;
});

const visibilityOptions = [
  {
    value: 'public' as const,
    label: 'Public',
    description: 'Anyone can see this post',
    icon: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      }),
    ]),
  },
  {
    value: 'friends' as const,
    label: 'Friends',
    description: 'Only your friends can see this post',
    icon: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      }),
    ]),
  },
  {
    value: 'private' as const,
    label: 'Private',
    description: 'Only you can see this post',
    icon: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      }),
    ]),
  },
];

const selectVisibility = (visibility: 'public' | 'private' | 'friends') => {
  selectedVisibility.value = visibility;
};

const handleClose = () => {
  emit('close');
};

const handleSave = () => {
  emit('save', selectedVisibility.value);
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.close-button {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;
  border-radius: 6px;
}

.close-button:hover {
  color: #111827;
  background-color: #f3f4f6;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-description {
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 20px;
}

.audience-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.audience-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.audience-option:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.audience-option-selected {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.option-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 50%;
  color: #3b82f6;
}

.audience-option-selected .option-icon {
  background: #dbeafe;
  color: #2563eb;
}

.option-content {
  flex: 1;
}

.option-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.option-description {
  font-size: 14px;
  color: #6b7280;
}

.option-check {
  flex-shrink: 0;
  color: #3b82f6;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}
</style>
