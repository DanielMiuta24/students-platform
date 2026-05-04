<template>
  <div class="image-upload-container">
    <label class="upload-label">
      Post Images (Optional - Max {{ maxImages }})
    </label>

    <!-- Upload Area -->
    <div
      class="upload-area"
      :class="{ 'drag-over': isDragging, 'has-error': error }"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        :disabled="images.length >= maxImages"
        @change="handleFileSelect"
        class="file-input"
      />

      <div class="upload-prompt">
        <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <p class="upload-text">
          <span class="upload-link">Click to upload</span> or drag and drop
        </p>
        <p class="upload-hint">
          PNG, JPG, WEBP or GIF (max {{ maxSizeMB }}MB each)
        </p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Image Previews -->
    <div v-if="images.length > 0" class="preview-container">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="preview-card"
      >
        <img :src="image.preview" :alt="image.alt || 'Preview'" class="preview-image" />

        <div class="preview-overlay">
          <button
            type="button"
            @click="removeImage(index)"
            class="remove-button"
            title="Remove image"
          >
            <svg class="remove-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="file-info">
          {{ formatFileSize(image.file.size) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, type PropType } from 'vue';

export interface ImageUpload {
  file: File;
  preview: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default defineComponent({
  name: 'ImageUpload',

  props: {
    modelValue: {
      type: Array as PropType<ImageUpload[]>,
      default: () => [],
    },
    maxImages: {
      type: Number,
      default: 3,
    },
    maxSizeMB: {
      type: Number,
      default: 5,
    },
  },

  emits: ['update:modelValue', 'error'],

  setup(props, { emit }) {
    const fileInput = ref<HTMLInputElement | null>(null);
    const images = ref<ImageUpload[]>([...props.modelValue]);
    const isDragging = ref(false);
    const error = ref('');

    const validateFile = (file: File): string | null => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return `Invalid file type: ${file.name}. Only JPG, PNG, WEBP, and GIF are allowed.`;
      }

      if (file.size > MAX_FILE_SIZE) {
        return `File too large: ${file.name}. Maximum size is ${props.maxSizeMB}MB.`;
      }

      if (images.value.length >= props.maxImages) {
        return `Maximum ${props.maxImages} images allowed.`;
      }

      return null;
    };

    const createPreview = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const addImage = async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        error.value = validationError;
        emit('error', validationError);
        return;
      }

      try {
        const preview = await createPreview(file);
        const imageUpload: ImageUpload = {
          file,
          preview,
        };

        images.value.push(imageUpload);
        emit('update:modelValue', images.value);
        error.value = '';
      } catch (err) {
        console.error('[ImageUpload] Failed to create preview:', err);
        error.value = 'Failed to process image';
        emit('error', 'Failed to process image');
      }
    };

    const handleFileSelect = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;

      if (!files || files.length === 0) return;

      for (let i = 0; i < files.length; i++) {
        if (images.value.length >= props.maxImages) {
          error.value = `Maximum ${props.maxImages} images allowed`;
          emit('error', error.value);
          break;
        }
        await addImage(files[i]);
      }

      // Reset input
      target.value = '';
    };

    const handleDrop = async (event: DragEvent) => {
      isDragging.value = false;
      const files = event.dataTransfer?.files;

      if (!files || files.length === 0) return;

      for (let i = 0; i < files.length; i++) {
        if (images.value.length >= props.maxImages) {
          error.value = `Maximum ${props.maxImages} images allowed`;
          emit('error', error.value);
          break;
        }
        await addImage(files[i]);
      }
    };

    const removeImage = (index: number) => {
      // Revoke preview URL to free memory
      URL.revokeObjectURL(images.value[index].preview);
      images.value.splice(index, 1);
      emit('update:modelValue', images.value);
      error.value = '';
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    // Watch for external changes (like form reset)
    watch(() => props.modelValue, (newValue) => {
      if (newValue.length === 0 && images.value.length > 0) {
        // Clear images when parent resets
        images.value.forEach(img => {
          if (img.preview.startsWith('blob:')) {
            URL.revokeObjectURL(img.preview);
          }
        });
        images.value = [];
        error.value = '';
      }
    });

    return {
      fileInput,
      images,
      isDragging,
      error,
      handleFileSelect,
      handleDrop,
      removeImage,
      formatFileSize,
    };
  },
});
</script>

<style scoped>
.image-upload-container {
  margin-bottom: 16px;
}

.upload-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.upload-area {
  position: relative;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  background: #f9fafb;
  transition: all 0.2s;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.upload-area.drag-over {
  border-color: #3b82f6;
  background: #dbeafe;
}

.upload-area.has-error {
  border-color: #ef4444;
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.file-input:disabled {
  cursor: not-allowed;
}

.upload-prompt {
  pointer-events: none;
}

.upload-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  color: #9ca3af;
}

.upload-text {
  font-size: 14px;
  color: #374151;
  margin-bottom: 4px;
}

.upload-link {
  color: #3b82f6;
  font-weight: 600;
}

.upload-hint {
  font-size: 12px;
  color: #6b7280;
}

.error-message {
  margin-top: 8px;
  font-size: 14px;
  color: #ef4444;
}

.preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.preview-card {
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.preview-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.preview-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
}

.remove-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(239, 68, 68, 0.9);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}

.remove-button:hover {
  background: rgba(220, 38, 38, 1);
}

.remove-icon {
  width: 18px;
  height: 18px;
  color: white;
}

.file-info {
  padding: 8px;
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  border-top: 1px solid #e5e7eb;
}
</style>
