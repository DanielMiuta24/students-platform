<template>
  <Modal
    v-model="isOpen"
    title="Edit Community"
    subtitle="Update your community information"
    variant="primary"
    size="lg"
    max-height="70vh"
    :icon="EditIcon"
    @close="handleClose"
  >
    <div class="space-y-5">
      <!-- Success Message -->
      <div v-if="successMessage" class="p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
        <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-green-800 font-semibold">{{ successMessage }}</p>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Description
          <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="formData.description"
          rows="4"
          class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
          :class="validationErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'"
          placeholder="Describe your community..."
          @input="validateDescription"
        ></textarea>
        <div class="flex justify-between items-center mt-1">
          <p v-if="validationErrors.description" class="text-sm text-red-600 flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ validationErrors.description }}
          </p>
          <p class="text-sm text-gray-500 ml-auto">
            {{ formData.description.length }}/500
          </p>
        </div>
      </div>

      <!-- Visibility -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Visibility
          <span class="text-red-500">*</span>
        </label>
        <select
          v-model="formData.visibility"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="public">
            <span class="flex items-center gap-2">
              🌍 Public - Anyone can see and join
            </span>
          </option>
          <option value="private">
            <span class="flex items-center gap-2">
              🔒 Private - Only invited members can join
            </span>
          </option>
        </select>
        <p class="text-xs text-gray-500 mt-2 flex items-start gap-1">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <span>Private communities require admin approval for new members</span>
        </p>
      </div>

      <!-- Cover Image -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Cover Image
        </label>

        <!-- Current Image Preview -->
        <div v-if="currentCoverImage && !formData.removeCoverImage" class="mb-3 relative group">
          <img
            :src="currentCoverImage"
            alt="Current cover"
            class="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-xl flex items-center justify-center">
            <button
              @click="removeCoverImage"
              class="opacity-0 group-hover:opacity-100 transition-all bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove Image
            </button>
          </div>
        </div>

        <!-- New Image Preview -->
        <div v-if="formData.newCoverImagePreview" class="mb-3 relative group">
          <img
            :src="formData.newCoverImagePreview"
            alt="New cover preview"
            class="w-full h-48 object-cover rounded-xl border-2 border-blue-300"
          />
          <div class="absolute top-2 right-2">
            <span class="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">New Image</span>
          </div>
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-xl flex items-center justify-center">
            <button
              @click="clearNewImage"
              class="opacity-0 group-hover:opacity-100 transition-all bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel Upload
            </button>
          </div>
        </div>

        <!-- Upload Button -->
        <div v-if="!formData.newCoverImagePreview" class="relative">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            @change="handleCoverImageChange"
            class="hidden"
          />
          <button
            @click="fileInputRef?.click()"
            class="w-full px-4 py-3 border-2 border-dashed rounded-xl transition-all flex items-center justify-center gap-2 font-semibold"
            :class="validationErrors.coverImage
              ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
              : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formData.removeCoverImage ? 'Upload New Cover Image' : 'Change Cover Image' }}
          </button>
        </div>

        <p v-if="validationErrors.coverImage" class="text-sm text-red-600 mt-2 flex items-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          {{ validationErrors.coverImage }}
        </p>

        <p class="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          Recommended size: 1200x400px (Max 5MB, JPG/PNG)
        </p>
      </div>
    </div>

    <template #footer>
      <button
        @click="handleClose"
        class="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
      >
        Cancel
      </button>
      <button
        @click="handleSubmit"
        :disabled="isSubmitting || !isFormValid"
        :class="[
          'px-5 py-2.5 font-semibold rounded-xl transition-all flex items-center gap-2',
          isSubmitting || !isFormValid
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
        ]"
      >
        <svg v-if="isSubmitting" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ isSubmitting ? 'Updating...' : 'Update Community' }}</span>
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Modal from './Modal.vue';
import { updateCommunity } from '../api/community';
import type { SafeCommunity } from '../types/community';

const EditIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  `
};

interface Props {
  modelValue: boolean;
  community: SafeCommunity | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success', community: SafeCommunity): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const fileInputRef = ref<HTMLInputElement | null>(null);
const isSubmitting = ref(false);
const successMessage = ref('');

const formData = ref({
  description: '',
  visibility: 'public' as 'public' | 'private',
  newCoverImageFile: null as File | null,
  newCoverImagePreview: null as string | null,
  removeCoverImage: false,
});

const validationErrors = ref({
  description: '',
  coverImage: '',
});

const currentCoverImage = computed(() => {
  if (typeof props.community?.coverImage === 'string') {
    return props.community.coverImage;
  }
  return (props.community?.coverImage as any)?.url || null;
});

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.community) {
    formData.value.description = props.community.description || '';
    formData.value.visibility = props.community.visibility as 'public' | 'private';
    formData.value.newCoverImageFile = null;
    formData.value.newCoverImagePreview = null;
    formData.value.removeCoverImage = false;
    validationErrors.value = { description: '', coverImage: '' };
    successMessage.value = '';
  }
});

const validateDescription = () => {
  const desc = formData.value.description.trim();
  if (!desc) {
    validationErrors.value.description = 'Description is required';
    return false;
  }
  if (desc.length < 10) {
    validationErrors.value.description = 'Description must be at least 10 characters';
    return false;
  }
  if (desc.length > 500) {
    validationErrors.value.description = 'Description must not exceed 500 characters';
    return false;
  }
  validationErrors.value.description = '';
  return true;
};

const validateCoverImage = (file: File) => {
  const maxSize = 5 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (!allowedTypes.includes(file.type)) {
    validationErrors.value.coverImage = 'Only JPG and PNG images are allowed';
    return false;
  }

  if (file.size > maxSize) {
    validationErrors.value.coverImage = 'Image size must not exceed 5MB';
    return false;
  }

  validationErrors.value.coverImage = '';
  return true;
};

const isFormValid = computed(() => {
  return validateDescription() && !validationErrors.value.coverImage;
});

const handleCoverImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    if (!validateCoverImage(file)) {
      target.value = '';
      return;
    }

    formData.value.newCoverImageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.newCoverImagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const removeCoverImage = () => {
  formData.value.removeCoverImage = true;
  formData.value.newCoverImageFile = null;
  formData.value.newCoverImagePreview = null;
};

const clearNewImage = () => {
  formData.value.newCoverImageFile = null;
  formData.value.newCoverImagePreview = null;
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const handleClose = () => {
  emit('update:modelValue', false);
};

const handleSubmit = async () => {
  if (!isFormValid.value || !props.community) return;

  try {
    isSubmitting.value = true;
    const formDataToSend = new FormData();

    if (formData.value.description !== props.community.description) {
      formDataToSend.append('description', formData.value.description);
    }

    if (formData.value.visibility !== props.community.visibility) {
      formDataToSend.append('visibility', formData.value.visibility);
    }

    if (formData.value.removeCoverImage) {
      formDataToSend.append('coverImage', '');
    } else if (formData.value.newCoverImageFile) {
      formDataToSend.append('coverImage', formData.value.newCoverImageFile);
    }

    const result = await updateCommunity(props.community.id, formDataToSend);

    successMessage.value = 'Community updated successfully!';
    emit('success', result.community);

    setTimeout(() => {
      successMessage.value = '';
      handleClose();
    }, 2000);
  } catch (err: any) {
    alert(err.message || 'Failed to update community');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
