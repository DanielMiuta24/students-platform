<template>
  <div
    class="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
  >
    <div class="flex items-start justify-between gap-4 mb-4">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
        {{ getInitial(community.name) }}
      </div>

      <span class="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200">
        {{ community.category }}
      </span>
    </div>

    <h3 class="text-xl font-bold text-gray-900 mb-2">
      {{ community.name }}
    </h3>

    <p class="text-gray-600 mb-4 leading-relaxed">
      {{ community.description }}
    </p>

    <div class="flex items-center gap-2 text-sm text-gray-500 mb-5">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
      <span class="font-semibold">{{ community.members.toLocaleString() }}</span> members
    </div>

    <div class="flex gap-3">
      <button
        @click="handleJoinToggle"
        :class="[
          'flex-1 font-bold px-5 py-2.5 rounded-xl transition-all shadow-md',
          community.joined
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200 border-2 border-green-300'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
        ]"
      >
        {{ community.joined ? '✓ Joined' : 'Join' }}
      </button>

      <button
        @click="handleView"
        class="px-5 py-2.5 border-2 border-blue-300 text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all"
      >
        View
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Community {
  id: number;
  name: string;
  description: string;
  category: string;
  members: number;
  joined: boolean;
}

interface Props {
  community: Community;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'toggle-join', community: Community): void;
  (e: 'view', community: Community): void;
}>();

const getInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};

const handleJoinToggle = () => {
  emit('toggle-join', props.community);
};

const handleView = () => {
  emit('view', props.community);
};
</script>
