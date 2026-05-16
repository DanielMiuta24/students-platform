<template>
  <AuthFormShell title="Register Page" :error="globalError" :success="success">
    <div class="mb-4">
      <label for="name" class="block text-gray-700 text-sm font-medium mb-2">Name</label>
      <input
        id="name"
        name="name"
        type="text"
        v-model="form.name"
        @input="handleFieldChange('name')"
        @blur="handleFieldBlur('name')"
        placeholder="Enter your name"
        :class="[
          'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
          fieldErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        ]"
      />
      <div v-if="fieldErrors.name" class="text-red-500 text-sm mt-1">{{ fieldErrors.name }}</div>
    </div>

    <div class="mb-4">
      <label for="username" class="block text-gray-700 text-sm font-medium mb-2">Username</label>
      <input
        id="username"
        name="username"
        type="text"
        v-model="form.username"
        @input="handleFieldChange('username')"
        @blur="handleFieldBlur('username')"
        placeholder="Create a username"
        :class="[
          'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
          fieldErrors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        ]"
      />
      <div v-if="fieldErrors.username" class="text-red-500 text-sm mt-1">{{ fieldErrors.username }}</div>
    </div>

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

    <div class="mb-4">
      <label for="password" class="block text-gray-700 text-sm font-medium mb-2">Password</label>
      <div class="relative">
        <input
          id="password"
          name="password"
          :type="showPassword ? 'text' : 'password'"
          v-model="form.password"
          @input="handleFieldChange('password')"
          @blur="handleFieldBlur('password')"
          placeholder="Create a password"
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

      <div v-if="form.password" class="mt-2">
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

      <div v-if="fieldErrors.password" class="text-red-500 text-sm mt-2">{{ fieldErrors.password }}</div>

      <div v-if="form.password" class="mt-3 space-y-1">
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

    <div class="mb-6">
      <label for="confirmPassword" class="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
      <div class="relative">
        <input
          id="confirmPassword"
          name="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="form.confirmPassword"
          @input="handleFieldChange('confirmPassword')"
          @blur="handleFieldBlur('confirmPassword')"
          placeholder="Confirm your password"
          :class="[
            'w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 transition-colors',
            fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          ]"
        />
        <button
          type="button"
          @click="showConfirmPassword = !showConfirmPassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
      <div v-if="fieldErrors.confirmPassword" class="text-red-500 text-sm mt-1">{{ fieldErrors.confirmPassword }}</div>
    </div>

    <button
      @click="handleRegister"
      class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="loading"
    >
      {{ loading ? 'Registering...' : 'Register' }}
    </button>

    <Toast
      :show="showSuccessToast"
      title="Account Created Successfully!"
      :message="`Welcome ${form.name}! Your account has been created. You can now log in with your credentials.`"
      type="success"
      :duration="4000"
      position="center"
      @close="handleToastClose"
    />
  </AuthFormShell>
</template>

<script lang="ts" setup>
import { reactive, watch, computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { RegisterForm } from '../../types/auth';
import { useAuth } from '../../composables/useAuth';
import { useFormErrors } from '../../composables/useFormErrors';
import { usePasswordValidation, usePasswordMatch } from '../../composables/usePasswordValidation';
import { useSEO } from '../../composables/useSEO';
import {
  validateName,
  validateUsername,
  validateEmail,
  validatePassword,
} from '../../utils/validation';
import AuthFormShell from './AuthFormShell.vue';
import Toast from '../../components/Toast.vue';

const router = useRouter();
const { register, loading, error, success, clearMessages } = useAuth();
const {
  globalError,
  fieldErrors: apiFieldErrors,
  clearFieldError: clearApiFieldError,
  handleApiError,
} = useFormErrors();

// SEO
onMounted(() => {
  useSEO('register');
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const showSuccessToast = ref(false);

const form = reactive<RegisterForm>({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const fieldErrors = reactive<Record<string, string>>({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const touchedFields = reactive<Record<string, boolean>>({
  name: false,
  username: false,
  email: false,
  password: false,
  confirmPassword: false,
});

const passwordValidation = computed(() => usePasswordValidation(form.password));

const passwordRequirements = computed(() => [
  { text: 'At least 8 characters', met: form.password.length >= 8 },
  { text: 'One uppercase letter', met: /[A-Z]/.test(form.password) },
  { text: 'One lowercase letter', met: /[a-z]/.test(form.password) },
  { text: 'One number', met: /\d/.test(form.password) },
]);

const validateConfirmPassword = (confirmPassword: string): string => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return 'Please confirm your password';
  }

  const matchResult = usePasswordMatch(form.password, confirmPassword);
  if (!matchResult.matches) {
    return matchResult.error;
  }

  return '';
};

watch(() => form.name, (newValue) => {
  if (touchedFields.name || newValue.length > 0) {
    fieldErrors.name = apiFieldErrors.name || validateName(newValue);
  }
});

watch(() => form.username, (newValue) => {
  if (touchedFields.username || newValue.length > 0) {
    fieldErrors.username = apiFieldErrors.username || validateUsername(newValue);
  }
});

watch(() => form.email, (newValue) => {
  if (touchedFields.email || newValue.length > 0) {
    fieldErrors.email = apiFieldErrors.email || validateEmail(newValue);
  }
});

watch(() => form.password, (newValue) => {
  if (touchedFields.password || newValue.length > 0) {
    fieldErrors.password = apiFieldErrors.password || validatePassword(newValue);
  }

  if (form.confirmPassword && touchedFields.confirmPassword) {
    fieldErrors.confirmPassword = validateConfirmPassword(form.confirmPassword);
  }
});

watch(() => form.confirmPassword, (newValue) => {
  if (touchedFields.confirmPassword || newValue.length > 0) {
    fieldErrors.confirmPassword = validateConfirmPassword(newValue);
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

  fieldErrors.name = validateName(form.name);
  fieldErrors.username = validateUsername(form.username);
  fieldErrors.email = validateEmail(form.email);
  fieldErrors.password = validatePassword(form.password);
  fieldErrors.confirmPassword = validateConfirmPassword(form.confirmPassword || '');

  return !Object.values(fieldErrors).some((error) => error !== '');
};

const handleRegister = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    const { confirmPassword, ...registerData } = form;
    await register(registerData);
    showSuccessToast.value = true;
    setTimeout(() => {
      router.push('/login');
    }, 4000);
  } catch (err: unknown) {
    handleApiError(err);
    Object.keys(form).forEach((key) => {
      if (apiFieldErrors[key]) {
        fieldErrors[key] = apiFieldErrors[key];
      }
    });
  }
};

const handleToastClose = () => {
  showSuccessToast.value = false;
  router.push('/login');
};
</script>