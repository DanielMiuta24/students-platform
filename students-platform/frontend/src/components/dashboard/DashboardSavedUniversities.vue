<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Saved Universities</h2>
      <router-link to="/universities" class="px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/30 text-sm sm:text-base">
        Search more
      </router-link>
    </div>

    <div v-if="isLoading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      <p class="mt-4 text-gray-600 font-medium">Loading saved universities...</p>
    </div>

    <div v-else-if="universities.length === 0" class="empty-state">
      <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
        <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <p class="text-xl font-bold text-gray-900 mb-2">No saved universities yet</p>
      <p class="text-gray-600">Start searching and save universities you like.</p>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="university in universities"
        :key="university.id || university.name"
        class="border-2 border-gray-100 rounded-xl p-5 flex justify-between items-center hover:border-blue-300 hover:shadow-lg transition-all"
      >
        <div>
          <h3 class="font-bold text-gray-900 text-lg">{{ university.name }}</h3>
          <p class="text-sm text-gray-600 mt-1">{{ university.country || "Country not listed" }}</p>
        </div>
        <a
          v-if="university.website"
          :href="university.website"
          target="_blank"
          class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/20"
        >
          Visit
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const universities = ref<any[]>([]);
const isLoading = ref(false);

onMounted(() => {
  // fetchSavedUniversities();
});

// TODO: Implement saved universities backend API
// const fetchSavedUniversities = async () => {
//   isLoading.value = true;
//   try {
//     const response = await axios.get('http://localhost:3000/api/users/my-saved-universities');
//     universities.value = response.data;
//   } catch (error) {
//     console.error('Failed to fetch saved universities:', error);
//   } finally {
//     isLoading.value = false;
//   }
// };
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 64px 32px;
}
</style>
