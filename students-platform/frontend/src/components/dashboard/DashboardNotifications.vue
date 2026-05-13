<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-8">Notifications</h2>

    <div class="empty-state">
      <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
        <svg class="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <p class="text-xl font-bold text-gray-900 mb-2">No notifications yet</p>
      <p class="text-gray-600">You'll see notifications here when you have activity.</p>
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
