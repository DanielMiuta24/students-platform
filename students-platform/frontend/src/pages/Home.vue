<template>
  <main class="home-page pb-32">

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container hero-container">

        <div class="hero-content">
          <p class="hero-badge">🌍 Students Supporting Students — Worldwide</p>

          <h1>
            Your entire study abroad journey, in one place.
          </h1>

          <p class="hero-text">
            Discover universities and scholarships, connect with students already
            at your target destination, and get practical guidance for every step
            of moving abroad — from visa to housing to your first day of class.
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

          <div class="hero-trust">
            <div class="trust-item">
              <span class="trust-number">20,000+</span>
              <span class="trust-label">Students in our community</span>
            </div>
            <div class="trust-divider"></div>
            <div class="trust-item">
              <span class="trust-number">100+</span>
              <span class="trust-label">Questions answered daily</span>
            </div>
            <div class="trust-divider"></div>
            <div class="trust-item">
              <span class="trust-number">Global</span>
              <span class="trust-label">Every destination</span>
            </div>
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

        <router-link to="/jobs" class="quick-card">
          <div class="quick-icon">💼</div>
          <div>
            <h3>Student Jobs</h3>
            <p>Find internships, working-student and part-time roles near your campus.</p>
          </div>
          <span>›</span>
        </router-link>

      </div>
    </section>

    <!-- Full Feature Grid -->
    <section class="features-section">
      <div class="container">
        <div class="features-header">
          <h2>Everything a student abroad needs</h2>
          <p>Six tools, one platform. Built by students, for students.</p>
        </div>
        <div class="features-grid">

          <router-link to="/events" class="feature-card">
            <div class="feature-icon-wrap feature-icon-blue">🎪</div>
            <div class="feature-body">
              <h3>Events</h3>
              <p>Career fairs, open days, visa workshops, and networking events near you or online.</p>
            </div>
            <span class="feature-arrow">›</span>
          </router-link>

          <router-link to="/jobs" class="feature-card">
            <div class="feature-icon-wrap feature-icon-green">💼</div>
            <div class="feature-body">
              <h3>Job Board</h3>
              <p>Internships, working-student positions, and dual-study programs for international students.</p>
            </div>
            <span class="feature-arrow">›</span>
          </router-link>

          <router-link to="/housing" class="feature-card">
            <div class="feature-icon-wrap feature-icon-orange">🏠</div>
            <div class="feature-body">
              <h3>Housing</h3>
              <p>Rooms, shared flats, and student apartments listed by students and landlords.</p>
            </div>
            <span class="feature-arrow">›</span>
          </router-link>

          <router-link to="/visa" class="feature-card">
            <div class="feature-icon-wrap feature-icon-purple">🛂</div>
            <div class="feature-body">
              <h3>Visa Guides</h3>
              <p>Step-by-step visa and residence permit guides for Germany, UK, Switzerland, Canada, and more.</p>
            </div>
            <span class="feature-arrow">›</span>
          </router-link>

          <router-link to="/skills" class="feature-card">
            <div class="feature-icon-wrap feature-icon-teal">🛠️</div>
            <div class="feature-body">
              <h3>Skills Profile</h3>
              <p>Build an ESCO-mapped skills and language profile to share with employers and universities.</p>
            </div>
            <span class="feature-arrow">›</span>
          </router-link>

          <router-link to="/scholarships" class="feature-card">
            <div class="feature-icon-wrap feature-icon-yellow">🎓</div>
            <div class="feature-body">
              <h3>Global Scholarships</h3>
              <p>DAAD, Erasmus+, Chevening, Fulbright, and 20+ more global funding opportunities.</p>
            </div>
            <span class="feature-arrow">›</span>
          </router-link>

        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="how-section">
      <div class="container">
        <div class="how-header">
          <h2>One platform. Three steps to your future abroad.</h2>
          <p>Everything you need from first search to first day of class.</p>
        </div>
        <div class="how-grid">
          <div class="how-step">
            <div class="how-num">01</div>
            <div class="how-icon">🔍</div>
            <h3>Discover</h3>
            <p>Search universities and scholarships across countries. Filter by nationality, language, field, and deadline. Replace forty browser tabs with one clear answer.</p>
          </div>
          <div class="how-arrow">›</div>
          <div class="how-step">
            <div class="how-num">02</div>
            <div class="how-icon">🤝</div>
            <h3>Connect</h3>
            <p>Join real-time communities and connect directly with students already enrolled at your target university. Get honest, first-hand guidance before you arrive.</p>
          </div>
          <div class="how-arrow">›</div>
          <div class="how-step">
            <div class="how-num">03</div>
            <div class="how-icon">🗺️</div>
            <h3>Navigate</h3>
            <p>Practical guides for every step: visa applications, blocked accounts, health insurance, housing, registration. Written by students who lived it.</p>
          </div>
        </div>
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
                Use the University Search page to search by name or country. Results show the university's name and official website.
              </div>
            </el-collapse-item>

            <el-collapse-item title="What scholarships are available?" name="2">
              <div>
                The platform lists global scholarships including DAAD, Erasmus+, Chevening, Fulbright, and more. Filter by country, academic level, or keyword to find what fits your profile.
              </div>
            </el-collapse-item>

            <el-collapse-item title="How do visa guides work?" name="3">
              <div>
                Each visa guide is a step-by-step checklist with required documents and tips for each stage. Guides currently cover Germany, Switzerland, UK, Netherlands, and Canada.
              </div>
            </el-collapse-item>

            <el-collapse-item title="Can I find student jobs or internships?" name="4">
              <div>
                Yes. The Job Board lists working-student positions, internships, dual-study programs, and part-time roles. You can save listings and apply directly through the employer's link.
              </div>
            </el-collapse-item>

            <el-collapse-item title="How do I contact other students?" name="5">
              <div>
                You can start one-on-one chats or join community groups to ask for advice and exchange information with students already at your target destination.
              </div>
            </el-collapse-item>

            <el-collapse-item title="How do I register?" name="6">
              <div>
                Click the Register button and create an account with your name, email, and password. It is free and takes less than a minute.
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

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

