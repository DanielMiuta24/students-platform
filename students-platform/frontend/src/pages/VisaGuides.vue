<template>
  <div class="page-wrapper">
    <!-- Page Header -->
    <section class="page-header">
      <div class="header-inner">
        <h1 class="page-title">Visa and Immigration Guides</h1>
        <p class="page-subtitle">Step-by-step guides written by students who have been through the process</p>
      </div>
    </section>

    <!-- Filter Bar -->
    <section class="filter-section">
      <div class="filter-inner">
        <el-input
          v-model="filters.country"
          placeholder="Search by country..."
          clearable
          class="filter-input"
          @change="handleSearch"
        />
        <el-select v-model="filters.type" placeholder="Visa Type" clearable class="filter-select" @change="handleSearch">
          <el-option label="All Types" value="" />
          <el-option label="Student Visa" value="student_visa" />
          <el-option label="Residence Permit" value="residence_permit" />
          <el-option label="Work Permit" value="work_permit" />
          <el-option label="Job Seeker Visa" value="job_seeker_visa" />
          <el-option label="Settlement Permit" value="settlement_permit" />
        </el-select>
        <el-button type="primary" @click="handleSearch" class="search-btn">Search</el-button>
      </div>
    </section>

    <!-- Results -->
    <section class="results-section">
      <div class="results-inner">
        <!-- Loading -->
        <div v-if="loading" class="state-center">
          <el-skeleton :rows="4" animated />
        </div>

        <!-- Error -->
        <el-alert
          v-else-if="error"
          :title="error"
          type="error"
          show-icon
          :closable="false"
          class="mb-6"
        />

        <!-- Empty -->
        <el-empty
          v-else-if="!loading && guides.length === 0"
          description="No visa guides found. Try adjusting your filters."
        />

        <!-- Cards -->
        <div v-else class="results-list">
          <div
            v-for="guide in guides"
            :key="guide.id"
            class="guide-card"
          >
            <div class="guide-header" @click="toggleGuide(guide.id)">
              <div class="guide-header-left">
                <span v-if="guide.flagEmoji" class="flag">{{ guide.flagEmoji }}</span>
                <div>
                  <div class="guide-country-row">
                    <span class="guide-country">{{ guide.country }}</span>
                    <el-tag :type="visaTagType(guide.visaType)" size="small" class="visa-tag">
                      {{ formatVisaType(guide.visaType) }}
                    </el-tag>
                  </div>
                  <h3 class="guide-title">{{ guide.title }}</h3>
                  <p v-if="guide.description" class="guide-desc">{{ truncate(guide.description, 140) }}</p>
                  <p class="guide-steps-count">{{ guide.steps?.length || 0 }} steps</p>
                </div>
              </div>
              <button class="expand-btn" :class="{ 'expanded': expandedGuides.has(guide.id) }">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>

            <!-- Expanded Steps -->
            <div v-show="expandedGuides.has(guide.id)" class="steps-panel">
              <div
                v-for="(step, idx) in guide.steps"
                :key="idx"
                class="step-item"
              >
                <div class="step-number">{{ step.order || idx + 1 }}</div>
                <div class="step-body">
                  <h4 class="step-title">{{ step.title }}</h4>
                  <p class="step-description">{{ step.description }}</p>

                  <div v-if="step.documents && step.documents.length > 0" class="docs-block">
                    <p class="docs-label">Required documents:</p>
                    <ul class="docs-list">
                      <li v-for="(doc, dIdx) in step.documents" :key="dIdx">{{ doc }}</li>
                    </ul>
                  </div>

                  <div v-if="step.tips" class="tips-block">
                    <span class="tips-icon">💡</span>
                    <span class="tips-text">{{ step.tips }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface VisaStep {
  order?: number
  title: string
  description: string
  documents?: string[]
  tips?: string
}

interface VisaGuide {
  id: string
  country: string
  flagEmoji?: string
  visaType: string
  title: string
  description?: string
  steps?: VisaStep[]
}

const guides = ref<VisaGuide[]>([])
const loading = ref(false)
const error = ref('')
const expandedGuides = ref<Set<string>>(new Set())

const filters = reactive({
  country: '',
  type: '',
})

const formatVisaType = (type: string): string => {
  const map: Record<string, string> = {
    student_visa: 'Student Visa',
    residence_permit: 'Residence Permit',
    work_permit: 'Work Permit',
    job_seeker_visa: 'Job Seeker Visa',
    settlement_permit: 'Settlement Permit',
  }
  return map[type] || type
}

const visaTagType = (type: string): '' | 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    student_visa: '',
    residence_permit: 'success',
    work_permit: 'warning',
    job_seeker_visa: 'info',
    settlement_permit: 'danger',
  }
  return map[type] || 'info'
}

