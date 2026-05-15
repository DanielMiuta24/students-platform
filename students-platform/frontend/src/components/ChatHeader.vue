<template>
  <div
    :class="[
      'p-4 flex items-center justify-between flex-shrink-0',
      variant === 'chatbox'
        ? 'bg-blue-600 text-white relative z-[1001]'
        : 'bg-white border-b border-blue-100 text-gray-900'
    ]"
  >
    <div class="flex items-center min-w-0">
      <img
        :src="getAvatarUrl(user.name, user.profilePicture ?? undefined)"
        alt="Profile Picture"
        class="w-10 h-10 rounded-full mr-3 object-cover flex-shrink-0"
      />
      <div class="min-w-0">
        <h2
          :class="[
            'text-base font-semibold truncate',
            variant === 'chatbox' ? 'text-white' : 'text-blue-900'
          ]"
        >
          {{ user.name }}
        </h2>
        <p
          :class="[
            'text-xs',
            variant === 'chatbox' ? 'text-blue-100' : 'text-green-600'
          ]"
        >
          {{ onlineStatus }}
        </p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="showActions" class="flex items-center gap-1 flex-shrink-0">
      <button
        v-if="showMessengerButton"
        @click="$emit('open-messenger')"
        :class="[
          'p-2 rounded-lg transition',
          variant === 'chatbox'
            ? 'hover:bg-blue-700 text-white'
            : 'hover:bg-gray-100 text-gray-600'
        ]"
        title="Open in Messenger"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
        </svg>
      </button>

      <button
        v-if="showMinimize"
        @click="$emit('minimize')"
        :class="[
          'p-2 rounded-lg transition',
          variant === 'chatbox'
            ? 'hover:bg-blue-700 text-white'
            : 'hover:bg-gray-100 text-gray-600'
        ]"
        :title="isMinimized ? 'Expand' : 'Minimize'"
      >
        <!-- Minimize icon (horizontal line) -->
        <svg v-if="!isMinimized" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
        </svg>
        <!-- Expand icon (plus sign) -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
      </button>

      <button
        v-if="showDelete"
        @click="$emit('delete')"
        :class="[
          'p-2 rounded-lg transition',
          variant === 'chatbox'
            ? 'hover:bg-blue-700 text-white'
            : 'hover:bg-gray-100 text-red-600'
        ]"
        title="Delete Conversation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </button>

      <button
        v-if="showClose"
        @click="$emit('close')"
        :class="[
          'p-2 rounded-lg transition',
          variant === 'chatbox'
            ? 'hover:bg-blue-700 text-white'
            : 'hover:bg-gray-100 text-gray-600'
        ]"
        title="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAvatarUrl } from '../utils/avatar';

interface User {
  id: string;
  name: string;
  username?: string;
  email?: string;
  profilePicture: string | null;
}

const props = withDefaults(defineProps<{
  user: User;
  onlineStatus?: string;
  showActions?: boolean;
  showMinimize?: boolean;
  showDelete?: boolean;
  showClose?: boolean;
  showMessengerButton?: boolean;
  variant?: 'chatbox' | 'page';
  isMinimized?: boolean;
}>(), {
  onlineStatus: 'Online',
  showActions: true,
  showMinimize: true,
  showDelete: true,
  showClose: true,
  showMessengerButton: false,
  variant: 'page',
  isMinimized: false,
});

defineEmits<{
  (e: 'minimize'): void;
  (e: 'delete'): void;
  (e: 'close'): void;
  (e: 'open-messenger'): void;
}>();
</script>
