<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">Change Password</h2>
      <p class="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">Update your password to keep your account secure.</p>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="currentPassword" class="label">Current Password</label>
          <div class="relative">
            <input
              id="currentPassword"
              v-model="formData.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              placeholder="Enter your current password"
              class="input pr-12"
              :class="{ 'input-error': errors.currentPassword }"
              @input="validateCurrentPassword"
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <svg v-if="!showCurrentPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
              </svg>
            </button>
          </div>
          <p v-if="errors.currentPassword" class="error-message">{{ errors.currentPassword }}</p>
        </div>

        <div>
          <label for="newPassword" class="label">New Password</label>
          <div class="relative">
            <input
              id="newPassword"
              v-model="formData.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="Enter your new password"
              class="input pr-12"
              :class="{ 'input-error': errors.newPassword }"
              @input="handleNewPasswordChange"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <svg v-if="!showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
              </svg>
            </button>
          </div>

          <div v-if="formData.newPassword" class="mt-2">
            <div class="flex items-center gap-2">
              <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-300"
                  :class="{
                    'bg-red-500 w-1/3': passwordValidation.strength === 'weak',
                    'bg-yellow-500 w-2/3': passwordValidation.strength === 'medium',
                    'bg-green-500 w-full': passwordValidation.strength === 'strong',
                  }"
                ></div>
              </div>
              <span
                class="text-sm font-semibold"
                :class="{
                  'text-red-600': passwordValidation.strength === 'weak',
                  'text-yellow-600': passwordValidation.strength === 'medium',
                  'text-green-600': passwordValidation.strength === 'strong',
                }"
              >
                {{ passwordValidation.strength.charAt(0).toUpperCase() + passwordValidation.strength.slice(1) }}
              </span>
            </div>
          </div>

          <p v-if="errors.newPassword" class="error-message mt-2">{{ errors.newPassword }}</p>

          <div v-if="formData.newPassword" class="mt-3 space-y-1">
            <p class="text-xs text-gray-600 font-semibold mb-1">Password must contain:</p>
            <div class="space-y-1">
              <p
                v-for="requirement in passwordRequirements"
                :key="requirement.text"
                class="text-xs flex items-center gap-2"
                :class="requirement.met ? 'text-green-600' : 'text-gray-500'"
              >
                <svg v-if="requirement.met" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                {{ requirement.text }}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label for="confirmPassword" class="label">Confirm New Password</label>
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm your new password"
              class="input pr-12"
              :class="{ 'input-error': errors.confirmPassword }"
              @input="validateConfirmPassword"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
              </svg>
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
        </div>

        <div v-if="userStore.updateError" class="error-banner">
          {{ userStore.updateError }}
        </div>

        <div v-if="userStore.updateSuccess" class="success-banner">
          {{ userStore.updateSuccess }}
        </div>

        <button
          type="submit"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="userStore.isUpdating || !isFormValid"
        >
          <span v-if="userStore.isUpdating" class="flex items-center justify-center">
            <span class="loading-spinner-small mr-2"></span>
            Changing Password...
          </span>
          <span v-else>Change Password</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useUserStore } from '../../store/user';
import { usePasswordValidation, usePasswordMatch } from '../../composables/usePasswordValidation';
import { USER_VALIDATION } from '../../types/user';

const userStore = useUserStore();

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const formData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const errors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const validateCurrentPassword = () => {
  if (!formData.currentPassword) {
    errors.currentPassword = 'Current password is required';
    return false;
  }
  errors.currentPassword = '';
  return true;
};

const passwordValidation = computed(() => usePasswordValidation(formData.newPassword));

const passwordRequirements = computed(() => [
  { text: `At least ${USER_VALIDATION.PASSWORD_MIN_LENGTH} characters`, met: formData.newPassword.length >= USER_VALIDATION.PASSWORD_MIN_LENGTH },
  { text: 'One uppercase letter', met: /[A-Z]/.test(formData.newPassword) },
  { text: 'One lowercase letter', met: /[a-z]/.test(formData.newPassword) },
  { text: 'One number', met: /\d/.test(formData.newPassword) },
]);

const handleNewPasswordChange = () => {
  if (formData.newPassword) {
    if (!passwordValidation.value.isValid) {
      errors.newPassword = passwordValidation.value.errors[0] || 'Password does not meet requirements';
    } else {
      errors.newPassword = '';
    }
  } else {
    errors.newPassword = '';
  }

  if (formData.confirmPassword) {
    validateConfirmPassword();
  }
};

const validateConfirmPassword = () => {
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password';
    return false;
  }

  const matchResult = usePasswordMatch(formData.newPassword, formData.confirmPassword);
  if (!matchResult.matches) {
    errors.confirmPassword = matchResult.error;
    return false;
  }

  errors.confirmPassword = '';
  return true;
};

const isFormValid = computed(() => {
  return (
    formData.currentPassword !== '' &&
    formData.newPassword !== '' &&
    formData.confirmPassword !== '' &&
    !errors.currentPassword &&
    !errors.newPassword &&
    !errors.confirmPassword &&
    passwordValidation.value.isValid &&
    formData.newPassword === formData.confirmPassword
  );
});

const handleSubmit = async () => {
  const isCurrentPasswordValid = validateCurrentPassword();
  const isNewPasswordValid = passwordValidation.value.isValid;
  const isConfirmPasswordValid = validateConfirmPassword();

  if (!isCurrentPasswordValid) {
    errors.currentPassword = 'Current password is required';
  }

  if (!isNewPasswordValid) {
    errors.newPassword = passwordValidation.value.errors[0] || 'Password does not meet requirements';
  }

  if (!isCurrentPasswordValid || !isNewPasswordValid || !isConfirmPasswordValid) {
    return;
  }

  try {
    await userStore.changeUserPassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });

    formData.currentPassword = '';
    formData.newPassword = '';
    formData.confirmPassword = '';
  } catch (error) {
    console.error('Failed to change password:', error);
  }
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
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-top: 6px;
}

.error-banner {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
}

.success-banner {
  background-color: #d1fae5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
}

.loading-spinner-small {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
