<template>
  <AuthFormShell title="Enter Verification Code" :error="error" :success="success">
    <p class="text-gray-600 text-sm mb-6 text-center">
      We sent a 6-digit code to <strong>{{ email }}</strong>. It expires in 10 minutes.
    </p>

    <div class="mb-6">
      <label for="otp" class="block text-gray-700 text-sm font-medium mb-2">Verification Code</label>
      <input
        id="otp"
        name="otp"
        type="text"
        inputmode="numeric"
        maxlength="6"
        v-model="otp"
        @input="handleOtpInput"
        @keyup.enter="handleSubmit"
        placeholder="000000"
        :class="[
          'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors text-center text-2xl tracking-widest font-mono',
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
      {{ loading ? 'Verifying...' : 'Verify Code' }}
    </button>

    <div class="text-center mt-4 text-sm text-gray-600">
      <span v-if="resendCooldown > 0">Resend code in {{ resendCooldown }}s</span>
      <button
        v-else
        @click="handleResend"
        :disabled="resending"
        class="text-blue-500 hover:text-blue-700 font-medium disabled:opacity-50"
      >
        {{ resending ? 'Sending...' : 'Resend code' }}
      </button>
    </div>

    <p class="text-center text-sm text-gray-600 mt-2">
      <router-link to="/forgot-password" class="text-blue-500 hover:text-blue-700 font-medium">Use a different email</router-link>
    </p>
  </AuthFormShell>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthFormShell from './AuthFormShell.vue';
import { forgotPassword, verifyPasswordResetOtp } from '../../api/auth';

const route = useRoute();
const router = useRouter();

const email = (route.query.email as string) || '';
const otp = ref('');
const fieldError = ref('');
const loading = ref(false);
const resending = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const resendCooldown = ref(60);

let cooldownTimer: ReturnType<typeof setInterval> | null = null;

const startCooldown = () => {
  resendCooldown.value = 60;
  cooldownTimer = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer);
      cooldownTimer = null;
    }
  }, 1000);
};

onMounted(() => {
  if (!email) {
    router.replace('/forgot-password');
    return;
  }
  startCooldown();
});

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
});

const handleOtpInput = () => {
  otp.value = otp.value.replace(/\D/g, '').slice(0, 6);
  fieldError.value = '';
  error.value = null;
};

const handleSubmit = async () => {
  error.value = null;
  success.value = null;

  if (!otp.value || otp.value.length !== 6) {
    fieldError.value = 'Please enter the 6-digit code.';
    return;
  }

  loading.value = true;
  try {
    const result = await verifyPasswordResetOtp(email, otp.value);
    if (!result.success || !result.resetToken) {
      error.value = result.message || 'Invalid or expired code. Please try again.';
      return;
    }
    sessionStorage.setItem('passwordResetToken', result.resetToken);
    router.push('/forgot-password/reset');
  } catch {
    error.value = 'Something went wrong. Please try again.';
  } finally {
    loading.value = false;
  }
};

const handleResend = async () => {
  if (!email || resendCooldown.value > 0) return;
  resending.value = true;
  error.value = null;
  success.value = null;
  try {
    await forgotPassword(email);
    success.value = 'A new code has been sent.';
    otp.value = '';
    startCooldown();
  } catch {
    error.value = 'Failed to resend code. Please try again.';
  } finally {
    resending.value = false;
  }
};
</script>
