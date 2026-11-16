<template>
  <div class="page-wrapper">
    <!-- Page Header -->
    <section class="page-header">
      <div class="header-inner">
        <h1 class="page-title">Events</h1>
        <p class="page-subtitle">Career fairs, open days, visa workshops, and networking events</p>
      </div>
    </section>

    <!-- Filter Bar -->
    <section class="filter-section">
      <div class="filter-inner">
        <el-input
          v-model="filters.search"
          placeholder="Search events..."
          clearable
          class="filter-input"
          @change="handleSearch"
        />
        <el-select v-model="filters.category" placeholder="Category" clearable class="filter-select" @change="handleSearch">
          <el-option label="All Categories" value="" />
          <el-option label="Career Fair" value="career_fair" />
          <el-option label="Open Day" value="open_day" />
          <el-option label="Visa Workshop" value="visa_workshop" />
          <el-option label="Networking" value="networking" />
          <el-option label="Cultural" value="cultural" />
          <el-option label="Other" value="other" />
        </el-select>
        <el-select v-model="filters.status" placeholder="Status" clearable class="filter-select" @change="handleSearch">
          <el-option label="All Statuses" value="" />
          <el-option label="Upcoming" value="upcoming" />
          <el-option label="Ongoing" value="ongoing" />
          <el-option label="Past" value="past" />
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
          v-else-if="!loading && events.length === 0"
          description="No events found. Try adjusting your filters."
        />

        <!-- Cards -->
        <div v-else>
          <div class="results-grid">
            <div
              v-for="event in events"
              :key="event.id"
              class="item-card"
            >
              <div class="card-body">
                <div class="card-tags">
                  <el-tag :type="categoryTagType(event.category)" size="small" class="category-tag">
                    {{ formatCategory(event.category) }}
                  </el-tag>
                  <el-tag
                    :type="event.isOnline ? 'success' : 'info'"
                    size="small"
                  >
                    {{ event.isOnline ? 'Online' : 'In-person' }}
                  </el-tag>
                </div>

                <h3 class="card-title">{{ event.title }}</h3>

                <div class="card-meta">
                  <span class="meta-item">
                    <span class="meta-icon">📅</span>
                    {{ formatDate(event.date) }}
                  </span>
                  <span v-if="event.location" class="meta-item">
                    <span class="meta-icon">📍</span>
                    {{ event.location }}
                  </span>
                  <span v-if="event.organizer" class="meta-item">
                    <span class="meta-icon">🏢</span>
                    {{ event.organizer }}
                  </span>
                  <span v-if="event.attendeeCount != null" class="meta-item">
                    <span class="meta-icon">👥</span>
                    {{ event.attendeeCount }} attending
                  </span>
                </div>
              </div>

              <div class="card-footer">
                <el-button
                  type="primary"
                  size="small"
                  :loading="rsvpLoading[event.id]"
                  :disabled="event.userAttending"
                  @click="rsvpEvent(event)"
                >
                  {{ event.userAttending ? 'RSVP Sent' : 'RSVP' }}
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
              @current-change="fetchEvents"
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

interface Event {
  id: string
  title: string
  date: string
  location?: string
  isOnline?: boolean
  category: string
  organizer?: string
  attendeeCount?: number
  userAttending?: boolean
}

const events = ref<Event[]>([])
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const pageSize = 10
const total = ref(0)
const rsvpLoading = reactive<Record<string, boolean>>({})

const filters = reactive({
  search: '',
  category: '',
  status: '',
})

const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'TBD'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

const formatCategory = (cat: string): string => {
  const map: Record<string, string> = {
    career_fair: 'Career Fair',
    open_day: 'Open Day',
    visa_workshop: 'Visa Workshop',
    networking: 'Networking',
    cultural: 'Cultural',
    other: 'Other',
  }
  return map[cat] || cat
}

const categoryTagType = (cat: string): '' | 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    career_fair: '',
    open_day: 'success',
    visa_workshop: 'warning',
    networking: 'info',
    cultural: 'danger',
    other: 'info',
  }
  return map[cat] || 'info'
}

const fetchEvents = async () => {
  loading.value = true
  error.value = ''
  try {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.category) params.set('category', filters.category)
    if (filters.status) params.set('status', filters.status)
    params.set('page', String(currentPage.value))
    params.set('limit', String(pageSize))

    const res = await fetch(`${API}/events?${params}`, { credentials: 'include' })
    if (!res.ok) throw new Error('Failed to load events')
    const data = await res.json()
    events.value = data.events || data.items || data || []
    total.value = data.total || events.value.length
  } catch (e: any) {
    error.value = e.message || 'Failed to load events. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchEvents()
}

const rsvpEvent = async (event: Event) => {
  rsvpLoading[event.id] = true
  try {
    const res = await fetch(`${API}/events/${event.id}/attend`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.message || 'Failed to RSVP')
    }
    event.userAttending = true
    event.attendeeCount = (event.attendeeCount || 0) + 1
    ElMessage.success('RSVP confirmed!')
  } catch (e: any) {
    ElMessage.error(e.message || 'Please log in to RSVP.')
  } finally {
    rsvpLoading[event.id] = false
  }
}

onMounted(fetchEvents)
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
  max-width: 900px;
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
  max-width: 900px;
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
  width: 180px;
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
  max-width: 900px;
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
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
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
  margin: 0 0 14px;
  line-height: 1.4;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
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
