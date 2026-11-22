<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pb-32">

    <!-- Header -->
    <section class="max-w-3xl mx-auto px-4 py-12">
      <p class="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full mb-3">Find People</p>
      <h1 class="text-4xl font-bold text-blue-900 leading-tight mb-2">Search for students</h1>
      <p class="text-gray-600 mb-8">Connect with international students from around the world.</p>

      <!-- Search input -->
      <div class="relative">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
        <input
          v-model="query"
          @input="onInput"
          type="text"
          placeholder="Search by name or username..."
          class="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
          autofocus
        />
        <button v-if="query" @click="query = ''; results = []; searched = false" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        </button>
      </div>
    </section>

    <!-- Results -->
    <section class="max-w-3xl mx-auto px-4">

      <!-- Loading -->
      <div v-if="loading" class="text-center py-16 text-gray-400">Searching...</div>

      <!-- No results -->
      <div v-else-if="searched && results.length === 0" class="text-center py-16">
        <div class="text-5xl mb-4">🔍</div>
        <p class="text-xl font-bold text-blue-900 mb-2">No results for "{{ query }}"</p>
        <p class="text-gray-500">Try a different name or username.</p>
      </div>

      <!-- Prompt -->
      <div v-else-if="!searched" class="text-center py-16 text-gray-400">
        Type a name or username to find people.
      </div>

      <!-- People list -->
      <div v-else class="grid gap-4">
        <div
          v-for="person in results"
          :key="person.id"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition"
        >
          <router-link :to="`/profile/${person.username}`" class="flex-shrink-0">
            <img v-if="person.avatar" :src="person.avatar" :alt="person.name" class="w-14 h-14 rounded-full object-cover border-2 border-blue-100" />
            <div v-else class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-bold text-xl border-2 border-blue-100">
              {{ person.name?.[0]?.toUpperCase() }}
            </div>
          </router-link>

          <div class="flex-1 min-w-0">
            <router-link :to="`/profile/${person.username}`" class="hover:underline">
              <p class="font-bold text-blue-900 text-lg leading-tight">{{ person.name }}</p>
            </router-link>
            <p class="text-sm text-gray-400">@{{ person.username }}</p>
            <p v-if="person.fieldOfStudy" class="text-sm text-gray-500 mt-1">{{ person.fieldOfStudy }}</p>
          </div>

          <div class="flex gap-2 flex-shrink-0">
            <router-link :to="`/profile/${person.username}`"
              class="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl transition text-sm">
              View Profile
            </router-link>
            <button
              v-if="person.id !== session.user?.id"
              @click="toggleFollow(person)"
              :class="['px-4 py-2 font-semibold rounded-xl transition text-sm border-2', followingSet.has(person.id) ? 'border-blue-600 text-blue-600 bg-white' : 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700']"
            >
              {{ followingSet.has(person.id) ? 'Following' : 'Follow' }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from '../services/api';
import { useSessionStore } from '../store/session';
import { useSEO } from '../composables/useSEO';

useSEO({ title: 'Find People | ISCompass', description: 'Search for international students on ISCompass' });

const session = useSessionStore();
const query = ref('');
const results = ref<any[]>([]);
const loading = ref(false);
const searched = ref(false);
const followingSet = ref<Set<string>>(new Set());

let debounceTimer: ReturnType<typeof setTimeout>;

const onInput = () => {
  clearTimeout(debounceTimer);
  if (!query.value.trim()) { results.value = []; searched.value = false; return; }
  debounceTimer = setTimeout(search, 350);
};

const search = async () => {
  loading.value = true;
  searched.value = false;
  try {
    const res = await api.get('users/search', { params: { q: query.value.trim() } });
    results.value = Array.isArray(res.data) ? res.data.filter((u: any) => u.id !== session.user?.id) : [];
    searched.value = true;
  } catch {
    results.value = [];
    searched.value = true;
  } finally {
    loading.value = false;
  }
};

const toggleFollow = async (person: any) => {
  const id = person.id;
  const wasFollowing = followingSet.value.has(id);
  const next = new Set(followingSet.value);
  if (wasFollowing) next.delete(id); else next.add(id);
  followingSet.value = next;
  try {
    if (wasFollowing) await api.delete(`follow/${id}`);
    else await api.post(`follow/${id}`);
  } catch {
    const revert = new Set(followingSet.value);
    if (wasFollowing) revert.add(id); else revert.delete(id);
    followingSet.value = revert;
  }
};
</script>
