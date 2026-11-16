<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
    <div class="max-w-3xl mx-auto">

      <!-- Already verified state -->
      <div v-if="isAlreadyVerified" class="text-center py-8">
        <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Student Status Verified</h2>
        <p class="text-base text-gray-600 max-w-md mx-auto mb-2">
          Your university email has been verified.
        </p>
        <p class="text-sm font-semibold text-blue-600">{{ sessionStore.user?.universityEmail }}</p>
      </div>

      <!-- Email sent state -->
      <div v-else-if="submitted" class="text-center py-8">
        <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Verification Email Sent</h2>
        <p class="text-base text-gray-600 max-w-md mx-auto">
          Check your university inbox and click the verification link to complete student verification.
          The link expires in 24 hours.
        </p>
      </div>

      <!-- Form state -->
      <div v-else>
        <div class="text-center mb-6 sm:mb-8">
          <div class="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Get Verified Student Status</h2>
          <p class="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Verify your account with your university email to unlock exclusive student benefits and features.
          </p>
        </div>

        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Benefits of Student Verification:</h3>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700"><strong>Display verified student badge on your profile</strong> to stand out in the community</span>
            </li>
            <li class="flex items-start gap-3">
              <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700"><strong>Make your profile trustable for people who are looking for study</strong></span>
            </li>
          </ul>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="universityEmail" class="block text-sm font-semibold text-gray-900 mb-2">
              University Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <input
                id="universityEmail"
                v-model="email"
                type="email"
                placeholder="student@university.edu"
                class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                :disabled="isLoading"
                required
              />
            </div>
            <p class="text-sm text-gray-500 mt-2">
              Please use your official university email address (e.g., .edu, .ac.uk, etc.)
            </p>
          </div>

          <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p class="text-sm text-red-700">{{ errorMessage }}</p>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Sending...</span>
            <span v-else>Send Verification Email</span>
          </button>

          <p class="text-sm text-gray-500 text-center">
            You'll receive a verification link at your university email address
          </p>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { secureApi } from '../../services/secureApi';
import { useSessionStore } from '../../store/session';

const sessionStore = useSessionStore();
const email = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const submitted = ref(false);

const isAlreadyVerified = computed(() => sessionStore.user?.type === 'Student');

const handleSubmit = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    const res = await secureApi.post('users/student-verification', { email: email.value }, { timeout: 30000 });
    if (res.status >= 200 && res.status < 300) {
      submitted.value = true;
    } else {
      const msg = res.data?.message;
      if (msg === 'Email domain is not a recognized university domain') {
        errorMessage.value = 'This email domain is not recognized as a university domain. Please use your official university email.';
      } else if (msg === 'Student email already verified') {
        errorMessage.value = 'Your student email is already verified.';
      } else if (msg) {
        errorMessage.value = msg;
      } else {
        errorMessage.value = `Unexpected error (${res.status}). Please try again.`;
      }
    }
  } catch (err: any) {
    errorMessage.value = err?.code === 'ECONNABORTED'
      ? 'Request timed out. Please try again.'
      : `Failed to send verification email. ${err?.message ?? 'Please try again.'}`;
  } finally {
    isLoading.value = false;
  }
};
</script>

