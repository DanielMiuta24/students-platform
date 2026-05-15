<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-code">404</div>

        <div class="error-illustration">
          <svg class="w-64 h-64" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="150" r="120" fill="#EBF4FF" opacity="0.5"/>
            <path d="M150 120C150 103.431 163.431 90 180 90H220C236.569 90 250 103.431 250 120V180C250 196.569 236.569 210 220 210H180C163.431 210 150 196.569 150 180V120Z" fill="#3B82F6" opacity="0.2"/>
            <circle cx="180" cy="140" r="15" fill="#1E40AF"/>
            <circle cx="220" cy="140" r="15" fill="#1E40AF"/>
            <path d="M170 175C170 175 180 165 200 165C220 165 230 175 230 175" stroke="#1E40AF" stroke-width="4" stroke-linecap="round"/>
            <path d="M120 80L140 60M280 80L260 60M100 150L80 140M300 150L320 140M120 220L140 240M280 220L260 240" stroke="#93C5FD" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>

        <h1 class="error-title">Page Not Found</h1>

        <p class="error-description">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div class="error-actions">
          <router-link to="/">
            <el-button type="primary" size="large">
              <el-icon style="margin-right: 8px;">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M896 512a384 384 0 1 0-768 0 384 384 0 0 0 768 0zm64 0a448 448 0 1 1-896 0 448 448 0 0 1 896 0z"/>
                  <path fill="currentColor" d="M724.16 368.64L544 548.8V288a32 32 0 1 0-64 0v260.8L299.84 368.64a32 32 0 1 0-45.248 45.248l272 272a32 32 0 0 0 45.248 0l272-272a32 32 0 0 0-45.248-45.248z"/>
                </svg>
              </el-icon>
              Go to Home
            </el-button>
          </router-link>

          <el-button size="large" @click="goBack" class="secondary-button">
            <el-icon style="margin-right: 8px;">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"/>
                <path fill="currentColor" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"/>
              </svg>
            </el-icon>
            Go Back
          </el-button>
        </div>

        <div class="helpful-links">
          <h3 class="helpful-title">Helpful Links</h3>
          <div class="links-grid">
            <router-link to="/universities" class="help-link">
              <svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Universities</span>
            </router-link>

            <router-link to="/scholarships" class="help-link">
              <svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Scholarships</span>
            </router-link>

            <router-link to="/community" class="help-link">
              <svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Community</span>
            </router-link>

            <router-link to="/feed" class="help-link">
              <svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span>Feed</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};
</script>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 45%, #bfdbfe 100%);
  padding: 2rem 1rem;
}

.not-found-container {
  max-width: 800px;
  width: 100%;
}

.not-found-content {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  padding: 3rem 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

@media (min-width: 768px) {
  .not-found-content {
    padding: 4rem 3rem;
  }
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #0f2a5f 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .error-code {
    font-size: 10rem;
  }
}

.error-illustration {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.error-illustration svg {
  width: 200px;
  height: 200px;
}

@media (min-width: 768px) {
  .error-illustration svg {
    width: 256px;
    height: 256px;
  }
}

.error-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .error-title {
    font-size: 2.5rem;
  }
}

.error-description {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

@media (min-width: 640px) {
  .error-actions {
    flex-direction: row;
  }
}

.error-actions .el-button {
  min-width: 160px;
}

.secondary-button {
  background: white !important;
  border: 2px solid #2563eb !important;
  color: #2563eb !important;
}

.secondary-button:hover {
  background: #2563eb !important;
  color: white !important;
}

.helpful-links {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.helpful-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .links-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.help-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 1rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  text-decoration: none;
  color: #4b5563;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  font-size: 0.875rem;
}

.help-link:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
  border-color: #2563eb;
  color: #2563eb;
}

.link-icon {
  width: 28px;
  height: 28px;
}

@media (min-width: 640px) {
  .link-icon {
    width: 32px;
    height: 32px;
  }
}
</style>
