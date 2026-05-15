<template>
  <AuthFormShell title="Login Page" :error="error" :success="success">
    <div class="mb-4">
      <label for="email" class="block text-gray-700 text-sm font-medium mb-2">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        v-model="form.email"
        @input="handleFieldChange('email')"
        @blur="handleFieldBlur('email')"
        placeholder="Enter your email"
        :class="[
          'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
          fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        ]"
      />
      <div v-if="fieldErrors.email" class="text-red-500 text-sm mt-1">{{ fieldErrors.email }}</div>
    </div>

    <div class="mb-6">
      <label for="password" class="block text-gray-700 text-sm font-medium mb-2">Password</label>
      <div class="relative">
        <input
          id="password"
          name="password"
          :type="showPassword ? 'text' : 'password'"
          v-model="form.password"
          @input="handleFieldChange('password')"
          @blur="handleFieldBlur('password')"
          @keyup.enter="handleLogin"
          placeholder="Enter your password"
          :class="[
            'w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 transition-colors',
            fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          ]"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
          </svg>
        </button>
      </div>
      <div v-if="fieldErrors.password" class="text-red-500 text-sm mt-1">{{ fieldErrors.password }}</div>
    </div>

    <button
      @click="handleLogin"
      class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="loading"
    >
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>
  </AuthFormShell>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue';
import type { LoginForm } from '../../types/auth';
import { useAuth } from '../../composables/useAuth';
import { useFormErrors } from '../../composables/useFormErrors';
import { validateEmail } from '../../utils/validation';
import { useRouter } from 'vue-router';
import AuthFormShell from './AuthFormShell.vue';

const auth = useAuth();
const { loading, error, success, isAuthenticated, user, clearMessages } = auth;
const {
  globalError,
  fieldErrors: apiFieldErrors,
  clearFieldError: clearApiFieldError,
  handleApiError,
} = useFormErrors();
const router = useRouter();

const showPassword = ref(false);

const form = reactive<LoginForm>({
  email: '',
  password: '',
});

const fieldErrors = reactive<Record<string, string>>({
  email: '',
  password: '',
});

const touchedFields = reactive<Record<string, boolean>>({
  email: false,
  password: false,
});

const validatePasswordRequired = (password: string): string => {
  if (!password || password.trim() === '') {
    return 'Password is required';
  }
  return '';
};

watch(() => form.email, (newValue) => {
  if (touchedFields.email || newValue.length > 0) {
    fieldErrors.email = apiFieldErrors.email || validateEmail(newValue);
  }
});

watch(() => form.password, (newValue) => {
  if (touchedFields.password || newValue.length > 0) {
    fieldErrors.password = apiFieldErrors.password || validatePasswordRequired(newValue);
  }
});

watch(() => apiFieldErrors, () => {
  Object.keys(form).forEach((key) => {
    if (apiFieldErrors[key]) {
      fieldErrors[key] = apiFieldErrors[key];
    }
  });
}, { deep: true });

const handleFieldChange = (fieldName: string) => {
  touchedFields[fieldName] = true;
  clearApiFieldError(fieldName);

  if (globalError.value) {
    clearMessages();
  }
};

const handleFieldBlur = (fieldName: string) => {
  touchedFields[fieldName] = true;
};

const validateForm = (): boolean => {
  Object.keys(form).forEach((key) => {
    touchedFields[key] = true;
  });

  fieldErrors.email = validateEmail(form.email);
  fieldErrors.password = validatePasswordRequired(form.password);

  return !Object.values(fieldErrors).some((error) => error !== '');
};

const handleLogin = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    const loggedInUser = await auth.login(form);
    if (loggedInUser) {
      router.push(`/profile/${loggedInUser.username}`);
    }
  } catch (err: unknown) {
    handleApiError(err);
    Object.keys(form).forEach((key) => {
      if (apiFieldErrors[key]) {
        fieldErrors[key] = apiFieldErrors[key];
      }
    });
  }
};

watch(isAuthenticated, (authenticated) => {
  if (authenticated && user.value) {
    router.push(`/profile/${user.value.username}`);
  }
});
</script>
