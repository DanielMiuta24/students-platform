<template>
  <div class="report-problem-page">
    <div class="report-problem-container">
      <div class="report-problem-content">
        <!-- Header -->
        <div class="page-header">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
          </div>
          <h1 class="page-title">Report a Problem</h1>
          <p class="page-description">
            We're here to help. Let us know about any issues you're experiencing, and we'll work to resolve them as quickly as possible.
          </p>
        </div>

        <!-- Form Card -->
        <div class="form-card">
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-position="top"
            class="report-form"
            @submit.prevent="handleSubmit"
          >
            <!-- Problem Type -->
            <el-form-item label="Problem Type" prop="problemType">
              <el-select
                v-model="form.problemType"
                placeholder="Select the type of problem"
                size="large"
                class="full-width"
              >
                <el-option label="Technical Issue" value="technical" />
                <el-option label="Account Problem" value="account" />
                <el-option label="Content Issue" value="content" />
                <el-option label="Search Not Working" value="search" />
                <el-option label="Community Issue" value="community" />
                <el-option label="Bug Report" value="bug" />
                <el-option label="Feature Request" value="feature" />
                <el-option label="Other" value="other" />
              </el-select>
            </el-form-item>

            <!-- Subject -->
            <el-form-item label="Subject" prop="subject">
              <el-input
                v-model="form.subject"
                placeholder="Brief description of the problem"
                size="large"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>

            <!-- Description -->
            <el-form-item label="Description" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                placeholder="Please provide detailed information about the problem. Include what you were doing when the issue occurred and any error messages you saw."
                :rows="8"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>

            <!-- Email -->
            <el-form-item label="Contact Email" prop="email">
              <el-input
                v-model="form.email"
                type="email"
                placeholder="your.email@example.com"
                size="large"
              >
                <template #prefix>
                  <el-icon><Message /></el-icon>
                </template>
              </el-input>
              <div class="form-hint">
                We'll use this email to follow up on your report
              </div>
            </el-form-item>

            <!-- Priority -->
            <el-form-item label="Priority Level" prop="priority">
              <el-radio-group v-model="form.priority" class="priority-group">
                <el-radio value="low" border>
                  <span class="priority-label">
                    <span class="priority-dot low"></span>
                    <span class="priority-text">Low<span class="priority-desc"> - Minor issue</span></span>
                  </span>
                </el-radio>
                <el-radio value="medium" border>
                  <span class="priority-label">
                    <span class="priority-dot medium"></span>
                    <span class="priority-text">Medium<span class="priority-desc"> - Affects use</span></span>
                  </span>
                </el-radio>
                <el-radio value="high" border>
                  <span class="priority-label">
                    <span class="priority-dot high"></span>
                    <span class="priority-text">High<span class="priority-desc"> - Cannot use</span></span>
                  </span>
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- Submit Button -->
            <div class="form-actions">
              <el-button
                type="primary"
                size="large"
                native-type="submit"
                :loading="submitting"
                class="submit-button"
              >
                <el-icon v-if="!submitting" style="margin-right: 8px;"><Promotion /></el-icon>
                {{ submitting ? 'Submitting...' : 'Submit Report' }}
              </el-button>
              <router-link to="/">
                <el-button size="large" class="cancel-button">
                  Cancel
                </el-button>
              </router-link>
            </div>
          </el-form>
        </div>

        <!-- Help Section -->
        <div class="help-section">
          <div class="help-card">
            <div class="help-icon">💡</div>
            <div class="help-content">
              <h3>Quick Tips</h3>
              <ul>
                <li>Be as specific as possible when describing the problem</li>
                <li>Include steps to reproduce the issue if applicable</li>
                <li>Mention your browser and device if relevant</li>
                <li>Screenshots can be very helpful (attach via email if needed)</li>
              </ul>
            </div>
          </div>

          <div class="help-card">
            <div class="help-icon">📧</div>
            <div class="help-content">
              <h3>Alternative Contact</h3>
              <p>
                You can also reach us directly at
                <a href="mailto:support@iscompass.de" class="email-link">
                  support@iscompass.de
                </a>
              </p>
              <p class="help-note">
                We typically respond within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Message, Promotion } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';

const formRef = ref<FormInstance>();
const submitting = ref(false);

const form = reactive({
  problemType: '',
  subject: '',
  description: '',
  email: '',
  priority: 'medium'
});

