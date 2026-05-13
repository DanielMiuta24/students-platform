<template>
  <div class="flex flex-wrap gap-3">
    <button
      @click="selectRole(null)"
      :class="[
        'px-4 py-2 rounded-full font-semibold transition flex items-center gap-2',
        selectedRole === null
          ? 'bg-indigo-600 text-white'
          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
      ]"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      All Members
    </button>

    <button
      @click="selectRole('admin')"
      :class="[
        'px-4 py-2 rounded-full font-semibold transition flex items-center gap-2',
        selectedRole === 'admin'
          ? 'bg-red-600 text-white'
          : 'bg-red-50 text-red-700 hover:bg-red-100'
      ]"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
      </svg>
      Founders & Admins
    </button>

    <button
      @click="selectRole('member')"
      :class="[
        'px-4 py-2 rounded-full font-semibold transition flex items-center gap-2',
        selectedRole === 'member'
          ? 'bg-emerald-600 text-white'
          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
      ]"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
      Regular Members
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { COMMUNITY_ROLE } from '../types/community';

type CommunityRoleFilter = 'admin' | 'member' | null;

const emit = defineEmits<{
  (e: 'change', role: CommunityRoleFilter): void;
}>();

const selectedRole = ref<CommunityRoleFilter>(null);

const selectRole = (role: CommunityRoleFilter) => {
  selectedRole.value = role;
  emit('change', role);
};
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.98);
}

svg {
  flex-shrink: 0;
}
</style>
