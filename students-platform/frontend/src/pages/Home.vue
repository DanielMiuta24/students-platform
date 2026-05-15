<template>
  <main class="home-page pb-32">

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container hero-container">

        <div class="hero-content">
          <p class="hero-badge">Study abroad made easier</p>

          <h1>
            Find scholarships, universities, and support in one place.
          </h1>

          <p class="hero-text">
            International Student Compass helps you discover study opportunities,
            compare universities, and connect with a supportive community.
          </p>

          <div class="hero-actions">
            <router-link to="/universities">
              <el-button type="primary" size="large">
                <el-icon style="margin-right: 8px;"><Search /></el-icon>
                Search Universities
              </el-button>
            </router-link>

            <router-link to="/scholarships">
              <el-button size="large" class="secondary-button">
                Find Scholarships
              </el-button>
            </router-link>
          </div>
        </div>

        <div class="hero-image-card">
          <div class="hero-illustration"></div>
        </div>

      </div>
    </section>

    <!-- Quick Links Cards -->
    <section class="quick-links-section">
      <div class="container quick-links-grid">

        <router-link to="/universities" class="quick-card">
          <div class="quick-icon">🏛️</div>
          <div>
            <h3>Search Universities</h3>
            <p>Explore universities worldwide and find the best fit for you.</p>
          </div>
          <span>›</span>
        </router-link>

        <router-link to="/scholarships" class="quick-card">
          <div class="quick-icon">🎓</div>
          <div>
            <h3>Find Scholarships</h3>
            <p>Discover scholarships that match your profile and goals.</p>
          </div>
          <span>›</span>
        </router-link>

        <router-link to="/community" class="quick-card">
          <div class="quick-icon">👥</div>
          <div>
            <h3>Join Community</h3>
            <p>Ask questions, share advice, and connect with students.</p>
          </div>
          <span>›</span>
        </router-link>

      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container faq-container">

        <div class="faq-intro">
          <h2>Frequently Asked Questions</h2>
          <p>Find quick answers to common questions.</p>
        </div>

        <div class="faq-card">
          <el-collapse expand-icon-position="right">
            <el-collapse-item title="How can I find universities in a specific country?" name="1">
              <div>
                You can search for universities by name or country using the dedicated University Search page.
              </div>
            </el-collapse-item>

            <el-collapse-item title="What information is available for each university?" name="2">
              <div>
                Search results show the university's name and official website. Clicking on a result takes you to more details.
              </div>
            </el-collapse-item>

            <el-collapse-item title="Can I save universities to view later?" name="3">
              <div>
                Yes, logged-in users can save favorite universities, scholarships, and courses to their personal profile.
              </div>
            </el-collapse-item>

            <el-collapse-item title="How do I contact other students?" name="4">
              <div>
                You can start one-on-one chats with other students to ask for advice and exchange information.
              </div>
            </el-collapse-item>

            <el-collapse-item title="Can I post questions to the community?" name="5">
              <div>
                Yes, logged-in users can post threads, questions, and replies in the community section.
              </div>
            </el-collapse-item>

            <el-collapse-item title="How do I register?" name="6">
              <div>
                Click the Register button and create an account with your name, email, and password.
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div class="faq-image"></div>

      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
</script>

<style scoped>
.home-page {
  background: #ffffff;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

/* Hero */
.hero-section {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 45%, #bfdbfe 100%);
  padding: 90px 0 70px;
}

.hero-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: center;
}

.hero-badge {
  display: inline-block;
  background: #dbeafe;
  color: #2563eb;
  font-weight: 700;
  padding: 8px 18px;
  border-radius: 999px;
  margin-bottom: 20px;
}

.hero-content h1 {
  font-size: 54px;
  line-height: 1.1;
  color: #0f2a5f;
  font-weight: 800;
  margin-bottom: 24px;
}

.hero-text {
  color: #475569;
  font-size: 18px;
  line-height: 1.8;
  max-width: 560px;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
}

.hero-actions a {
  flex: 1 1 auto;
  min-width: 200px;
  text-decoration: none;
}

.hero-actions .el-button {
  width: 100%;
  white-space: nowrap;
}

.secondary-button {
  color: #2563eb;
  border-color: #2563eb;
  font-weight: 700;
}

/* Replace this background image with your generated hero image */
.hero-image-card {
  background: rgba(255, 255, 255, 0.65);
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.18);
}

.hero-illustration {
  min-height: 360px;
  aspect-ratio: 1188 / 756;
  border-radius: 22px;
  background:
    linear-gradient(rgba(239, 246, 255, 0.2), rgba(239, 246, 255, 0.2)),
    url("../images/students-hero.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* Quick cards */
.quick-links-section {
  background: #ffffff;
  padding: 32px 0 70px;
  margin-top: -42px;
  position: relative;
  z-index: 2;
}

.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.quick-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 26px;
  display: flex;
  align-items: center;
  gap: 18px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 12px 30px rgba(15, 42, 95, 0.1);
  border: 1px solid #e5efff;
  transition: 0.2s ease;
}

.quick-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 35px rgba(15, 42, 95, 0.16);
}