const truncate = (text: string, len: number): string =>
  text.length > len ? text.slice(0, len) + '...' : text

const toggleGuide = (id: string) => {
  const next = new Set(expandedGuides.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  expandedGuides.value = next
}

const fetchGuides = async () => {
  loading.value = true
  error.value = ''
  try {
    const params = new URLSearchParams()
    if (filters.country) params.set('country', filters.country)
    if (filters.type) params.set('type', filters.type)

    const res = await fetch(`${API}/visa?${params}`, { credentials: 'include' })
    if (!res.ok) throw new Error('Failed to load visa guides')
    const data = await res.json()
    guides.value = data.guides || data.items || data || []
  } catch (e: any) {
    error.value = e.message || 'Failed to load visa guides. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  fetchGuides()
}

onMounted(fetchGuides)
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: #f8fbff;
  padding-bottom: 80px;
}

.page-header {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 45%, #bfdbfe 100%);
  padding: 56px 24px 48px;
}

.header-inner {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f2a5f;
  margin: 0 0 12px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #475569;
  margin: 0;
}

.filter-section {
  background: white;
  border-bottom: 1px solid #e5efff;
  padding: 20px 24px;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 12px rgba(15, 42, 95, 0.06);
}

.filter-inner {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.filter-input {
  flex: 1;
  min-width: 180px;
}

.filter-select {
  width: 200px;
}

.search-btn {
  background: #2563eb;
  border-color: #2563eb;
}

.search-btn:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.results-section {
  padding: 32px 24px;
}

.results-inner {
  max-width: 800px;
  margin: 0 auto;
}

.mb-6 {
  margin-bottom: 24px;
}

.state-center {
  padding: 40px 0;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guide-card {
  border-radius: 16px;
  border: 1px solid #e5efff;
  box-shadow: 0 8px 24px rgba(15, 42, 95, 0.08);
  background: white;
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.guide-card:hover {
  box-shadow: 0 14px 32px rgba(15, 42, 95, 0.14);
}

.guide-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 20px 20px;
  cursor: pointer;
  user-select: none;
}

.guide-header:hover {
  background: #f8fbff;
}

.guide-header-left {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  flex: 1;
}

.flag {
  font-size: 2rem;
  line-height: 1;
  margin-top: 2px;
  flex-shrink: 0;
}

.guide-country-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.guide-country {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2563eb;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.visa-tag {
  flex-shrink: 0;
}

.guide-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f2a5f;
  margin: 0 0 6px;
  line-height: 1.4;
}

.guide-desc {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 8px;
  line-height: 1.5;
}

.guide-steps-count {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0;
}

.expand-btn {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e5efff;
  background: white;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, transform 0.2s ease, color 0.15s ease;
  margin-top: 4px;
}

.expand-btn:hover {
  background: #eff6ff;
  color: #2563eb;
}

.expand-btn.expanded {
  transform: rotate(180deg);
  background: #eff6ff;
  color: #2563eb;
}

.steps-panel {
  border-top: 1px solid #e5efff;
  padding: 4px 0 12px;
  background: #f8fbff;
}

.step-item {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #e5efff;
}

.step-item:last-child {
  border-bottom: none;
}

.step-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.step-body {
  flex: 1;
}

.step-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f2a5f;
  margin: 0 0 6px;
}

.step-description {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 10px;
}

.docs-block {
  margin-bottom: 10px;
}

.docs-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.docs-list {
  margin: 0;
  padding-left: 18px;
  list-style: disc;
}

.docs-list li {
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 2px;
}

.tips-block {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 8px 12px;
}

.tips-icon {
  font-size: 0.95rem;
  flex-shrink: 0;
}

.tips-text {
  font-size: 0.85rem;
  color: #92400e;
  line-height: 1.5;
}
</style>