const rules: FormRules = {
  problemType: [
    { required: true, message: 'Please select a problem type', trigger: 'change' }
  ],
  subject: [
    { required: true, message: 'Please enter a subject', trigger: 'blur' },
    { min: 5, max: 100, message: 'Subject should be 5-100 characters', trigger: 'blur' }
  ],
  description: [
    { required: true, message: 'Please provide a description', trigger: 'blur' },
    { min: 20, max: 2000, message: 'Description should be 20-2000 characters', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
  ],
  priority: [
    { required: true, message: 'Please select a priority level', trigger: 'change' }
  ]
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    submitting.value = true;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // TODO: Replace with actual API call
    console.log('Problem report submitted:', form);

    ElMessage.success({
      message: 'Your report has been submitted successfully! We\'ll get back to you soon.',
      duration: 5000
    });

    // Reset form
    formRef.value.resetFields();
    form.priority = 'medium';

  } catch (error) {
    console.error('Validation failed:', error);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.report-problem-page {
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 45%, #bfdbfe 100%);
  padding: 1rem;
}

@media (min-width: 768px) {
  .report-problem-page {
    padding: 2rem 1rem;
  }
}

.report-problem-container {
  max-width: 900px;
  margin: 0 auto;
}

.report-problem-content {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .report-problem-content {
    border-radius: 2rem;
    padding: 3rem 3rem;
  }
}

/* Header */
.page-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .page-header {
    margin-bottom: 2.5rem;
  }
}

.header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  border-radius: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3);
}

.header-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

@media (min-width: 768px) {
  .header-icon {
    width: 80px;
    height: 80px;
    border-radius: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .header-icon svg {
    width: 40px;
    height: 40px;
  }
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .page-title {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }
}

.page-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .page-description {
    font-size: 1.125rem;
  }
}

/* Form Card */
.form-card {
  background: white;
  border-radius: 1rem;
  padding: 1.25rem 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .form-card {
    border-radius: 1.5rem;
    padding: 2.5rem 3rem;
    margin-bottom: 2rem;
  }
}

.report-form :deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.full-width {
  width: 100%;
}

.form-hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

/* Priority Radio Group */
.priority-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

@media (min-width: 640px) {
  .priority-group {
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (min-width: 1024px) {
  .priority-group {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

.priority-group :deep(.el-radio) {
  margin-right: 0;
  width: 100%;
}

@media (min-width: 1024px) {
  .priority-group :deep(.el-radio) {
    width: auto;
    flex: 1;
  }
}

.priority-group :deep(.el-radio.is-bordered) {
  padding: 12px 15px;
}

@media (min-width: 1024px) {
  .priority-group :deep(.el-radio.is-bordered) {
    padding: 12px 10px;
  }
}

.priority-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  white-space: normal;
  line-height: 1.3;
}

@media (min-width: 1024px) {
  .priority-label {
    font-size: 0.8rem;
  }
}

@media (min-width: 1200px) {
  .priority-label {
    font-size: 0.875rem;
  }
}

.priority-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

@media (min-width: 768px) {
  .priority-text {
    flex-direction: row;
    gap: 0.25rem;
  }
}

.priority-desc {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 400;
}

@media (min-width: 1024px) {
  .priority-desc {
    font-size: 0.75rem;
  }
}

@media (min-width: 1200px) {
  .priority-desc {
    font-size: 0.8rem;
  }
}

.priority-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.priority-dot.low {
  background-color: #10b981;
}

.priority-dot.medium {
  background-color: #f59e0b;
}

.priority-dot.high {
  background-color: #ef4444;
}

/* Form Actions */
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

@media (min-width: 640px) {
  .form-actions {
    flex-direction: row;
    justify-content: center;
  }
}

.submit-button {
  width: 100%;
}

@media (min-width: 640px) {
  .submit-button {
    width: auto;
    min-width: 200px;
  }
}

.cancel-button {
  width: 100%;
  background: white !important;
  border: 2px solid #d1d5db !important;
  color: #6b7280 !important;
}

@media (min-width: 640px) {
  .cancel-button {
    width: auto;
    min-width: 140px;
  }
}

.cancel-button:hover {
  border-color: #9ca3af !important;
  color: #374151 !important;
}

/* Help Section */
.help-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .help-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

.help-card {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  transition: all 0.3s ease;
}

@media (min-width: 768px) {
  .help-card {
    border-radius: 1.25rem;
    padding: 1.5rem;
  }
}

.help-card:hover {
  border-color: #2563eb;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.15);
}

.help-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .help-icon {
    font-size: 2rem;
  }
}

.help-content h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .help-content h3 {
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
  }
}

.help-content p {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .help-content p {
    font-size: 0.95rem;
  }
}

.help-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.help-content ul li {
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.5;
  padding-left: 1rem;
  position: relative;
  margin-bottom: 0.4rem;
}

@media (min-width: 768px) {
  .help-content ul li {
    font-size: 0.9rem;
    line-height: 1.6;
    padding-left: 1.25rem;
    margin-bottom: 0.5rem;
  }
}

.help-content ul li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #2563eb;
  font-weight: bold;
}

.email-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.email-link:hover {
  color: #1e40af;
  text-decoration: underline;
}

.help-note {
  font-size: 0.875rem !important;
  font-style: italic;
  color: #9ca3af !important;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .page-title {
    font-size: 1.5rem;
  }

  .page-description {
    font-size: 0.875rem;
  }

  .header-icon {
    width: 60px;
    height: 60px;
  }

  .header-icon svg {
    width: 32px;
    height: 32px;
  }

  .form-actions {
    margin-top: 1.5rem;
  }

  .help-section {
    gap: 1rem;
  }
}
</style>
