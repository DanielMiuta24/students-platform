<template>
  <section class="bg-white rounded-2xl shadow-lg p-6">
    <h2 class="text-xl font-bold text-blue-900 mb-4">
      {{ title }}
    </h2>

    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search following..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else-if="filteredFollowing.length" class="space-y-4">
      <div
        v-for="user in filteredFollowing"
        :key="user.id"
        class="flex items-center gap-3 p-2 rounded-lg transition"
      >
        <img
          :src="getAvatarUrl(user.name, user.avatar)"
          :alt="user.name"
          class="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
          @click="navigateToProfile(user.username)"
        />
        <div class="flex-1 cursor-pointer" @click="navigateToProfile(user.username)">
          <p class="font-semibold text-blue-900 hover:text-blue-600 transition">
            {{ user.name }}
          </p>
          <p v-if="showUsername" class="text-xs text-gray-500">@{{ user.username }}</p>
        </div>
        <button
          v-if="showFollowButton"
          @click.stop="handleFollowToggle(user)"
          :disabled="actionLoading[user.id]"
          :class="getButtonClass(user)"
          class="px-4 py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {{ actionLoading[user.id] ? 'Loading...' : getButtonText(user) }}
        </button>
      </div>
    </div>

    <p v-else-if="searchQuery && !filteredFollowing.length" class="text-gray-500 text-sm">
      No users found matching "{{ searchQuery }}"
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
  following: SafeFollow[];
  loading?: boolean;
  title?: string;
  emptyMessage?: string;
  showUsername?: boolean;
  showFollowButton?: boolean;
  friends?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  title: 'Following',
  emptyMessage: 'Not following anyone yet',
  showUsername: false,
  showFollowButton: true,
  friends: () => [],
});

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const router = useRouter();
const searchQuery = ref('');
const actionLoading = ref<Record<string, boolean>>({});

const filteredFollowing = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.following;
  }

  const query = searchQuery.value.toLowerCase();
  return props.following.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.username.toLowerCase().includes(query)
  );
});

const isFriend = (userId: string) => {
  return props.friends.includes(userId);
};

const getButtonText = (user: SafeFollow) => {
  if (isFriend(user.id)) return 'Friends';
  return 'Following';
};

const getButtonClass = (user: SafeFollow) => {
  if (isFriend(user.id)) return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
};

const navigateToProfile = (username: string) => {
  router.push(`/profile/${username}`);
};

const handleFollowToggle = async (user: SafeFollow) => {
  try {
    actionLoading.value[user.id] = true;
    await unfollowUser(user.id);
    emit('refresh');
  } finally {
    actionLoading.value[user.id] = false;
  }
};
</script>
