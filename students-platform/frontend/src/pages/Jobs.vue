<template>
  <div class="page-wrapper">
    <!-- Page Header -->
    <section class="page-header">
      <div class="header-inner">
        <h1 class="page-title">Student Job Board</h1>
        <p class="page-subtitle">Internships, working-student positions, and dual-study programs</p>
      </div>
    </section>

    <!-- Filter Bar -->
    <section class="filter-section">
      <div class="filter-inner">
        <el-input
          v-model="filters.search"
          placeholder="Search jobs, companies..."
          clearable
          class="filter-input"
          @change="handleSearch"
        />
        <el-select v-model="filters.type" placeholder="Job Type" clearable class="filter-select" @change="handleSearch">
          <el-option label="All Types" value="" />
          <el-option label="Full Time" value="full_time" />
          <el-option label="Part Time" value="part_time" />
          <el-option label="Internship" value="internship" />
          <el-option label="Dual Study" value="dual_study" />
          <el-option label="Working Student" value="working_student" />
        </el-select>
        <el-select v-model="filters.mode" placeholder="Work Mode" clearable class="filter-select" @change="handleSearch">
          <el-option label="All Modes" value="" />
          <el-option label="Onsite" value="onsite" />
          <el-option label="Remote" value="remote" />
          <el-option label="Hybrid" value="hybrid" />
        </el-select>
        <el-input
          v-model="filters.country"
          placeholder="Country"
          clearable
          class="filter-country"
          @change="handleSearch"
        />
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
          v-else-if="!loading && jobs.length === 0"
          description="No jobs found. Try adjusting your filters."
        />

        <!-- Cards -->
        <div v-else>
          <div class="results-grid">
            <div
              v-for="job in jobs"
              :key="job.id"
              class="item-card"
            >
              <div class="card-body">
                <div class="card-tags">
                  <el-tag :type="typeTagType(job.type)" size="small">
                    {{ formatJobType(job.type) }}
                  </el-tag>
                  <el-tag :type="modeTagType(job.mode)" size="small">
                    {{ formatMode(job.mode) }}
                  </el-tag>
                </div>

                <h3 class="card-title">{{ job.title }}</h3>
                <p class="card-company">{{ job.company }}</p>

                <div class="card-meta">
                  <span v-if="job.location" class="meta-item">
                    <span class="meta-icon">📍</span>
                    {{ job.location }}
                  </span>
                  <span v-if="job.salaryMin || job.salaryMax" class="meta-item">
                    <span class="meta-icon">💶</span>
                    {{ formatSalary(job.salaryMin, job.salaryMax, job.currency) }}
                  </span>
                  <span v-if="job.postedAt" class="meta-item">
                    <span class="meta-icon">🗓</span>
                    Posted {{ formatDate(job.postedAt) }}
                  </span>
                </div>

                <p v-if="job.description" class="card-desc">{{ truncate(job.description, 120) }}</p>
              </div>

              <div class="card-footer">
                <el-button
                  size="small"
                  :loading="saveLoading[job.id]"
                  :type="job.saved ? 'primary' : 'default'"
                  @click="saveJob(job)"
                >
                  {{ job.saved ? 'Saved' : 'Save' }}
                </el-button>
              </div>
            </div>
          </div>

          <div class="pagination-row">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              layout="prev, pager, next"
              @current-change="fetchJobs"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface Job {
  id: string
  title: string
  company: string
  location?: string
  type: string
  mode: string
  salaryMin?: number
  salaryMax?: number
  currency?: string
  postedAt?: string
  description?: string
  saved?: boolean
}

const jobs = ref<Job[]>([])
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const pageSize = 10
const total = ref(0)
const saveLoading = reactive<Record<string, boolean>>({})

const filters = reactive({
  search: '',
  type: '',
  mode: '',
  country: '',
})

const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const truncate = (text: string, len: number): string =>
  text.length > len ? text.slice(0, len) + '...' : text

const formatJobType = (type: string): string => {
  const map: Record<string, string> = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    internship: 'Internship',
    dual_study: 'Dual Study',
    working_student: 'Working Student',
  }
  return map[type] || type
}

const formatMode = (mode: string): string => {
  const map: Record<string, string> = { onsite: 'Onsite', remote: 'Remote', hybrid: 'Hybrid' }
  return map[mode] || mode
}

const formatSalary = (min?: number, max?: number, currency = 'EUR'): string => {
  if (min && max) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`
  if (min) return `From ${currency} ${min.toLocaleString()}`
  if (max) return `Up to ${currency} ${max.toLocaleString()}`
  return ''
}

const typeTagType = (type: string): '' | 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    full_time: '',
    part_time: 'info',
    internship: 'success',
    dual_study: 'warning',
    working_student: 'info',
  }
  return map[type] || 'info'
}

const modeTagType = (mode: string): '' | 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    onsite: 'info',
    remote: 'success',
    hybrid: 'warning',
  }
  return map[mode] || 'info'
}

const fetchJobs = async () => {
  loading.value = true
  error.value = ''
  try {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.type) params.set('type', filters.type)
    if (filters.mode) params.set('mode', filters.mode)
    if (filters.country) params.set('country', filters.country)
    params.set('page', String(currentPage.value))
    params.set('limit', String(pageSize))

    const res = await fetch(`${API}/jobs?${params}`, { credentials: 'include' })
    if (!res.ok) throw new Error('Failed to load jobs')
    const data = await res.json()
    jobs.value = data.jobs || data.items || data || []
    total.value = data.total || jobs.value.length
  } catch (e: any) {
    error.value = e.message || 'Failed to load jobs. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchJobs()
}

const saveJob = async (job: Job) => {
  saveLoading[job.id] = true
  try {
    const res = await fetch(`${API}/jobs/${job.id}/save`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.message || 'Failed to save')
    }
    job.saved = true
    ElMessage.success('Job saved!')
  } catch (e: any) {
    ElMessage.error(e.message || 'Please log in to save jobs.')
  } finally {
    saveLoading[job.id] = false
  }
}

onMounted(fetchJobs)
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
  max-width: 960px;
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
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.filter-input {
  flex: 2;
  min-width: 180px;
}

.filter-select {
  width: 160px;
}

.filter-country {
  width: 140px;
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
  max-width: 960px;
  margin: 0 auto;
}

.mb-6 {
  margin-bottom: 24px;
}

.state-center {
  padding: 40px 0;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 20px;
}

.item-card {
  border-radius: 16px;
  border: 1px solid #e5efff;
  box-shadow: 0 8px 24px rgba(15, 42, 95, 0.08);
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(15, 42, 95, 0.14);
}

.card-body {
  padding: 20px 20px 16px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f2a5f;
  margin: 0 0 4px;
  line-height: 1.4;
}

.card-company {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2563eb;
  margin: 0 0 12px;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 12px;
}

.meta-item {
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-icon {
  font-size: 0.9rem;
}

.card-desc {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

.card-footer {
  padding: 12px 20px 16px;
  border-top: 1px solid #eff6ff;
  display: flex;
  justify-content: flex-end;
}

.pagination-row {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>
