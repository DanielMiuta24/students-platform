<template>
  <section class="bg-white rounded-2xl shadow-lg p-6">
    <h2 class="text-xl font-bold text-blue-900 mb-4">
      {{ title }}
    </h2>

    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search friends..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else-if="filteredFriends.length" class="space-y-4">
      <div
        v-for="friend in filteredFriends"
        :key="friend.id"
        class="flex items-center gap-3 p-2 rounded-lg transition"
      >
        <img
          :src="getAvatarUrl(friend.name, friend.avatar)"
          :alt="friend.name"
          class="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
          @click="navigateToProfile(friend.username)"
        />
        <div class="flex-1 cursor-pointer" @click="navigateToProfile(friend.username)">
          <p class="font-semibold text-blue-900 hover:text-blue-600 transition">
            {{ friend.name }}
          </p>
          <p v-if="showUsername" class="text-xs text-gray-500">@{{ friend.username }}</p>
        </div>
        <button
          v-if="showFollowButton"
          @click.stop="handleUnfollow(friend.id)"
          :disabled="actionLoading[friend.id]"
          class="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {{ actionLoading[friend.id] ? 'Loading...' : 'Friends' }}
        </button>
      </div>
    </div>

    <p v-else-if="searchQuery && !filteredFriends.length" class="text-gray-500 text-sm">
      No friends found matching "{{ searchQuery }}"
    </p>

    <p v-else class="text-gray-500 text-sm">
      {{ emptyMessage }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getAvatarUrl } from '../utils/avatar';
import { unfollowUser } from '../api/follow';
import type { SafeFollow } from '../api/follow';

interface Props {
  friends: SafeFollow[];
  loading?: boolean;
  title?: string;
  emptyMessage?: string;
  showUsername?: boolean;
  showFollowButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  title: 'Friends',
  emptyMessage: 'No friends yet',
  showUsername: false,
  showFollowButton: true,
});

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const router = useRouter();
const searchQuery = ref('');
const actionLoading = ref<Record<string, boolean>>({});

const filteredFriends = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.friends;
  }

  const query = searchQuery.value.toLowerCase();
  return props.friends.filter(friend =>
    friend.name.toLowerCase().includes(query) ||
    friend.username.toLowerCase().includes(query)
  );
});

const navigateToProfile = (username: string) => {
  router.push(`/profile/${username}`);
};

const handleUnfollow = async (userId: string) => {
  try {
    actionLoading.value[userId] = true;
    await unfollowUser(userId);
    emit('refresh');
  } finally {
    actionLoading.value[userId] = false;
  }
};
</script>
