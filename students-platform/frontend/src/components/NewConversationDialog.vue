<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 flex items-center justify-center z-50"
    @click.self="closeDialog"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[600px] flex flex-col">
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 class="text-xl font-bold text-blue-900">New Conversation</h3>
        <button
          @click="closeDialog"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 border-b border-gray-200">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <div v-if="searching" class="absolute right-3 top-2.5">
            <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <ul>
          <li
            v-for="user in filteredUsers"
            :key="user.id"
            @click="selectUser(user)"
            class="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition"
          >
            <img
              :src="getAvatarUrl(user.name, user.profilePicture)"
              alt="Profile"
              class="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <div class="flex-1 min-w-0">
              <h4 class="text-base font-semibold text-gray-900 truncate">
                {{ user.name }}
              </h4>
              <p class="text-sm text-gray-500 truncate">@{{ user.username }}</p>
            </div>
            <div v-if="user.hasConversation" class="ml-2">
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Existing
              </span>
            </div>
          </li>
          <li v-if="filteredUsers.length === 0" class="p-8 text-center text-gray-500">
            No users found
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { getAvatarUrl } from '../utils/avatar';
import { messageService, type UserSearchResult } from '../services/message.service';

interface User {
  id: string;
  name: string;
  username: string;
  profilePicture: string | null;
}

interface Props {
  modelValue: boolean;
  availableUsers: User[];
  existingConversationUserIds: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'select': [user: User];
}>();

const searchQuery = ref('');
const searchResults = ref<UserSearchResult[]>([]);
const searching = ref(false);
let searchDebounceTimer: number | null = null;

const filteredUsers = computed(() => {
  if (searchQuery.value.trim() && searchResults.value.length > 0) {
    return searchResults.value.map(result => ({
      id: result.id,
      name: result.name,
      username: result.username,
      profilePicture: result.profilePicture,
      hasConversation: result.hasConversation,
      priority: result.priority,
    }));
  }

  let users = props.availableUsers.filter(
    (user) => !props.existingConversationUserIds.includes(user.id)
  );

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    users = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
    );
  }

  return users;
});

watch(searchQuery, (newQuery) => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  if (!newQuery || newQuery.trim().length === 0) {
    searchResults.value = [];
    return;
  }

  searching.value = true;
  searchDebounceTimer = window.setTimeout(async () => {
    try {
      searchResults.value = await messageService.searchUsers(newQuery);
    } catch (error) {
      console.error('Failed to search users:', error);
      searchResults.value = [];
    } finally {
      searching.value = false;
    }
  }, 300);
});

const closeDialog = () => {
  searchQuery.value = '';
  searchResults.value = [];
  emit('update:modelValue', false);
};

const selectUser = (user: any) => {
  emit('select', user);
  closeDialog();
};
</script>
