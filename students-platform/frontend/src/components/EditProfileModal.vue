<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="onCancel">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>

      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all"
          @click.stop
        >
          <!-- Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Edit Profile</h2>
                <p class="text-sm text-gray-600 mt-1">Update your personal information and profile photo</p>
              </div>
              <button
                @click="onCancel"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <form @submit.prevent="saveProfile" class="space-y-5">
              <!-- Photo Upload -->
              <div class="flex items-center gap-6 pb-5 border-b border-gray-200">
                <img
                  :src="removeAvatar ? 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'150\' height=\'150\'%3E%3Crect fill=\'%23ddd\' width=\'150\' height=\'150\'/%3E%3Ctext fill=\'%23999\' font-family=\'sans-serif\' font-size=\'14\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3ENo Image%3C/text%3E%3C/svg%3E' : (avatarPreview || user?.avatar || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'150\' height=\'150\'%3E%3Crect fill=\'%23ddd\' width=\'150\' height=\'150\'/%3E%3Ctext fill=\'%23999\' font-family=\'sans-serif\' font-size=\'14\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3ENo Image%3C/text%3E%3C/svg%3E')"
                  alt="Profile picture"
                  class="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />

                <div class="flex-1">
                  <div class="flex gap-3">
                    <label
                      for="profilePhoto"
                      class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg cursor-pointer transition"
                    >
                      Change Photo
                    </label>

                    <button
                      v-if="!removeAvatar && (user?.avatar || avatarPreview)"
                      type="button"
                      @click="handleRemovePhoto"
                      class="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
                    >
                      Remove Photo
                    </button>
                  </div>

                  <input
                    id="profilePhoto"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    class="hidden"
                    @change="handlePhotoUpload"
                  />

                  <p class="text-sm text-gray-500 mt-2">
                    JPG, PNG, or WEBP recommended (max 5MB)
                  </p>
                  <p v-if="photoError" class="text-sm text-red-600 mt-1">{{ photoError }}</p>
                </div>
              </div>

              <!-- Full Name -->
              <div>
                <label class="block font-semibold text-gray-900 mb-2">Full Name</label>
                <input
                  v-model="formData.name"
                  type="text"
                  placeholder="Your full name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.name }"
                  @input="validateName"
                />
                <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
              </div>

              <!-- Bio -->
              <div>
                <label class="block font-semibold text-gray-900 mb-2">Bio</label>
                <textarea
                  v-model="formData.bio"
                  rows="3"
                  placeholder="Short bio about yourself"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.bio }"
                  @input="validateBio"
                ></textarea>
                <div class="flex items-center justify-between mt-1">
                  <p v-if="errors.bio" class="text-sm text-red-600">{{ errors.bio }}</p>
                  <p class="text-sm text-gray-500 ml-auto">{{ formData.bio.length }}/{{ USER_VALIDATION.BIO_MAX_LENGTH }}</p>
                </div>
              </div>

              <!-- Location -->
              <div>
                <label class="block font-semibold text-gray-900 mb-2">Location</label>
                <input
                  v-model="formData.location"
                  type="text"
                  placeholder="Your city or country"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.location }"
                  @input="validateLocation"
                />
                <p v-if="errors.location" class="text-sm text-red-600 mt-1">{{ errors.location }}</p>
              </div>

              <!-- Error Banner -->
              <div v-if="userStore.updateError" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {{ userStore.updateError }}
              </div>

              <!-- Success Banner -->
              <div v-if="userStore.updateSuccess" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                {{ userStore.updateSuccess }}
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="onCancel"
                class="px-6 py-2.5 rounded-lg font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                :disabled="userStore.isUpdating"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="saveProfile"
                class="px-6 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                :disabled="userStore.isUpdating || !isFormValid"
              >
                <span v-if="userStore.isUpdating" class="flex items-center">
                  <span class="loading-spinner mr-2"></span>
                  Saving...
                </span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useUserStore } from '../store/user';
import { USER_VALIDATION } from '../types/user';
import type { SafeUser } from '../types/auth';

interface Props {
  show: boolean;
  user: SafeUser | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'success'): void;
}>();

const userStore = useUserStore();

const avatarPreview = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const photoError = ref<string>('');
const removeAvatar = ref<boolean>(false);

const formData = reactive({
  name: '',
  bio: '',
  location: '',
});

const errors = reactive({
  name: '',
  bio: '',
  location: '',
});

// Watch for user prop changes to initialize form
watch(() => props.user, (newUser) => {
  if (newUser) {
    formData.name = newUser.name || '';
    formData.bio = newUser.bio || '';
    formData.location = newUser.location || '';
    avatarPreview.value = null;
    selectedFile.value = null;
    photoError.value = '';
    removeAvatar.value = false;
  }
}, { immediate: true });

// Watch for modal show/hide to reset errors
watch(() => props.show, (newShow) => {
  if (newShow) {
    userStore.clearMessages();
    errors.name = '';
    errors.bio = '';
    errors.location = '';
    photoError.value = '';
  }
});

// Validation functions
const validateName = () => {
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
    return false;
  }
  if (formData.name.length < USER_VALIDATION.NAME_MIN_LENGTH) {
    errors.name = `Name must be at least ${USER_VALIDATION.NAME_MIN_LENGTH} characters`;
    return false;
  }
  if (formData.name.length > USER_VALIDATION.NAME_MAX_LENGTH) {
    errors.name = `Name must not exceed ${USER_VALIDATION.NAME_MAX_LENGTH} characters`;
    return false;
  }
  errors.name = '';
  return true;
};

const validateBio = () => {
  if (formData.bio.length > USER_VALIDATION.BIO_MAX_LENGTH) {
    errors.bio = `Bio must not exceed ${USER_VALIDATION.BIO_MAX_LENGTH} characters`;
    return false;
  }
  errors.bio = '';
  return true;
};

const validateLocation = () => {
  if (formData.location.length > USER_VALIDATION.LOCATION_MAX_LENGTH) {
    errors.location = `Location must not exceed ${USER_VALIDATION.LOCATION_MAX_LENGTH} characters`;
    return false;
  }
  errors.location = '';
  return true;
};

const isFormValid = computed(() => {
  return (
    formData.name.trim() !== '' &&
    !errors.name &&
    !errors.bio &&
    !errors.location
  );
});

const handlePhotoUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  photoError.value = '';

  if (!file) return;

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    photoError.value = 'File size must be less than 5MB';
    input.value = '';
    return;
  }

  // Validate file type
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    photoError.value = 'Only JPG, PNG, and WEBP images are allowed';
    input.value = '';
    return;
  }

  selectedFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
  removeAvatar.value = false;
};

const handleRemovePhoto = () => {
  avatarPreview.value = null;
  selectedFile.value = null;
  removeAvatar.value = true;
  photoError.value = '';

  // Clear the file input
  const fileInput = document.getElementById('profilePhoto') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
};

const saveProfile = async () => {
  // Validate all fields
  const isNameValid = validateName();
  const isBioValid = validateBio();
  const isLocationValid = validateLocation();

  if (!isNameValid || !isBioValid || !isLocationValid) {
    return;
  }

  try {
    await userStore.updateUserProfile({
      name: formData.name,
      bio: formData.bio,
      location: formData.location,
      avatar: selectedFile.value || undefined,
      removeAvatar: removeAvatar.value,
    });

    // Close modal and emit success after a short delay
    setTimeout(() => {
      emit('success');
      emit('close');
    }, 1500);
  } catch (error) {
    console.error('Failed to update profile:', error);
  }
};

const onCancel = () => {
  if (!userStore.isUpdating) {
    emit('close');
  }
};
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

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
