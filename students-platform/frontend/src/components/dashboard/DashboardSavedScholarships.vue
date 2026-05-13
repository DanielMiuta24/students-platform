<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Saved Scholarships</h2>
      <router-link to="/scholarships" class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition shadow-lg shadow-green-500/30">
        Search more
      </router-link>
    </div>

    <div class="empty-state">
      <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-xl font-bold text-gray-900 mb-2">No saved scholarships yet</p>
      <p class="text-gray-600">Start searching and save scholarships you're interested in.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 64px 32px;
}
</style>
