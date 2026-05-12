<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center z-50 px-4"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all border-2 border-blue-200">
      <div class="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Invite People</h3>
              <p class="text-blue-100 text-sm">{{ subtitle }}</p>
            </div>
          </div>
          <button
            @click="handleClose"
            class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="px-6 pt-4">
        <div class="flex gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            @click="activeTab = 'people'"
            :class="[
              'flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all',
              activeTab === 'people'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Friends & Followers
          </button>
          <button
            @click="activeTab = 'email'"
            :class="[
              'flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all',
              activeTab === 'email'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Email
          </button>
        </div>
      </div>

      <!-- Email Tab Content -->
      <div v-if="activeTab === 'email'" class="p-6">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Email Addresses
        </label>
        <div class="flex gap-2">
          <input
            v-model="emailInput"
            type="email"
            placeholder="Enter email address"
            @keyup.enter="handleAddEmail"
            class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <button
            @click="handleAddEmail"
            type="button"
            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
          >
            Add
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-1">Press Enter or click Add to include an email</p>

        <!-- Added Emails List -->
        <div v-if="selectedEmails.length > 0" class="mt-4 space-y-2">
          <h4 class="text-sm font-semibold text-gray-700">Added Emails ({{ selectedEmails.length }})</h4>
          <div
            v-for="(email, index) in selectedEmails"
            :key="index"
            class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200"
          >
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <svg class="w-5 h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span class="text-gray-700 font-medium text-sm truncate">{{ email }}</span>
            </div>
            <button
              @click="removeEmail(index)"
              class="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- People Tab Content -->
      <div v-if="activeTab === 'people'">
        <div class="p-4 border-b border-gray-200">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search people..."
              class="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div class="max-h-96 overflow-y-auto">
          <div v-if="filteredPeople.length === 0" class="p-12 text-center">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-gray-500">No people found</p>
          </div>

          <div v-else class="divide-y divide-gray-100">
            <div
              v-for="person in filteredPeople"
              :key="person.id"
              class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              @click="toggleSelection(person.id)"
            >
              <div class="flex items-center gap-4">
                <div v-if="person.avatar" class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img :src="person.avatar" :alt="person.name" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {{ person.name.charAt(0).toUpperCase() }}
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1.5 sm:gap-2">
                    <h4 class="font-semibold text-gray-900 truncate">{{ person.name }}</h4>
                    <span
                      :class="[
                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold',
                        getTypeBadgeClass(person.type)
                      ]"
                    >
                      {{ getTypeLabel(person.type) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 truncate">@{{ person.username }}</p>
                  <p v-if="person.mutualFriends !== undefined" class="text-xs text-gray-500">
                    {{ person.mutualFriends }} mutual friends
                  </p>
                </div>

                <div
                  :class="[
                    'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all',
                    selectedIds.has(person.id)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 hover:border-blue-400'
                  ]"
                >
                  <svg
                    v-if="selectedIds.has(person.id)"
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-600">
          <span v-if="totalSelected > 0" class="font-semibold text-blue-600">
            {{ totalSelected }} {{ totalSelected === 1 ? 'person' : 'people' }} selected
          </span>
          <span v-else>
            No one selected
          </span>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="handleClose"
            class="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            @click="handleSendInvites"
            :disabled="totalSelected === 0"
            :class="[
              'px-6 py-2.5 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2',
              totalSelected > 0
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send Invites
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Person {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  type: 'friend' | 'following' | 'follower';
  mutualFriends?: number;
}

interface Props {
  isOpen: boolean;
  people: Person[];
  subtitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: 'Invite people by email or select from friends and followers',
});

const emit = defineEmits<{
  close: [];
  sendInvites: [data: { userIds: string[]; emails: string[] }];
}>();

const activeTab = ref<'people' | 'email'>('people');
const searchQuery = ref('');
const selectedIds = ref<Set<string>>(new Set());
const selectedEmails = ref<string[]>([]);
const emailInput = ref('');

const filteredPeople = computed(() => {
  if (!searchQuery.value) return props.people;

  const query = searchQuery.value.toLowerCase();
  return props.people.filter(person =>
    person.name.toLowerCase().includes(query) ||
    person.username.toLowerCase().includes(query)
  );
});

const totalSelected = computed(() => {
  return selectedIds.value.size + selectedEmails.value.length;
});

const toggleSelection = (id: string) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
};

const handleAddEmail = () => {
  const email = emailInput.value.trim();
  if (email && email.includes('@') && !selectedEmails.value.includes(email)) {
    selectedEmails.value.push(email);
    emailInput.value = '';
  }
};

const removeEmail = (index: number) => {
  selectedEmails.value.splice(index, 1);
};

const getTypeBadgeClass = (type: string) => {
  switch (type) {
    case 'friend':
      return 'bg-blue-100 text-blue-700';
    case 'following':
      return 'bg-purple-100 text-purple-700';
    case 'follower':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'friend':
      return 'Friend';
    case 'following':
      return 'Following';
    case 'follower':
      return 'Follower';
    default:
      return type;
  }
};

const handleClose = () => {
  searchQuery.value = '';
  selectedIds.value.clear();
  selectedEmails.value = [];
  emailInput.value = '';
  activeTab.value = 'people';
  emit('close');
};

const handleSendInvites = () => {
  if (totalSelected.value === 0) return;
  emit('sendInvites', {
    userIds: Array.from(selectedIds.value),
    emails: selectedEmails.value,
  });
  searchQuery.value = '';
  selectedIds.value.clear();
  selectedEmails.value = [];
  emailInput.value = '';
  activeTab.value = 'people';
};
</script>
