<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pb-32">

    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-4 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <p class="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full mb-5">
            Scholarship search
          </p>
          <h1 class="text-5xl font-bold text-blue-900 mb-5 leading-tight">
            Find scholarships that match your goals.
          </h1>
          <p class="text-lg text-gray-700 leading-relaxed max-w-xl">
            Browse scholarships listed in the DAAD scholarship database for studying in Germany, plus US training programmes from CareerOneStop.
          </p>
        </div>
        <div class="bg-white/70 rounded-2xl shadow-lg p-6">
          <div class="scholarship-hero-image"></div>
        </div>
      </div>
    </section>

    <!-- Search Card -->
    <section class="max-w-6xl mx-auto px-4 -mt-4 mb-10">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-3xl font-bold text-blue-900 mb-6 text-center">Search Scholarships</h2>

        <!-- Source tabs -->
        <div class="flex gap-2 mb-6 border-b border-gray-200">
          <button v-for="tab in tabs" :key="tab.key" @click="switchTab(tab.key)"
            :class="['px-5 py-2 font-semibold rounded-t-lg transition', activeTab === tab.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-700']">
            {{ tab.label }}
          </button>
        </div>

        <!-- DAAD search -->
        <div v-if="activeTab === 'daad'" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-[1fr_200px_200px_auto] gap-4">
            <input v-model="searchInput" placeholder="e.g. engineering, medicine, art, research"
              @keyup.enter="newSearch" @input="isFieldInvalid = false" :class="searchInputClasses" />
            <select v-model="daadSubjectGroup" class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All subjects</option>
              <option v-for="sg in subjectGroups" :key="sg.value" :value="sg.value">{{ sg.label }}</option>
            </select>
            <select v-model="daadIntention" class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All types</option>
              <option v-for="int in intentions" :key="int.value" :value="int.value">{{ int.label }}</option>
            </select>
            <button @click="newSearch" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition shadow-md">Search</button>
          </div>
          <p class="text-sm text-gray-500 text-center">Scholarships sourced from the DAAD scholarship database for international students in Germany.</p>
        </div>

        <!-- CareerOneStop search -->
        <div v-else class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-[1fr_280px_auto] gap-4">
            <input v-model="searchInput" placeholder="Field of study, e.g. nursing, business, computer science"
              @keyup.enter="newSearch" @input="clearFieldError" :class="searchInputClasses" />
            <div class="relative">
              <input v-model="location" @input="filterLocations" @focus="showDropdown = true" @blur="hideDropdown"
                @keyup.enter="newSearch" placeholder="Location optional"
                class="px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <ul v-if="shouldShowLocationDropdown" class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                <li v-for="(loc, index) in filteredLocations" :key="index" @mousedown="selectLocation(loc)" class="px-4 py-2 hover:bg-blue-50 cursor-pointer">{{ loc }}</li>
              </ul>
            </div>
            <button @click="newSearch" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-3 rounded-lg transition duration-200 shadow-md">Search</button>
          </div>
          <p class="text-sm text-gray-500 text-center">US vocational training programmes from CareerOneStop (US Department of Labor).</p>
        </div>

        <p v-if="isFieldInvalid" class="text-red-600 text-sm mt-4 text-center">
          Please enter a search keyword, for example nursing, computer science, or business.
        </p>
      </div>
    </section>

    <!-- Info cards (pre-search) -->
    <section class="max-w-6xl mx-auto px-4 mb-10" v-if="!hasSearched">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="info-card">
          <div class="info-icon">🇩🇪</div>
          <h3>DAAD Scholarships</h3>
          <p>Scholarships from the DAAD scholarship database for studying or researching in Germany, including programmes from partner foundations.</p>
        </div>
        <div class="info-card">
          <div class="info-icon">🎓</div>
          <h3>Filter by subject</h3>
          <p>Narrow by field: Engineering, Medicine, Arts, Law, Natural Sciences, and more.</p>
        </div>
        <div class="info-card">
          <div class="info-icon">🌍</div>
          <h3>Open to all countries</h3>
          <p>DAAD scholarships are open to international students worldwide, not just EU citizens.</p>
        </div>
      </div>
    </section>

    <!-- Results -->
    <section class="max-w-6xl mx-auto px-4 py-5" v-if="hasSearched">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div v-if="isLoading" class="text-center text-gray-600 text-lg py-10">Loading...</div>
        <div v-else-if="errorMessage" class="text-center text-red-600 text-lg py-10">{{ errorMessage }}</div>
        <div v-else-if="activeResults.length === 0" class="text-center text-gray-600 text-lg py-10">
          No scholarships found for "{{ searchInput }}".
          <p class="text-sm mt-2 text-gray-500">Try a broader keyword like "engineering" or "medicine".</p>
        </div>
        <div v-else>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <h2 class="text-2xl font-bold text-blue-900">Results for "{{ searchInput }}"</h2>
            <p class="text-sm text-gray-500">{{ resultCountText }}</p>
          </div>

          <!-- DAAD results -->
          <ul v-if="activeTab === 'daad'" class="space-y-5">
            <li v-for="s in daadResults" :key="s.id" class="result-card">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span v-if="s.isDaad" class="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">DAAD funded</span>
                  <span class="text-xs text-gray-400">ID {{ s.id }}</span>
                </div>
                <h3 class="text-xl font-bold text-blue-800 mb-2">{{ s.nameEn }}</h3>
                <p class="text-gray-600 text-sm leading-relaxed mb-3">{{ s.introduction }}</p>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span v-for="sg in s.subjectGroups" :key="sg" class="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-full">{{ sg }}</span>
                </div>
                <div class="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                  <span v-if="s.intentions.length"><strong class="text-gray-700">Type:</strong> {{ s.intentions.join(', ') }}</span>
                  <span v-if="s.targetStatus.length"><strong class="text-gray-700">For:</strong> {{ s.targetStatus.join(', ') }}</span>
                </div>
              </div>
              <a :href="s.detailUrl" target="_blank" class="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg transition">
                View on DAAD Website
              </a>
              <p class="text-xs text-gray-400 mt-2">Application status and deadlines are managed directly by DAAD.</p>
            </li>
          </ul>

          <!-- CareerOneStop results -->
          <ul v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <li v-for="(scholarship, index) in cosResults" :key="index" class="result-card">
              <div>
                <h3 class="text-xl font-bold text-blue-800 mb-2">{{ scholarship.programName }}</h3>
                <p class="text-gray-700 font-medium mb-4">{{ scholarship.schoolName }}</p>
                <div class="space-y-2 text-sm text-gray-500">
                  <p v-if="hasLocation(scholarship)"><strong class="text-gray-700">Location:</strong> {{ formatLocation(scholarship) }}</p>
                  <p v-if="scholarship.address"><strong class="text-gray-700">Address:</strong> {{ scholarship.address }}</p>
                  <p v-if="scholarship.phone"><strong class="text-gray-700">Phone:</strong> {{ scholarship.phone }}</p>
                  <p v-if="scholarship.programLength"><strong class="text-gray-700">Duration:</strong> {{ scholarship.programLength }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 mt-5 flex-wrap">
                <a v-if="scholarship.website" :href="formatWebsiteUrl(scholarship.website)" target="_blank"
                  class="inline-block bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-lg transition">
                  Visit Website
                </a>
                <button v-if="session.isAuthenticated" @click="toggleSaveScholarship(scholarship)"
                  :title="isScholarshipSaved(scholarship) ? 'Remove from saved' : 'Save scholarship'"
                  class="save-btn" :class="{ 'save-btn-saved': isScholarshipSaved(scholarship) }">
                  <svg v-if="isScholarshipSaved(scholarship)" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z"/>
                  </svg>
                </button>
              </div>
            </li>
          </ul>

          <!-- Pagination (DAAD) -->
          <div v-if="activeTab === 'daad' && daadTotalPages > 1" class="flex justify-between items-center mt-8">
            <button @click="goToPrevPage" :disabled="currentPage === 1" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-2 rounded-lg transition disabled:opacity-50">Previous</button>
            <span class="text-gray-700">Page {{ currentPage }} of {{ daadTotalPages }}</span>
            <button @click="goToNextPage" :disabled="currentPage === daadTotalPages" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-2 rounded-lg transition disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { api } from '../services/api';
import { US_STATES } from '../utils/locations';
import { useSessionStore } from '../store/session';
import { ElMessage } from 'element-plus';

const session = useSessionStore();

type DAADScholarship = { id: number; nameEn: string; introduction: string; subjectGroups: string[]; intentions: string[]; targetStatus: string[]; isDaad: boolean; detailUrl: string; };
type COSScholarship = { programName?: string; schoolName?: string; city?: string; state?: string; address?: string; phone?: string; programLength?: string; website?: string; };

const tabs = [{ key: 'daad', label: 'DAAD Scholarships (Germany)' }, { key: 'careeronestop', label: 'US Training Programmes' }];
const subjectGroups = [
  { value: 'Languages and Cultural Studies', label: 'Languages and Cultural Studies' },
  { value: 'Law, Economics and Social Sciences', label: 'Law, Economics and Social Sciences' },
  { value: 'Mathematics and Natural Sciences', label: 'Mathematics and Natural Sciences' },
  { value: 'Human Medicine', label: 'Human Medicine' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Art, Music and Sport', label: 'Art, Music and Sport' },
];
const intentions = [
  { value: 'Study', label: 'Study' },
  { value: 'Research', label: 'Research / PhD' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Language Course', label: 'Language Course' },
];

const activeTab = ref<'daad' | 'careeronestop'>('daad');
const searchInput = ref('');
const location = ref('');
const daadSubjectGroup = ref('');
const daadIntention = ref('');
const isLoading = ref(false);
const hasSearched = ref(false);
const isFieldInvalid = ref(false);
const errorMessage = ref('');
const currentPage = ref(1);
const showDropdown = ref(false);
const filteredLocations = ref<string[]>([]);
const daadResults = ref<DAADScholarship[]>([]);
const daadTotal = ref(0);
const cosResults = ref<COSScholarship[]>([]);
const savedScholarships = ref<Set<string>>(new Set());

const daadTotalPages = computed(() => Math.max(1, Math.ceil(daadTotal.value / 10)));
const activeResults = computed<any[]>(() => activeTab.value === 'daad' ? daadResults.value : cosResults.value);
const resultCountText = computed(() => { const count = activeTab.value === 'daad' ? daadTotal.value : cosResults.value.length; return `${count} result${count === 1 ? '' : 's'} found`; });
const searchInputClasses = computed(() => ['px-4 py-3 border rounded-lg focus:outline-none focus:ring-2', isFieldInvalid.value ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500']);
const shouldShowLocationDropdown = computed(() => showDropdown.value && filteredLocations.value.length > 0);

const switchTab = (key: 'daad' | 'careeronestop') => { activeTab.value = key; hasSearched.value = false; daadResults.value = []; cosResults.value = []; errorMessage.value = ''; currentPage.value = 1; };
const clearFieldError = () => { isFieldInvalid.value = false; };

const newSearch = () => {
  if (!searchInput.value.trim()) { isFieldInvalid.value = true; return; }
  clearFieldError(); currentPage.value = 1; fetchScholarships();
};

const fetchScholarships = async () => {
  if (isLoading.value) return;
  isLoading.value = true; hasSearched.value = true; errorMessage.value = '';
  try {
    if (activeTab.value === 'daad') {
      const params: Record<string, any> = { q: searchInput.value, source: 'daad', page: currentPage.value };
      if (daadSubjectGroup.value) params.subjectGroup = daadSubjectGroup.value;
      if (daadIntention.value) params.intention = daadIntention.value;
      const res = await api.get('scholarships', { params });
      daadResults.value = res.data.scholarships || []; daadTotal.value = res.data.total || 0;
    } else {
      const res = await api.get('scholarships', { params: { q: searchInput.value, source: 'careeronestop', location: location.value || undefined } });
      cosResults.value = res.data.scholarships || [];
    }
  } catch (err: any) {
    errorMessage.value = err.response?.data?.error || 'Failed to fetch scholarships. Please try again.';
  } finally { isLoading.value = false; }
};

const goToNextPage = () => { if (currentPage.value < daadTotalPages.value) { currentPage.value++; fetchScholarships(); } };
const goToPrevPage = () => { if (currentPage.value > 1) { currentPage.value--; fetchScholarships(); } };

const filterLocations = () => { const term = location.value.toLowerCase(); filteredLocations.value = term ? US_STATES.filter((s) => s.toLowerCase().includes(term)) : []; };
const selectLocation = (loc: string) => { location.value = loc; showDropdown.value = false; };
const hideDropdown = () => setTimeout(() => { showDropdown.value = false; }, 200);
const hasLocation = (s: COSScholarship) => Boolean(s.city || s.state);
const formatLocation = (s: COSScholarship) => [s.city, s.state].filter(Boolean).join(', ');
const formatWebsiteUrl = (website: string) => website.startsWith('http') ? website : `https://${website}`;

const scholarshipKey = (s: { programName?: string; schoolName?: string }) => `${s.programName || ''}||${s.schoolName || ''}`;
const isScholarshipSaved = (s: COSScholarship) => savedScholarships.value.has(scholarshipKey(s));

const toggleSaveScholarship = async (s: COSScholarship) => {
  const key = scholarshipKey(s);
  try {
    if (isScholarshipSaved(s)) {
      await api.delete('users/saved-scholarships', { data: { programName: s.programName, schoolName: s.schoolName } });
      savedScholarships.value.delete(key); savedScholarships.value = new Set(savedScholarships.value);
      ElMessage.success('Removed from saved scholarships');
    } else {
      await api.post('users/saved-scholarships', { programName: s.programName || '', schoolName: s.schoolName || '', city: s.city || '', state: s.state || '', website: s.website || '' });
      savedScholarships.value.add(key); savedScholarships.value = new Set(savedScholarships.value);
      ElMessage.success('Scholarship saved!');
    }
  } catch (error: any) {
    const msg = error?.response?.data?.message;
    if (msg === 'Already saved') { savedScholarships.value.add(key); savedScholarships.value = new Set(savedScholarships.value); }
    else { ElMessage.error('Something went wrong. Please try again.'); }
  }
};

const loadSavedScholarships = async () => {
  if (!session.isAuthenticated) return;
  try { const res = await api.get('users/saved-scholarships'); const items: Array<{ programName: string; schoolName: string }> = res.data || []; savedScholarships.value = new Set(items.map(scholarshipKey)); } catch {}
};

onMounted(loadSavedScholarships);
</script>

<style scoped>
.scholarship-hero-image { min-height: 300px; border-radius: 20px; background: linear-gradient(rgba(239, 246, 255, 0.15), rgba(239, 246, 255, 0.15)), url("../images/scholarship-hero.png"); background-size: contain; background-repeat: no-repeat; background-position: center; }
.info-card { background: white; border-radius: 18px; padding: 26px; box-shadow: 0 12px 30px rgba(15, 42, 95, 0.1); border: 1px solid #e5efff; }
.info-icon { width: 56px; height: 56px; background: #eff6ff; color: #2563eb; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 16px; }
.info-card h3 { color: #0f2a5f; font-size: 20px; font-weight: 800; margin-bottom: 8px; }
.info-card p { color: #64748b; line-height: 1.6; }
.result-card { border: 1px solid #e5efff; border-radius: 18px; padding: 24px; box-shadow: 0 8px 22px rgba(15, 42, 95, 0.08); display: flex; flex-direction: column; justify-content: space-between; transition: 0.2s ease; }
.result-card:hover { transform: translateY(-3px); box-shadow: 0 14px 30px rgba(15, 42, 95, 0.13); }
.save-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; border: 1.5px solid #cbd5e1; background: white; color: #64748b; cursor: pointer; transition: 0.2s ease; flex-shrink: 0; }
.save-btn:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
.save-btn-saved { border-color: #2563eb; background: #2563eb; color: white; }
.save-btn-saved:hover { background: #1d4ed8; border-color: #1d4ed8; color: white; }
</style>