/* Trust bar */
.hero-trust {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 28px;
  flex-wrap: wrap;
}

.trust-item {
  display: flex;
  flex-direction: column;
}

.trust-number {
  font-size: 22px;
  font-weight: 800;
  color: #1d4ed8;
  line-height: 1;
}

.trust-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  margin-top: 3px;
}

.trust-divider {
  width: 1px;
  height: 36px;
  background: #cbd5e1;
}

/* How it works */
.how-section {
  background: #f8fbff;
  padding: 80px 0;
}

.how-header {
  text-align: center;
  margin-bottom: 56px;
}

.how-header h2 {
  font-size: 38px;
  font-weight: 800;
  color: #0f2a5f;
  margin-bottom: 12px;
}

.how-header p {
  font-size: 17px;
  color: #64748b;
}

.how-grid {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
}

.how-step {
  background: #ffffff;
  border-radius: 20px;
  padding: 36px 28px;
  flex: 1;
  max-width: 300px;
  box-shadow: 0 10px 28px rgba(15, 42, 95, 0.09);
  border: 1px solid #e5efff;
  text-align: center;
}

.how-num {
  font-size: 13px;
  font-weight: 800;
  color: #93c5fd;
  letter-spacing: 0.1em;
  margin-bottom: 14px;
}

.how-icon {
  font-size: 38px;
  margin-bottom: 16px;
}

.how-step h3 {
  font-size: 21px;
  font-weight: 800;
  color: #0f2a5f;
  margin-bottom: 12px;
}

.how-step p {
  color: #64748b;
  font-size: 15px;
  line-height: 1.7;
}

.how-arrow {
  font-size: 36px;
  color: #bfdbfe;
  margin-top: 80px;
  flex-shrink: 0;
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
  grid-template-columns: repeat(4, 1fr);
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

/* Features grid */
.features-section {
  background: #ffffff;
  padding: 80px 0 90px;
}

.features-header {
  text-align: center;
  margin-bottom: 52px;
}

.features-header h2 {
  font-size: 38px;
  font-weight: 800;
  color: #0f2a5f;
  margin-bottom: 12px;
}

.features-header p {
  font-size: 17px;
  color: #64748b;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background: #f8fbff;
  border-radius: 20px;
  padding: 28px 24px;
  display: flex;
  align-items: flex-start;
  gap: 18px;
  text-decoration: none;
  color: inherit;
  border: 1px solid #e5efff;
  transition: 0.2s ease;
  position: relative;
}

.feature-card:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(15, 42, 95, 0.1);
}

.feature-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
}

.feature-icon-blue   { background: #dbeafe; }
.feature-icon-green  { background: #dcfce7; }
.feature-icon-orange { background: #ffedd5; }
.feature-icon-purple { background: #ede9fe; }
.feature-icon-teal   { background: #ccfbf1; }
.feature-icon-yellow { background: #fef9c3; }

.feature-body {
  flex: 1;
}

.feature-body h3 {
  font-size: 17px;
  font-weight: 700;
  color: #0f2a5f;
  margin-bottom: 6px;
}

.feature-body p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.feature-arrow {
  font-size: 24px;
  color: #93c5fd;
  align-self: center;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }

  .features-header h2 {
    font-size: 26px;
  }
}

/* FAQ */
.faq-section {
  background: linear-gradient(135deg, #f8fbff 0%, #eff6ff 100%);
  padding: 80px 0;
}

.faq-container {
  display: grid;
  grid-template-columns: 0.7fr 1.3fr;
  gap: 48px;
  align-items: start;
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
    grid-template-columns: repeat(2, 1fr);
  }

  .how-grid {
    flex-direction: column;
    align-items: center;
  }

  .how-arrow {
    margin-top: 0;
    transform: rotate(90deg);
  }

  .how-step {
    max-width: 100%;
    width: 100%;
  }

  .hero-image-card {
    order: -1;
  }

  .faq-container {
    grid-template-columns: 1fr;
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