<template>
  <div class="page-wrapper">
    <!-- Page Header -->
    <section class="page-header">
      <div class="header-inner">
        <h1 class="page-title">Skills Profiles</h1>
        <p class="page-subtitle">Find students by skill, language, or expertise level</p>
      </div>
    </section>

    <!-- Search Bar -->
    <section class="filter-section">
      <div class="filter-inner">
        <el-input
          v-model="searchQuery"
          placeholder="Search by skill, language, or expertise..."
          clearable
          class="filter-input"
          @change="handleSearch"
        />
        <el-button type="primary" @click="handleSearch" class="search-btn">Search</el-button>
      </div>
    </section>

    <section class="results-section">
      <div class="results-inner">
        <!-- Own profile -->
        <div v-if="ownProfile" class="own-profile-box">
          <div class="own-profile-header">
            <div>
              <h2 class="own-profile-name">{{ ownProfile.name || ownProfile.username }}</h2>
              <p class="own-profile-label">Your Skills Profile</p>
            </div>
            <el-button type="primary" @click="openEditModal">Edit My Profile</el-button>
          </div>

          <div class="profile-sections">
            <div v-if="ownProfile.skills && ownProfile.skills.length > 0" class="profile-section">
              <h4 class="section-label">Skills</h4>
              <div class="skills-list">
                <span
                  v-for="skill in ownProfile.skills"
                  :key="skill.name"
                  class="skill-chip"
                  :class="{ 'skill-chip-esco': skill.escoUri }"
                >
                  {{ skill.name }}
                  <span v-if="skill.escoUri" class="esco-badge" title="ESCO verified">ESCO</span>
                  <span class="skill-level">{{ formatProficiency(skill.proficiency) }}</span>
                </span>
              </div>
            </div>

            <div v-if="ownProfile.languages && ownProfile.languages.length > 0" class="profile-section">
              <h4 class="section-label">Languages</h4>
              <div class="skills-list">
                <span
                  v-for="lang in ownProfile.languages"
                  :key="lang.language"
                  class="lang-chip"
                >
                  {{ lang.language }}
                  <span class="lang-level">{{ lang.level }}</span>
                </span>
              </div>
            </div>

            <p v-if="(!ownProfile.skills || ownProfile.skills.length === 0) && (!ownProfile.languages || ownProfile.languages.length === 0)" class="empty-profile-hint">
              No skills or languages added yet. Click "Edit My Profile" to get started.
            </p>
          </div>
        </div>

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
          v-else-if="!loading && searchResults.length === 0 && searchQuery"
          description="No profiles found matching your search."
        />

        <!-- Results -->
        <div v-else-if="searchResults.length > 0" class="results-grid">
          <div
            v-for="profile in searchResults"
            :key="profile.userId"
            class="item-card"
          >
            <div class="card-body">
              <h3 class="card-title">{{ profile.name || profile.username }}</h3>

              <div v-if="profile.skills && profile.skills.length > 0" class="profile-section">
                <h4 class="section-label-sm">Skills</h4>
                <div class="skills-list">
                  <span
                    v-for="skill in profile.skills.slice(0, 5)"
                    :key="skill.name"
                    class="skill-chip"
                    :class="{ 'skill-chip-esco': skill.escoUri }"
                  >
                    {{ skill.name }}
                    <span v-if="skill.escoUri" class="esco-badge">ESCO</span>
                    <span class="skill-level">{{ formatProficiency(skill.proficiency) }}</span>
                  </span>
                  <span v-if="profile.skills.length > 5" class="more-chip">+{{ profile.skills.length - 5 }} more</span>
                </div>
              </div>

              <div v-if="profile.languages && profile.languages.length > 0" class="profile-section">
                <h4 class="section-label-sm">Languages</h4>
                <div class="skills-list">
                  <span
                    v-for="lang in profile.languages"
                    :key="lang.language"
                    class="lang-chip"
                  >
                    {{ lang.language }}
                    <span class="lang-level">{{ lang.level }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Edit Modal -->
    <el-dialog
      v-model="editModalVisible"
      title="Edit My Skills Profile"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="modal-body">
        <!-- Skills section -->
        <h3 class="modal-section-title">Skills</h3>
        <div
          v-for="(skill, idx) in editForm.skills"
          :key="idx"
          class="edit-row"
        >
          <el-input v-model="skill.name" placeholder="Skill name" class="edit-row-input" />
          <el-select v-model="skill.proficiency" placeholder="Level" class="edit-row-select">
            <el-option label="Beginner" value="beginner" />
            <el-option label="Intermediate" value="intermediate" />
            <el-option label="Advanced" value="advanced" />
            <el-option label="Expert" value="expert" />
          </el-select>
          <el-button type="danger" :icon="deleteIcon" circle @click="removeSkill(idx)" size="small" />
        </div>
        <el-button type="default" size="small" @click="addSkill" class="add-btn">+ Add Skill</el-button>

        <!-- Languages section -->
        <h3 class="modal-section-title mt-top">Languages</h3>
        <div
          v-for="(lang, idx) in editForm.languages"
          :key="idx"
          class="edit-row"
        >
          <el-input v-model="lang.language" placeholder="Language name" class="edit-row-input" />
          <el-select v-model="lang.level" placeholder="Level" class="edit-row-select">
            <el-option label="A1" value="A1" />
            <el-option label="A2" value="A2" />
            <el-option label="B1" value="B1" />
            <el-option label="B2" value="B2" />
            <el-option label="C1" value="C1" />
            <el-option label="C2" value="C2" />
            <el-option label="Native" value="Native" />
          </el-select>
          <el-button type="danger" :icon="deleteIcon" circle @click="removeLanguage(idx)" size="small" />
        </div>
        <el-button type="default" size="small" @click="addLanguage" class="add-btn">+ Add Language</el-button>
      </div>

      <template #footer>
        <el-button @click="editModalVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" @click="saveProfile">Save Changes</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface Skill {
  name: string
  proficiency?: string
  escoUri?: string
}

interface Language {
  language: string
  level: string
}

interface SkillProfile {
  userId?: string
  username?: string
  name?: string
  skills?: Skill[]
  languages?: Language[]
}

interface EditFormSkill {
  name: string
  proficiency: string
}

interface EditFormLang {
  language: string
  level: string
}

const ownProfile = ref<SkillProfile | null>(null)
const searchResults = ref<SkillProfile[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const editModalVisible = ref(false)
const saving = ref(false)

const deleteIcon = Delete

const editForm = reactive<{
  skills: EditFormSkill[]
  languages: EditFormLang[]
}>({
  skills: [],
  languages: [],
})

const formatProficiency = (level?: string): string => {
  const map: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
  }
  return level ? (map[level] || level) : ''
}

const fetchOwnProfile = async () => {
  try {
    const res = await fetch(`${API}/skills/me`, { credentials: 'include' })
    if (res.status === 401) return
    if (!res.ok) return
    ownProfile.value = await res.json()
  } catch {
    // not logged in or no profile yet
  }
}

const fetchSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  loading.value = true
  error.value = ''
  try {
    const params = new URLSearchParams({ q: searchQuery.value })
    const res = await fetch(`${API}/skills/search?${params}`, { credentials: 'include' })
    if (!res.ok) throw new Error('Failed to search profiles')
    const data = await res.json()
    searchResults.value = data.profiles || data.items || data || []
  } catch (e: any) {
    error.value = e.message || 'Failed to search profiles. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  fetchSearch()
}

const openEditModal = () => {
  editForm.skills = (ownProfile.value?.skills || []).map(s => ({
    name: s.name,
    proficiency: s.proficiency || 'beginner',
  }))
  editForm.languages = (ownProfile.value?.languages || []).map(l => ({
    language: l.language,
    level: l.level,
  }))
  editModalVisible.value = true
}

const addSkill = () => {
  editForm.skills.push({ name: '', proficiency: 'beginner' })
}

const removeSkill = (idx: number) => {
  editForm.skills.splice(idx, 1)
}

const addLanguage = () => {
  editForm.languages.push({ language: '', level: 'B1' })
}

const removeLanguage = (idx: number) => {
  editForm.languages.splice(idx, 1)
}

const saveProfile = async () => {
  saving.value = true
  try {
    const body = {
      skills: editForm.skills.filter(s => s.name.trim()),
      languages: editForm.languages.filter(l => l.language.trim()),
    }
    const res = await fetch(`${API}/skills/me`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      throw new Error(errBody.message || 'Failed to save profile')
    }
    const updated = await res.json()
    ownProfile.value = updated
    editModalVisible.value = false
    ElMessage.success('Profile updated!')
  } catch (e: any) {
    ElMessage.error(e.message || 'Failed to save. Please try again.')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await fetchOwnProfile()
})
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
  min-width: 260px;
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

/* Own profile box */
.own-profile-box {
  border-radius: 16px;
  border: 2px solid #2563eb;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.12);
  background: white;
  padding: 24px;
  margin-bottom: 32px;
}

.own-profile-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.own-profile-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f2a5f;
  margin: 0 0 4px;
}

.own-profile-label {
  font-size: 0.8rem;
  color: #2563eb;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
  background: #eff6ff;
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.section-label-sm {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 4px;
}

.empty-profile-hint {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0;
}

/* Skill chips */
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #0f2a5f;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

.skill-chip-esco {
  background: #f0fdf4;
  border-color: #86efac;
}

.esco-badge {
  font-size: 0.65rem;
  font-weight: 700;
  background: #16a34a;
  color: white;
  padding: 1px 5px;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.skill-level {
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 500;
}

.lang-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0c4a6e;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

.lang-level {
  font-size: 0.72rem;
  color: #0369a1;
  font-weight: 700;
  background: #e0f2fe;
  padding: 1px 5px;
  border-radius: 4px;
}

.more-chip {
  font-size: 0.78rem;
  color: #64748b;
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
}

/* Results grid */
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(15, 42, 95, 0.14);
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f2a5f;
  margin: 0;
}

/* Modal styles */
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f2a5f;
  margin: 0 0 8px;
}

.mt-top {
  margin-top: 16px;
}

.edit-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.edit-row-input {
  flex: 1;
}

.edit-row-select {
  width: 150px;
}

.add-btn {
  margin-top: 4px;
}
</style>
