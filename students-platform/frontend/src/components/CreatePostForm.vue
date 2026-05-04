<template>
  <div class="bg-white rounded-xl shadow-lg p-8">
    <h2 class="text-2xl font-bold text-blue-900 mb-5">Create a Post</h2>

    <!-- Success Message -->
    <div v-if="successMessage" class="success-banner">
      <svg class="success-icon" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      {{ successMessage }}
    </div>

    <!-- Error Message -->
    <div v-if="generalError" class="error-banner">
      <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      {{ generalError }}
    </div>

    <form @submit.prevent="handlePublish">
      <!-- Title Field -->
      <div class="form-field">
        <label for="title" class="field-label">
          Title <span class="required">*</span>
        </label>
        <input
          id="title"
          v-model="postTitle"
          type="text"
          placeholder="Enter a compelling title for your post"
          class="form-input"
          :class="{ 'input-error': errors.title }"
          :maxlength="POST_VALIDATION.TITLE_MAX_LENGTH"
          @blur="validateTitle"
        />
        <div v-if="errors.title" class="field-error">{{ errors.title }}</div>
        <div class="field-hint">
          {{ postTitle.length }} / {{ POST_VALIDATION.TITLE_MAX_LENGTH }} characters
        </div>
      </div>

      <!-- Rich Text Content -->
      <div class="form-field">
        <label for="content" class="field-label">
          Content <span class="required">*</span>
        </label>
        <RichTextEditor
          v-model="postContent"
          placeholder="Share your thoughts, questions, or experiences..."
          :max-length="POST_VALIDATION.CONTENT_MAX_LENGTH"
          :error="errors.content"
          @change="validateContent"
        />
      </div>

      <!-- Category Field -->
      <div class="form-field">
        <label for="category" class="field-label">
          Category <span class="required">*</span>
        </label>
        <select
          id="category"
          v-model="postCategory"
          class="form-input"
          :class="{ 'input-error': errors.category }"
          :disabled="loadingCategories"
          @change="validateCategory"
        >
          <option value="">
            {{ loadingCategories ? 'Loading categories...' : 'Choose a category' }}
          </option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <div v-if="errors.category || categoryError" class="field-error">
          {{ errors.category || categoryError }}
        </div>
      </div>

      <!-- Image Upload -->
      <div class="form-field">
        <ImageUpload
          v-model="postImages"
          :max-images="POST_VALIDATION.MAX_IMAGES"
          @error="handleImageError"
        />
        <div v-if="errors.images" class="field-error">{{ errors.images }}</div>
      </div>

      <!-- Visibility Field -->
      <div class="form-field">
        <label for="visibility" class="field-label">
          Visibility
        </label>
        <select
          id="visibility"
          v-model="postVisibility"
          class="form-input"
        >
          <option value="public">Public - Everyone can see</option>
          <option value="private">Private - Only you can see</option>
        </select>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button
          type="button"
          @click="handleSaveDraft"
          class="btn btn-secondary"
          :disabled="isSubmitting"
        >
          <span v-if="isDraftSaving" class="btn-spinner"></span>
          {{ isDraftSaving ? 'Saving Draft...' : 'Save as Draft' }}
        </button>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isSubmitting"
        >
          <span v-if="isPublishing" class="btn-spinner"></span>
          {{ isPublishing ? 'Publishing...' : 'Publish Post' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import RichTextEditor from './RichTextEditor.vue';
import ImageUpload, { type ImageUpload as ImageUploadType } from './ImageUpload.vue';
import { createPost } from '../api/post';
import { getActiveCategories } from '../api/category';
import type { Category } from '../types/category';
import type { LexicalEditorState } from '../types/lexical';
import { POST_VALIDATION, POST_STATUS, POST_VISIBILITY } from '../types/post';

interface FormErrors {
  title: string;
  content: string;
  category: string;
  images: string;
}

export default defineComponent({
  name: 'CreatePostForm',

  components: {
    RichTextEditor,
    ImageUpload,
  },

  emits: ['success', 'error'],

  setup(_, { emit }) {
    // Form fields
    const postTitle = ref('');
    const postContent = ref<LexicalEditorState | null>(null);
    const postCategory = ref('');
    const postImages = ref<ImageUploadType[]>([]);
    const postVisibility = ref<'public' | 'private'>('public');

    // Categories
    const categories = ref<Category[]>([]);
    const loadingCategories = ref(false);
    const categoryError = ref('');

    // Validation
    const errors = ref<FormErrors>({
      title: '',
      content: '',
      category: '',
      images: '',
    });

    // UI State
    const isSubmitting = ref(false);
    const isPublishing = ref(false);
    const isDraftSaving = ref(false);
    const generalError = ref('');
    const successMessage = ref('');

    // Fetch categories on mount
    onMounted(async () => {
      await fetchCategories();
    });

    const fetchCategories = async () => {
      loadingCategories.value = true;
      categoryError.value = '';

      try {
        console.log('[CreatePostForm] Fetching categories...');
        categories.value = await getActiveCategories();
        console.log('[CreatePostForm] Categories loaded:', categories.value.length);
      } catch (error: any) {
        console.error('[CreatePostForm] Failed to load categories:', error);
        categoryError.value = 'Failed to load categories. Please refresh the page.';
      } finally {
        loadingCategories.value = false;
      }
    };

    const validateTitle = (): boolean => {
      errors.value.title = '';

      if (!postTitle.value.trim()) {
        errors.value.title = 'Title is required';
        return false;
      }

      if (postTitle.value.trim().length < POST_VALIDATION.TITLE_MIN_LENGTH) {
        errors.value.title = `Title must be at least ${POST_VALIDATION.TITLE_MIN_LENGTH} characters`;
        return false;
      }

      if (postTitle.value.length > POST_VALIDATION.TITLE_MAX_LENGTH) {
        errors.value.title = `Title must not exceed ${POST_VALIDATION.TITLE_MAX_LENGTH} characters`;
        return false;
      }

      return true;
    };

    const validateContent = (): boolean => {
      errors.value.content = '';

      if (!postContent.value) {
        errors.value.content = 'Content is required';
        return false;
      }

      // Get text content length from Lexical state
      const textContent = getTextFromLexicalState(postContent.value);

      if (textContent.trim().length === 0) {
        errors.value.content = 'Content is required';
        return false;
      }

      if (textContent.length > POST_VALIDATION.CONTENT_MAX_LENGTH) {
        errors.value.content = `Content must not exceed ${POST_VALIDATION.CONTENT_MAX_LENGTH} characters`;
        return false;
      }

      return true;
    };

    const validateCategory = (): boolean => {
      errors.value.category = '';

      if (!postCategory.value) {
        errors.value.category = 'Category is required';
        return false;
      }

      return true;
    };

    const validateForm = (): boolean => {
      const isTitleValid = validateTitle();
      const isContentValid = validateContent();
      const isCategoryValid = validateCategory();

      return isTitleValid && isContentValid && isCategoryValid;
    };

    const getTextFromLexicalState = (state: LexicalEditorState): string => {
      // Extract text content from Lexical state
      const extractText = (node: any): string => {
        if (node.type === 'text') {
          return node.text || '';
        }
        if (node.children && Array.isArray(node.children)) {
          return node.children.map(extractText).join('');
        }
        return '';
      };

      return extractText(state.root);
    };

    const buildFormData = (status: 'draft' | 'published'): FormData => {
      const formData = new FormData();

      formData.append('title', postTitle.value.trim());
      formData.append('content', JSON.stringify(postContent.value));
      formData.append('category', postCategory.value);
      formData.append('status', status);
      formData.append('visibility', postVisibility.value);

      // Append images
      postImages.value.forEach((image) => {
        formData.append('images', image.file);
      });

      return formData;
    };

    const resetForm = () => {
      postTitle.value = '';
      postContent.value = null;
      postCategory.value = '';
      postImages.value = [];
      postVisibility.value = 'public';
      errors.value = {
        title: '',
        content: '',
        category: '',
        images: '',
      };
    };

    const handlePublish = async () => {
      console.log('[CreatePostForm] Attempting to publish post...');

      // Clear previous messages
      generalError.value = '';
      successMessage.value = '';

      // Validate form
      if (!validateForm()) {
        console.log('[CreatePostForm] Validation failed');
        generalError.value = 'Please fix the errors before publishing';
        return;
      }

      isSubmitting.value = true;
      isPublishing.value = true;

      try {
        const formData = buildFormData('published');
        console.log('[CreatePostForm] Submitting post...');

        const post = await createPost(formData);

        console.log('[CreatePostForm] Post published successfully:', post.id);
        successMessage.value = 'Post published successfully!';
        emit('success', post);

        setTimeout(() => {
          resetForm();
          successMessage.value = '';
        }, 2000);
      } catch (error: any) {
        console.error('[CreatePostForm] Failed to publish post:', error);
        generalError.value = error.message || 'Failed to publish post. Please try again.';
        emit('error', error);
      } finally {
        isSubmitting.value = false;
        isPublishing.value = false;
      }
    };

    const handleSaveDraft = async () => {
      console.log('[CreatePostForm] Saving as draft...');

      // Clear previous messages
      generalError.value = '';
      successMessage.value = '';

      // Use same validation as publish
      if (!validateForm()) {
        console.log('[CreatePostForm] Validation failed');
        generalError.value = 'Please fix the errors before saving draft';
        return;
      }

      isSubmitting.value = true;
      isDraftSaving.value = true;

      try {
        const formData = buildFormData('draft');
        console.log('[CreatePostForm] Submitting draft...');

        const post = await createPost(formData);

        console.log('[CreatePostForm] Draft saved successfully:', post.id);
        successMessage.value = 'Draft saved successfully!';
        emit('success', post);

        setTimeout(() => {
          resetForm();
          successMessage.value = '';
        }, 2000);
      } catch (error: any) {
        console.error('[CreatePostForm] Failed to save draft:', error);
        generalError.value = error.message || 'Failed to save draft. Please try again.';
        emit('error', error);
      } finally {
        isSubmitting.value = false;
        isDraftSaving.value = false;
      }
    };

    const handleImageError = (error: string) => {
      errors.value.images = error;
      setTimeout(() => {
        errors.value.images = '';
      }, 5000);
    };

    return {
      // Data
      postTitle,
      postContent,
      postCategory,
      postImages,
      postVisibility,
      categories,
      loadingCategories,
      categoryError,
      errors,
      isSubmitting,
      isPublishing,
      isDraftSaving,
      generalError,
      successMessage,
      POST_VALIDATION,

      // Methods
      validateTitle,
      validateContent,
      validateCategory,
      handlePublish,
      handleSaveDraft,
      handleImageError,
    };
  },
});
</script>

<style scoped>
.form-field {
  margin-bottom: 24px;
}

.field-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  color: #1f2937;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.input-error {
  border-color: #ef4444;
}

.input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.field-error {
  margin-top: 6px;
  font-size: 14px;
  color: #ef4444;
}

.field-hint {
  margin-top: 6px;
  font-size: 13px;
  color: #6b7280;
}

.success-banner,
.error-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 500;
}

.success-banner {
  background-color: #d1fae5;
  color: #065f46;
}

.error-banner {
  background-color: #fee2e2;
  color: #991b1b;
}

.success-icon,
.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #d1d5db;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
