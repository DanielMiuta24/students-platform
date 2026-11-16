<template>
  <div class="page-wrapper">
    <!-- Page Header -->
    <section class="page-header">
      <div class="header-inner">
        <h1 class="page-title">Student Housing</h1>
        <p class="page-subtitle">Rooms, shared flats, and student apartments near universities</p>
      </div>
    </section>

    <!-- Filter Bar -->
    <section class="filter-section">
      <div class="filter-inner">
        <el-input
          v-model="filters.search"
          placeholder="Search housing listings..."
          clearable
          class="filter-input"
          @change="handleSearch"
        />
        <el-select v-model="filters.type" placeholder="Housing Type" clearable class="filter-select" @change="handleSearch">
          <el-option label="All Types" value="" />
          <el-option label="Room" value="room" />
          <el-option label="Apartment" value="apartment" />
          <el-option label="Studio" value="studio" />
          <el-option label="Shared Flat" value="shared_flat" />
          <el-option label="Homestay" value="homestay" />
        </el-select>
        <el-input
          v-model.number="filters.maxPrice"
          placeholder="Max price/month"
          clearable
          type="number"
          class="filter-price"
          @change="handleSearch"
        />
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
          v-else-if="!loading && listings.length === 0"
          description="No housing listings found. Try adjusting your filters."
        />

        <!-- Cards -->
        <div v-else>
          <div class="results-grid">
            <div
              v-for="listing in listings"
              :key="listing.id"
              class="item-card"
            >
              <div class="card-body">
                <div class="card-tags">
                  <el-tag :type="housingTagType(listing.type)" size="small">
                    {{ formatHousingType(listing.type) }}
                  </el-tag>
                  <el-tag v-if="listing.furnished" type="success" size="small">Furnished</el-tag>
                </div>

                <h3 class="card-title">{{ listing.title }}</h3>

                <div class="price-row" v-if="listing.amount">
                  <span class="price-amount">{{ formatPrice(listing.amount, listing.currency) }}</span>
                  <span class="price-period">/month</span>
                </div>

                <div class="card-meta">
                  <span v-if="listing.city || listing.country" class="meta-item">
                    <span class="meta-icon">📍</span>
                    {{ [listing.city, listing.country].filter(Boolean).join(', ') }}
                  </span>
                  <span v-if="listing.availableFrom" class="meta-item">
                    <span class="meta-icon">📅</span>
                    Available from {{ formatDate(listing.availableFrom) }}
                  </span>
                </div>

                <p v-if="listing.description" class="card-desc">{{ truncate(listing.description, 120) }}</p>
              </div>

              <div class="card-footer">
                <el-button
                  size="small"
                  :loading="saveLoading[listing.id]"
                  :type="listing.saved ? 'primary' : 'default'"
                  @click="saveListing(listing)"
                >
                  {{ listing.saved ? 'Saved' : 'Save' }}
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
              @current-change="fetchListings"
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

interface HousingListing {
  id: string
  title: string
  type: string
  amount?: number
  currency?: string
  city?: string
  country?: string
  furnished?: boolean
  availableFrom?: string
  description?: string
  saved?: boolean
}

const listings = ref<HousingListing[]>([])
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const pageSize = 10
const total = ref(0)
const saveLoading = reactive<Record<string, boolean>>({})

const filters = reactive({
  search: '',
  type: '',
  maxPrice: '' as number | '',
  country: '',
})

const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const truncate = (text: string, len: number): string =>
  text.length > len ? text.slice(0, len) + '...' : text

const formatHousingType = (type: string): string => {
  const map: Record<string, string> = {
    room: 'Room',
    apartment: 'Apartment',
    studio: 'Studio',
    shared_flat: 'Shared Flat',
    homestay: 'Homestay',
  }
  return map[type] || type
}

const formatPrice = (amount: number, currency = 'EUR'): string =>
  `${currency} ${amount.toLocaleString()}`

const housingTagType = (type: string): '' | 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    room: 'info',
    apartment: '',
    studio: 'success',
    shared_flat: 'warning',
    homestay: 'info',
  }
  return map[type] || 'info'
}

const fetchListings = async () => {
  loading.value = true
  error.value = ''
  try {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.type) params.set('type', filters.type)
    if (filters.maxPrice !== '' && filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice))
    if (filters.country) params.set('country', filters.country)
    params.set('page', String(currentPage.value))
    params.set('limit', String(pageSize))

    const res = await fetch(`${API}/housing?${params}`, { credentials: 'include' })
    if (!res.ok) throw new Error('Failed to load housing listings')
    const data = await res.json()
    listings.value = data.listings || data.items || data || []
    total.value = data.total || listings.value.length
  } catch (e: any) {
    error.value = e.message || 'Failed to load housing listings. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchListings()
}

const saveListing = async (listing: HousingListing) => {
  saveLoading[listing.id] = true
  try {
    const res = await fetch(`${API}/housing/${listing.id}/save`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.message || 'Failed to save')
    }
    listing.saved = true
    ElMessage.success('Listing saved!')
  } catch (e: any) {
    ElMessage.error(e.message || 'Please log in to save listings.')
  } finally {
    saveLoading[listing.id] = false
  }
}

onMounted(fetchListings)
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

.filter-price {
  width: 150px;
}

.filter-country {
  width: 130px;
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
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
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
  margin: 0 0 10px;
  line-height: 1.4;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 12px;
}

.price-amount {
  font-size: 1.25rem;
  font-weight: 800;
  color: #2563eb;
}

.price-period {
  font-size: 0.875rem;
  color: #64748b;
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
