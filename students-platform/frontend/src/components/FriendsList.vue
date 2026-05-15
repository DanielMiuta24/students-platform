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
          v-if="showFollowButton && friend.id !== currentUserId"
          @click.stop="handleFollowToggle(friend)"
          @mouseenter="hoveredButton[friend.id] = true"
          @mouseleave="hoveredButton[friend.id] = false"
          :disabled="actionLoading[friend.id]"
          :class="getButtonClass(friend)"
          class="px-4 py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {{ actionLoading[friend.id] ? 'Loading...' : getButtonText(friend) }}
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
import { followUser, unfollowUser } from '../api/follow';
import type { SafeFollow } from '../api/follow';

interface Props {
  friends: SafeFollow[];
  loading?: boolean;
  title?: string;
  emptyMessage?: string;
  showUsername?: boolean;
  showFollowButton?: boolean;
  currentUserId?: string;
  currentUserFollowing?: string[];
  currentUserFriends?: string[];
  profileOwnerFollowing?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  title: 'Friends',
  emptyMessage: 'No friends yet',
  showUsername: false,
  showFollowButton: true,
  currentUserFollowing: () => [],
  currentUserFriends: () => [],
  profileOwnerFollowing: () => [],
});

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const router = useRouter();
const searchQuery = ref('');
const actionLoading = ref<Record<string, boolean>>({});
const hoveredButton = ref<Record<string, boolean>>({});

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

const isFollowing = (userId: string) => {
  return props.currentUserFollowing.includes(userId);
};

const isFriend = (userId: string) => {
  return props.currentUserFriends.includes(userId);
};

const followsMe = (userId: string) => {
  return props.profileOwnerFollowing.includes(props.currentUserId || '');
};

const getButtonText = (friend: SafeFollow) => {
  if (isFriend(friend.id)) {
    return hoveredButton.value[friend.id] ? 'Unfollow' : 'Friends';
  }
  if (isFollowing(friend.id)) {
    return hoveredButton.value[friend.id] ? 'Unfollow' : 'Following';
  }
  if (props.profileOwnerFollowing.includes(friend.id)) {
    return 'Follow Back';
  }
  return 'Follow';
};

const getButtonClass = (friend: SafeFollow) => {
  if (isFriend(friend.id)) {
    return hoveredButton.value[friend.id]
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-gray-200 text-gray-700 hover:bg-red-600 hover:text-white';
  }
  if (isFollowing(friend.id)) {
    return hoveredButton.value[friend.id]
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-blue-100 text-blue-700 hover:bg-red-600 hover:text-white';
  }
  return 'bg-blue-600 text-white hover:bg-blue-700';
};

const navigateToProfile = (username: string) => {
  router.push(`/profile/${username}`);
};

const handleFollowToggle = async (friend: SafeFollow) => {
  try {
    actionLoading.value[friend.id] = true;

    if (isFollowing(friend.id)) {
      await unfollowUser(friend.id);
    } else {
      await followUser(friend.id);
    }

    emit('refresh');
  } finally {
    actionLoading.value[friend.id] = false;
  }
};
</script>

<style scoped>
@media (max-width: 768px) {
  .rounded-2xl {
    border-radius: 1rem;
  }

  .p-6 {
    padding: 1rem;
  }

  .text-xl {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  .space-y-4 > * + * {
    margin-top: 0.75rem;
  }

  /* Make list items more compact */
  .flex.items-center.gap-3 {
    gap: 0.625rem;
    padding: 0.5rem;
  }

  /* Adjust avatar size */
  .w-10 {
    width: 2.25rem;
    height: 2.25rem;
  }

  .h-10 {
    height: 2.25rem;
  }

  /* Adjust button size and padding */
  .px-4 {
    padding-left: 0.625rem;
    padding-right: 0.625rem;
  }

  .py-1\.5 {
    padding-top: 0.375rem;
    padding-bottom: 0.375rem;
  }

  .text-sm {
    font-size: 0.75rem;
  }

  /* Adjust text sizes */
  .font-semibold {
    font-size: 0.875rem;
  }

  .text-xs {
    font-size: 0.6875rem;
  }
}

@media (max-width: 480px) {
  .p-6 {
    padding: 0.875rem;
  }

  .px-4 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  /* Even smaller buttons on very small screens */
  button {
    font-size: 0.6875rem;
    white-space: nowrap;
  }
}
</style>
