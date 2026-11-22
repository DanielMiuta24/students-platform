<template>
  <AuthFormShell title="Reset Password" :error="error" :success="success">
    <p class="text-gray-600 text-sm mb-6 text-center">
      Choose a strong new password for your account.
    </p>

    <div class="mb-4">
      <label for="newPassword" class="block text-gray-700 text-sm font-medium mb-2">New Password</label>
      <div class="relative">
        <input
          id="newPassword"
          name="newPassword"
          :type="showPassword ? 'text' : 'password'"
          v-model="form.newPassword"
          @input="handleFieldChange('newPassword')"
          placeholder="Enter new password"
          :class="[
            'w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 transition-colors',
            fieldErrors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          ]"
        />
        <button type="button" @click="showPassword = !showPassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
          <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
          </svg>
        </button>
      </div>
      <div v-if="fieldErrors.newPassword" class="text-red-500 text-sm mt-1">{{ fieldErrors.newPassword }}</div>
    </div>

    <div class="mb-6">
      <label for="confirmPassword" class="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
      <input
        id="confirmPassword"
        name="confirmPassword"
        :type="showPassword ? 'text' : 'password'"
        v-model="form.confirmPassword"
        @input="handleFieldChange('confirmPassword')"
        @keyup.enter="handleSubmit"
        placeholder="Confirm new password"
        :class="[
          'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
          fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        ]"
      />
      <div v-if="fieldErrors.confirmPassword" class="text-red-500 text-sm mt-1">{{ fieldErrors.confirmPassword }}</div>
    </div>

    <button
      @click="handleSubmit"
      class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="loading"
    >
      {{ loading ? 'Resetting...' : 'Reset Password' }}
    </button>
  </AuthFormShell>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthFormShell from './AuthFormShell.vue';
import { validatePassword } from '../../utils/validation';
import { resetPassword } from '../../api/auth';

const router = useRouter();

const form = reactive({ newPassword: '', confirmPassword: '' });
const fieldErrors = reactive({ newPassword: '', confirmPassword: '' });
const showPassword = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

onMounted(() => {
  if (!sessionStorage.getItem('passwordResetToken')) {
    router.replace('/forgot-password');
  }
});

const handleFieldChange = (field: 'newPassword' | 'confirmPassword') => {
  fieldErrors[field] = '';
  error.value = null;
};

const validateForm = (): boolean => {
  fieldErrors.newPassword = validatePassword(form.newPassword);
  if (!form.confirmPassword) {
    fieldErrors.confirmPassword = 'Please confirm your password.';
  } else if (form.newPassword !== form.confirmPassword) {
    fieldErrors.confirmPassword = 'Passwords do not match.';
  } else {
    fieldErrors.confirmPassword = '';
  }
  return !fieldErrors.newPassword && !fieldErrors.confirmPassword;
};

const handleSubmit = async () => {
  error.value = null;
  success.value = null;
  if (!validateForm()) return;

  const token = sessionStorage.getItem('passwordResetToken');
  if (!token) {
    error.value = 'Reset session expired. Please start over.';
    router.replace('/forgot-password');
    return;
  }

  loading.value = true;
  try {
    const result = await resetPassword(token, form.newPassword, form.confirmPassword);
    if (!result.success) {
      error.value = result.message || 'Failed to reset password.';
      if (result.message?.includes('expired')) {
        sessionStorage.removeItem('passwordResetToken');
        setTimeout(() => router.replace('/forgot-password'), 2000);
      }
      return;
    }
    sessionStorage.removeItem('passwordResetToken');
    success.value = 'Password reset successfully! Redirecting to login...';
    setTimeout(() => router.push('/login'), 2000);
  } catch {
    error.value = 'Something went wrong. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