.quick-icon {
  width: 64px;
  height: 64px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.quick-card h3 {
  color: #0f2a5f;
  font-size: 20px;
  margin-bottom: 8px;
}

.quick-card p {
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

.quick-card span {
  margin-left: auto;
  color: #2563eb;
  font-size: 32px;
}

/* FAQ */
.faq-section {
  background: linear-gradient(135deg, #f8fbff 0%, #eff6ff 100%);
  padding: 80px 0;
}

.faq-container {
  display: grid;
  grid-template-columns: 0.8fr 1.4fr 0.8fr;
  gap: 40px;
  align-items: center;
}

.faq-intro h2 {
  color: #0f2a5f;
  font-size: 38px;
  line-height: 1.2;
  margin-bottom: 16px;
}

.faq-intro p {
  color: #64748b;
  font-size: 16px;
}

.faq-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 12px 30px rgba(15, 42, 95, 0.1);
}

.faq-image {
  min-height: 280px;
  aspect-ratio: 800 / 628;
  background: url("../images/faq-girl.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

/* Element Plus small polish */
:deep(.el-button--primary) {
  background-color: #2563eb;
  border-color: #2563eb;
  font-weight: 700;
}

:deep(.el-button--primary:hover) {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

:deep(.el-collapse) {
  border: none;
  gap: 12px;
  display: flex;
  flex-direction: column;
}

:deep(.el-collapse-item) {
  border: 1px solid #e5efff;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
}

:deep(.el-collapse-item:hover) {
  border-color: #bfdbfe;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
}

:deep(.el-collapse-item__header) {
  font-weight: 600;
  color: #0f2a5f;
  font-size: 16px;
  padding: 18px 20px;
  background: #f8fbff;
  border: none;
  transition: background 0.2s ease;
}

:deep(.el-collapse-item__header:hover) {
  background: #eff6ff;
}

:deep(.el-collapse-item.is-active .el-collapse-item__header) {
  background: #eff6ff;
  border-bottom: 1px solid #e5efff;
}

:deep(.el-collapse-item__wrap) {
  border: none;
  background: #ffffff;
}

:deep(.el-collapse-item__content) {
  color: #64748b;
  line-height: 1.7;
  padding: 18px 20px;
  font-size: 15px;
}

/* Responsive */
@media (max-width: 900px) {
  .hero-container,
  .faq-container {
    grid-template-columns: 1fr;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }

  .quick-links-grid {
    grid-template-columns: 1fr;
  }

  .hero-image-card {
    order: -1;
  }

  .faq-image {
    display: none;
  }
}

@media (min-width: 640px) and (max-width: 900px) {
  .quick-links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .hero-content h1 {
    font-size: 1.875rem;
  }

  .hero-text {
    font-size: 0.9375rem;
  }

  .quick-card {
    flex-direction: column;
    text-align: center;
  }

  .quick-card span {
    display: none;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .hero-section {
    padding: 3rem 0 2.5rem;
  }

  .hero-container {
    gap: 2rem;
    text-align: center;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hero-badge {
    font-size: 0.875rem;
    padding: 0.375rem 0.875rem;
  }

  .hero-content h1 {
    font-size: 2rem;
    text-align: center;
    line-height: 1.2;
  }

  .hero-text {
    font-size: 1rem;
    text-align: center;
    max-width: 100%;
    line-height: 1.6;
  }

  .hero-actions {
    justify-content: center;
    width: 100%;
    flex-direction: column;
  }

  .hero-actions a {
    width: 100%;
  }

  .hero-actions .el-button {
    width: 100%;
  }

  .hero-image-card {
    padding: 1rem;
  }

  .hero-illustration {
    min-height: 15rem;
  }

  .quick-links-section {
    padding: 1.5rem 0 3rem;
    margin-top: -2rem;
  }

  .quick-links-grid {
    gap: 1rem;
  }

  .quick-card {
    padding: 1.25rem;
    gap: 0.875rem;
    flex-direction: row;
  }

  .quick-icon {
    width: 3.25rem;
    height: 3.25rem;
    font-size: 1.5rem;
  }

  .quick-card h3 {
    font-size: 1.125rem;
  }

  .quick-card p {
    font-size: 0.875rem;
  }

  .faq-section {
    padding: 3.75rem 0;
  }

  .faq-container {
    gap: 1.75rem;
    text-align: center;
  }

  .faq-intro h2 {
    font-size: 1.75rem;
  }

  .faq-intro p {
    font-size: 0.9375rem;
  }

  .faq-card {
    padding: 1rem;
  }

  .faq-image {
    min-height: 12.5rem;
  }

  :deep(.el-collapse-item__header) {
    font-size: 0.9375rem;
    padding: 1rem 1.125rem;
  }

  :deep(.el-collapse-item__content) {
    font-size: 0.875rem;
    padding: 1rem 1.125rem;
  }
}

@media (max-width: 375px) {
  .container {
    padding: 0 0.75rem;
  }

  .hero-section {
    padding: 2.5rem 0 2rem;
  }

  .hero-container {
    gap: 1.5rem;
  }

  .hero-content h1 {
    font-size: 1.625rem;
    line-height: 1.2;
  }

  .hero-text {
    font-size: 0.9375rem;
    line-height: 1.5;
  }

  .hero-illustration {
    min-height: 12.5rem;
  }

  .quick-card {
    padding: 1rem;
    gap: 0.75rem;
  }

  .quick-icon {
    width: 3rem;
    height: 3rem;
    font-size: 1.375rem;
  }

  .quick-card h3 {
    font-size: 1rem;
  }

  .quick-card p {
    font-size: 0.8125rem;
    line-height: 1.4;
  }

  .quick-card span {
    font-size: 1.75rem;
  }

  .faq-intro h2 {
    font-size: 1.5rem;
  }

  .faq-intro p {
    font-size: 0.875rem;
  }

  .faq-card {
    padding: 0.75rem;
  }

  :deep(.el-collapse-item__header) {
    font-size: 0.875rem;
    padding: 0.875rem 1rem;
  }

  :deep(.el-collapse-item__content) {
    font-size: 0.8125rem;
    padding: 0.875rem 1rem;
    line-height: 1.6;
  }
}
</style>