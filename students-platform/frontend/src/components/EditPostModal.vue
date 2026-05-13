<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container bg-white rounded-2xl shadow-lg overflow-hidden">
          <!-- Header -->
          <div class="p-4 flex items-center justify-between border-b border-gray-200">
            <div class="flex items-center gap-3">
              <img
                :src="userAvatar"
                :alt="userName"
                @click="navigateToProfile"
                class="w-12 h-12 rounded-full object-cover border-2 border-blue-100 hover:border-blue-300 transition cursor-pointer"
              />
              <h3
                @click="navigateToProfile"
                class="font-bold text-gray-900 hover:text-blue-600 transition cursor-pointer"
              >
                {{ userName }}
              </h3>
            </div>
            <button
              @click="handleClose"
              class="text-gray-400 hover:text-gray-600 transition"
              type="button"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <div class="p-6 overflow-y-auto" style="max-height: calc(90vh - 80px);">
            <div v-if="successMessage" class="success-banner">
              <svg class="success-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              {{ successMessage }}
            </div>

            <div v-if="generalError" class="error-banner">
              <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              {{ generalError }}
            </div>

            <form @submit.prevent="handlePublish">
              <div class="form-field">
                <label for="title" class="field-label">
                  Title <span class="required">*</span>
                </label>
                <input
                  id="title"
                  ref="titleInput"
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

              <div class="form-field">
                <label for="content" class="field-label">
                  Content <span class="required">*</span>
                </label>
                <RichTextEditor
                  v-model="postContent"
                  placeholder="What's on your mind?"
                  :max-length="POST_VALIDATION.CONTENT_MAX_LENGTH"
                  :error="errors.content"
                  @change="validateContent"
                />
              </div>

              <div v-if="!isCommunityPost" class="form-field">
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

              <div class="form-field">
                <ImageUpload
                  v-model="postImages"
                  v-model:existing-images="existingImages"
                  :max-images="POST_VALIDATION.MAX_IMAGES"
                  @error="handleImageError"
                />
                <div v-if="errors.images" class="field-error">{{ errors.images }}</div>
              </div>

              <div v-if="!isCommunityPost" class="form-field">
                <label for="visibility" class="field-label">
                  Visibility
                </label>
                <select
                  id="visibility"
                  v-model="postVisibility"
                  class="form-input"
                >
                  <option value="public">Public - Everyone can see</option>
                  <option value="friends">Friends - Only your friends can see</option>
                  <option value="private">Private - Only you can see</option>
                </select>
              </div>

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
                  {{ isPublishing ? 'Updating...' : 'Update Post' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, type PropType } from 'vue';
import { useRouter } from 'vue-router';
import RichTextEditor from './RichTextEditor.vue';
import ImageUpload, { type ImageUpload as ImageUploadType } from './ImageUpload.vue';
import { updatePost } from '../api/post';
import { getActiveCategories } from '../api/category';
import type { Category } from '../types/category';
import type { LexicalEditorState } from '../types/lexical';
import { POST_VALIDATION, type SafePost } from '../types/post';
import { useSessionStore } from '../store/session';
import { usePostFeedStore } from '../store/postFeed';
import { getAvatarUrl } from '../utils/avatar';

interface FormErrors {
  title: string;
  content: string;
  category: string;
  images: string;
}

export default defineComponent({
  name: 'EditPostModal',

  components: {
    RichTextEditor,
    ImageUpload,
  },

  props: {
    post: {
      type: Object as PropType<SafePost>,
      required: true,
    },
    isCommunityPost: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close', 'updated'],

  setup(props, { emit }) {
    const session = useSessionStore();
    const postFeedStore = usePostFeedStore();
    const router = useRouter();

    const isOpen = ref(true);
    const titleInput = ref<HTMLInputElement | null>(null);

    const userName = computed(() => session.user?.name || 'User');
    const userAvatar = computed(() => getAvatarUrl(userName.value, session.user?.avatar));
    const userProfileUrl = computed(() => {
      if (session.user?.username) {
        return `/profile/${session.user.username}`;
      }
      return '#';
    });

    const navigateToProfile = () => {
      if (session.user?.username) {
        router.push(`/profile/${session.user.username}`);
      }
    };

    // Helper function to get category ID
    const getCategoryId = (category: string | { id: string; name: string; slug: string } | undefined): string => {
      if (!category) return '';
      return typeof category === 'string' ? category : category.id;
    };

    // Helper function to get community ID
    const getCommunityId = (community: string | { id: string; name: string; slug: string } | undefined): string => {
      if (!community) return '';
      return typeof community === 'string' ? community : community.id;
    };

    // Pre-populate form with existing post data
    const postTitle = ref(props.post.title);
    const postContent = ref<LexicalEditorState | null>(
      typeof props.post.content === 'string'
        ? JSON.parse(props.post.content)
        : props.post.content
    );
    const postCategory = ref(getCategoryId(props.post.category));
    const postCommunityId = ref(getCommunityId(props.post.community));
    const postImages = ref<ImageUploadType[]>([]);
    const existingImages = ref<string[]>(
      props.post.images ? props.post.images.map(img => img.url) : []
    );
    const postVisibility = ref<'public' | 'private' | 'friends'>(props.post.visibility as any || 'public');

    const categories = ref<Category[]>([]);
    const loadingCategories = ref(false);
    const categoryError = ref('');

    const errors = ref<FormErrors>({
      title: '',
      content: '',
      category: '',
      images: '',
    });

    const isSubmitting = ref(false);
    const isPublishing = ref(false);
    const isDraftSaving = ref(false);
    const generalError = ref('');
    const successMessage = ref('');

    onMounted(async () => {
      await fetchCategories();
    });

    const fetchCategories = async () => {
      loadingCategories.value = true;
      categoryError.value = '';

      try {
        categories.value = await getActiveCategories();
      } catch (error: any) {
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
      formData.append('status', status);

      // Always send category and visibility (backend will preserve them for community posts)
      formData.append('category', postCategory.value);
      formData.append('visibility', postVisibility.value);

      // Include communityId if this is a community post (to prevent backend from thinking we're removing it)
      if (postCommunityId.value) {
        formData.append('communityId', postCommunityId.value);
      }

      // Add new image files (field name 'images' for file uploads)
      postImages.value.forEach((image) => {
        formData.append('images', image.file);
      });

      // Send existing images that should be kept (use 'existingImages' field name)
      // Backend expects array of { url, alt? } objects
      if (existingImages.value.length > 0) {
        const existingImagesData = existingImages.value.map(url => ({ url }));
        formData.append('existingImages', JSON.stringify(existingImagesData));
      }

      return formData;
    };

    const handleClose = () => {
      if (!isSubmitting.value) {
        isOpen.value = false;
        emit('close');
      }
    };

    const handlePublish = async () => {
      generalError.value = '';
      successMessage.value = '';

      if (!validateForm()) {
        generalError.value = 'Please fix the errors before updating';
        return;
      }

      isSubmitting.value = true;
      isPublishing.value = true;

      try {
        const formData = buildFormData('published');

        const updatedPost = await updatePost(props.post.id, formData);

        successMessage.value = 'Post updated successfully!';

        // Emit the updated event immediately so parent can update UI
        emit('updated', updatedPost);

        // Update the post in the store (for other pages that use the feed store)
        await postFeedStore.refreshPosts();

        setTimeout(() => {
          handleClose();
        }, 1000);
      } catch (error: any) {
        generalError.value = error.message || 'Failed to update post. Please try again.';
      } finally {
        isSubmitting.value = false;
        isPublishing.value = false;
      }
    };

    const handleSaveDraft = async () => {
      generalError.value = '';
      successMessage.value = '';

      if (!validateForm()) {
        generalError.value = 'Please fix the errors before saving draft';
        return;
      }

      isSubmitting.value = true;
      isDraftSaving.value = true;

      try {
        const formData = buildFormData('draft');

        const updatedPost = await updatePost(props.post.id, formData);

        successMessage.value = 'Draft saved successfully!';

        // Emit the updated event immediately so parent can update UI
        emit('updated', updatedPost);

        // Update the post in the store (for other pages that use the feed store)
        await postFeedStore.refreshPosts();

        setTimeout(() => {
          handleClose();
        }, 1000);
      } catch (error: any) {
        generalError.value = error.message || 'Failed to save draft. Please try again.';
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
      isOpen,
      titleInput,
      userName,
      userAvatar,
      userProfileUrl,
      isCommunityPost: props.isCommunityPost,

      postTitle,
      postContent,
      postCategory,
      postImages,
      existingImages,
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

      validateTitle,
      validateContent,
      validateCategory,
      handlePublish,
      handleSaveDraft,
      handleImageError,
      handleClose,
      navigateToProfile,
    };
  },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-container {
  max-width: 48rem;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

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

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
</style>
