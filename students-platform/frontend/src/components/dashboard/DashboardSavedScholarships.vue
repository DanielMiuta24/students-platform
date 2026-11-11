<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Saved Scholarships</h2>
      <router-link to="/scholarships" class="px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/30 text-sm sm:text-base">
        Search more
      </router-link>
    </div>

    <div v-if="isLoading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      <p class="mt-4 text-gray-600 font-medium">Loading saved scholarships...</p>
    </div>

    <div v-else-if="scholarships.length === 0" class="empty-state">
      <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-lg sm:text-xl font-bold text-gray-900 mb-2">No saved scholarships yet</p>
      <p class="text-sm sm:text-base text-gray-600">Start searching and save scholarships you're interested in.</p>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="scholarship in scholarships"
        :key="scholarship.programName + '||' + scholarship.schoolName"
        class="border-2 border-gray-100 rounded-xl p-5 flex justify-between items-start hover:border-blue-300 hover:shadow-lg transition-all gap-4"
      >
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-gray-900 text-lg leading-tight">{{ scholarship.programName }}</h3>
          <p class="text-sm text-gray-700 font-medium mt-1">{{ scholarship.schoolName }}</p>
          <p v-if="scholarship.city || scholarship.state" class="text-sm text-gray-500 mt-0.5">
            {{ [scholarship.city, scholarship.state].filter(Boolean).join(', ') }}
          </p>
        </div>
        <div class="flex gap-2 items-center flex-shrink-0">
          <a
            v-if="scholarship.website"
            :href="scholarship.website.startsWith('http') ? scholarship.website : 'https://' + scholarship.website"
            target="_blank"
            class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/20 text-sm"
          >
            Visit
          </a>
          <button
            @click="unsave(scholarship)"
            class="px-4 py-2.5 border-2 border-red-300 hover:border-red-500 text-red-500 hover:text-red-700 font-semibold rounded-xl transition text-sm"
          >
            Unsave
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../../services/api';

const scholarships = ref<any[]>([]);
const isLoading = ref(false);

const fetchSavedScholarships = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('users/saved-scholarships');
    scholarships.value = response.data || [];
  } catch (error) {
    console.error('Failed to fetch saved scholarships:', error);
  } finally {
    isLoading.value = false;
  }
};

const unsave = async (scholarship: any) => {
  try {
    await api.delete('users/saved-scholarships', {
      data: { programName: scholarship.programName, schoolName: scholarship.schoolName },
    });
    scholarships.value = scholarships.value.filter(
      (s) => !(s.programName === scholarship.programName && s.schoolName === scholarship.schoolName)
    );
  } catch (error) {
    console.error('Failed to unsave scholarship:', error);
  }
};

onMounted(() => {
  fetchSavedScholarships();
});
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

@media (min-width: 640px) {
  .empty-state {
    padding: 64px 32px;
  }
}
</style>
