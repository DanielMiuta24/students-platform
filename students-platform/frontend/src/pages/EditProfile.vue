<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12">
    <div class="max-w-3xl mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <h1 class="text-3xl font-bold text-blue-900 mb-2">Edit Profile</h1>
        <p class="text-gray-500 mb-8">Update your personal information and profile photo.</p>

        <!-- Loading State -->
        <div v-if="isLoadingProfile" class="text-center py-12">
          <div class="loading-spinner mx-auto mb-4"></div>
          <p class="text-gray-600">Loading profile...</p>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="saveProfile" class="space-y-5">
          <!-- Photo Upload -->
          <div class="flex items-center gap-6">
            <img
              :src="avatarPreview || sessionStore.user?.avatar || 'https://via.placeholder.com/150'"
              alt="Profile picture"
              class="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
            />

            <div>
              <label
                for="profilePhoto"
                class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition"
              >
                Change Photo
              </label>

              <input
                id="profilePhoto"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                class="hidden"
                @change="handlePhotoUpload"
              />

              <p class="text-sm text-gray-500 mt-2">
                JPG, PNG, or WEBP recommended (max 5MB).
              </p>
            </div>
          </div>

          <!-- Full Name -->
          <div>
            <label class="label">Full Name</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Your full name"
              class="input"
              :class="{ 'input-error': errors.name }"
              @input="validateName"
            />
            <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
          </div>

          <!-- Bio -->
          <div>
            <label class="label">Bio</label>
            <textarea
              v-model="formData.bio"
              rows="3"
              placeholder="Short bio about yourself"
              class="input resize-none"
              :class="{ 'input-error': errors.bio }"
              @input="validateBio"
            ></textarea>
            <p v-if="errors.bio" class="error-message">{{ errors.bio }}</p>
            <p class="helper-text">{{ formData.bio.length }}/{{ USER_VALIDATION.BIO_MAX_LENGTH }}</p>
          </div>

          <!-- Location -->
          <div>
            <label class="label">Location</label>
            <input
              v-model="formData.location"
              type="text"
              placeholder="Your city or country"
              class="input"
              :class="{ 'input-error': errors.location }"
              @input="validateLocation"
            />
            <p v-if="errors.location" class="error-message">{{ errors.location }}</p>
          </div>

          <!-- Error Banner -->
          <div v-if="userStore.updateError" class="error-banner">
            {{ userStore.updateError }}
          </div>

          <!-- Success Banner -->
          <div v-if="userStore.updateSuccess" class="success-banner">
            {{ userStore.updateSuccess }}
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center pt-4">
            <button
              type="button"
              @click="goBack"
              class="btn-secondary"
              :disabled="userStore.isUpdating"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="btn-primary"
              :disabled="userStore.isUpdating || !isFormValid"
            >
              <span v-if="userStore.isUpdating" class="flex items-center">
                <span class="loading-spinner-small mr-2"></span>
                Saving...
              </span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '../store/session';
import { useUserStore } from '../store/user';
import { USER_VALIDATION } from '../types/user';

const router = useRouter();
const sessionStore = useSessionStore();
const userStore = useUserStore();

const isLoadingProfile = ref(true);
const avatarPreview = ref<string | null>(null);
const selectedFile = ref<File | null>(null);

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

// Load user data on mount
onMounted(async () => {
  try {
    if (!sessionStore.user) {
      await sessionStore.restoreSession();
    }

    if (sessionStore.user) {
      formData.name = sessionStore.user.name || '';
      formData.bio = sessionStore.user.bio || '';
      formData.location = sessionStore.user.location || '';
    }
  } catch (error) {
    console.error('Failed to load profile:', error);
  } finally {
    isLoadingProfile.value = false;
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

  if (!file) return;

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB');
    return;
  }

  // Validate file type
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    alert('Only JPG, PNG, and WEBP images are allowed');
    return;
  }

  selectedFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
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
    });

    // Redirect after successful update
    setTimeout(() => {
      router.push(`/profile/${sessionStore.user?.username}`);
    }, 1500);
  } catch (error) {
    console.error('Failed to update profile:', error);
  }
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.label {
  display: block;
  font-weight: 700;
  color: #0f2a5f;
  margin-bottom: 8px;
}

.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  outline: none;
  transition: all 0.2s;
}

.input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-error {
  border-color: #ef4444;
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.helper-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.error-banner {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.success-banner {
  background-color: #d1fae5;
  color: #065f46;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #d1d5db;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-spinner-small {
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
