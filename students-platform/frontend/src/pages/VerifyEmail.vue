<template>
  <div class="verify-page">
    <div class="verify-card">

      <!-- Loading -->
      <div v-if="status === 'loading'" class="state-block">
        <div class="spinner"></div>
        <p class="state-label">Verifying your email...</p>
      </div>

      <!-- Success -->
      <div v-else-if="status === 'success'" class="state-block">
        <div class="icon-circle success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="state-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="state-heading">Email Verified!</h1>
        <p class="state-body">Your account is now active. You can log in and start exploring ISC.</p>
        <router-link to="/login" class="action-btn primary">Log in to your account</router-link>
      </div>

      <!-- Error -->
      <div v-else-if="status === 'error'" class="state-block">
        <div class="icon-circle error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="state-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 class="state-heading">Verification Failed</h1>
        <p class="state-body">This verification link is invalid or has expired. Links are valid for 24 hours.</p>
        <p class="state-hint">Log in to your account and request a new verification email from your profile settings.</p>
        <router-link to="/login" class="action-btn secondary">Go to login</router-link>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '../services/api';

const route = useRoute();
const status = ref<'loading' | 'success' | 'error'>('loading');

onMounted(async () => {
  const token = route.params.token as string;
  if (!token) {
    status.value = 'error';
    return;
  }
  try {
    const res = await api.get(`users/verify-email/${token}`);
    if (res.data?.success) {
      status.value = 'success';
    } else {
      status.value = 'error';
    }
  } catch {
    status.value = 'error';
  }
});
</script>

<style scoped>
.verify-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #f8fbff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.verify-card {
  background: white;
  border-radius: 24px;
  padding: 56px 48px;
  box-shadow: 0 20px 60px rgba(15, 42, 95, 0.14);
  max-width: 480px;
  width: 100%;
  text-align: center;
}

@media (max-width: 480px) {
  .verify-card { padding: 36px 24px; }
}

.state-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.spinner {
  width: 52px;
  height: 52px;
  border: 4px solid #dbeafe;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin { to { transform: rotate(360deg); } }

.state-label {
  font-size: 17px;
  color: #64748b;
}

.icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.icon-circle.success {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
}

.icon-circle.error {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
}

.state-icon {
  width: 36px;
  height: 36px;
}

.icon-circle.success .state-icon { color: #059669; }
.icon-circle.error .state-icon { color: #dc2626; }

.state-heading {
  font-size: 28px;
  font-weight: 800;
  color: #0f2a5f;
  margin-bottom: 12px;
}

.state-body {
  font-size: 16px;
  color: #475569;
  line-height: 1.6;
  max-width: 340px;
  margin-bottom: 8px;
}

.state-hint {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.6;
  max-width: 340px;
  margin-bottom: 28px;
}

.action-btn {
  display: inline-block;
  padding: 14px 36px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  margin-top: 8px;
  transition: 0.2s;
}

.action-btn.primary {
  background: #2563eb;
  color: white;
}

.action-btn.primary:hover {
  background: #1d4ed8;
}

.action-btn.secondary {
  background: white;
  color: #2563eb;
  border: 2px solid #2563eb;
}

.action-btn.secondary:hover {
  background: #eff6ff;
}
</style>
