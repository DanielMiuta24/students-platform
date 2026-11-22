<template>
  <AuthFormShell title="Forgot Password" :error="error" :success="success">
    <p class="text-gray-600 text-sm mb-6 text-center">
      Enter your registered email address and we'll send you a verification code.
    </p>

    <div class="mb-6">
      <label for="email" class="block text-gray-700 text-sm font-medium mb-2">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        v-model="form.email"
        @input="handleFieldChange"
        @keyup.enter="handleSubmit"
        placeholder="Enter your email"
        :class="[
          'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
          fieldError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        ]"
      />
      <div v-if="fieldError" class="text-red-500 text-sm mt-1">{{ fieldError }}</div>
    </div>

    <button
      @click="handleSubmit"
      class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="loading"
    >
      {{ loading ? 'Sending...' : 'Send Verification Code' }}
    </button>

    <p class="text-center text-sm text-gray-600 mt-4">
      Remember your password?
      <router-link to="/login" class="text-blue-500 hover:text-blue-700 font-medium">Log in</router-link>
    </p>
  </AuthFormShell>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthFormShell from './AuthFormShell.vue';
import { validateEmail } from '../../utils/validation';
import { forgotPassword } from '../../api/auth';

const router = useRouter();

const form = reactive({ email: '' });
const fieldError = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const handleFieldChange = () => {
  fieldError.value = '';
  error.value = null;
};

const handleSubmit = async () => {
  error.value = null;
  success.value = null;
  fieldError.value = validateEmail(form.email);
  if (fieldError.value) return;

  loading.value = true;
  try {
    await forgotPassword(form.email);
    router.push({ path: '/forgot-password/verify', query: { email: form.email } });
  } catch {
    error.value = 'Something went wrong. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
