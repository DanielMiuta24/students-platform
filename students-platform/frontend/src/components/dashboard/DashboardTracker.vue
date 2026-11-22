<template>
  <div class="max-w-4xl mx-auto py-6 px-4">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-blue-900">Application Tracker</h2>
      <button @click="showAdd = true" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg transition text-sm">
        + Add University
      </button>
    </div>

    <!-- Add form -->
    <div v-if="showAdd" class="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
      <h3 class="font-bold text-blue-900 mb-4">Add a university</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input v-model="newEntry.universityName" placeholder="University name *" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-1 md:col-span-1" />
        <input v-model="newEntry.country" placeholder="Country" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input v-model="newEntry.website" placeholder="Website (optional)" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="flex gap-3">
        <button @click="addEntry" :disabled="!newEntry.universityName || adding" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg transition disabled:opacity-40 text-sm">
          {{ adding ? 'Adding...' : 'Add' }}
        </button>
        <button @click="showAdd = false; newEntry = { universityName: '', country: '', website: '' }" class="text-gray-500 hover:text-gray-700 font-medium text-sm px-3 py-2">Cancel</button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && entries.length === 0 && !showAdd" class="text-center py-16 text-gray-400">
      <div class="text-5xl mb-4">🎓</div>
      <p class="text-lg font-medium text-gray-600 mb-2">No universities tracked yet</p>
      <p class="text-sm">Add universities you are considering and track your application progress.</p>
    </div>

    <!-- Kanban columns -->
    <div v-if="entries.length > 0" class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div v-for="col in columns" :key="col.status" class="flex flex-col gap-3">
        <div :class="['text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full text-center', col.labelClass]">
          {{ col.status }} <span class="ml-1 opacity-70">({{ byStatus(col.status).length }})</span>
        </div>
        <div
          v-for="entry in byStatus(col.status)"
          :key="entry._id"
          class="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition"
        >
          <p class="font-bold text-blue-900 text-sm mb-1 leading-tight">{{ entry.universityName }}</p>
          <p v-if="entry.country" class="text-xs text-gray-500 mb-2">{{ entry.country }}</p>
          <a v-if="entry.website" :href="formatUrl(entry.website)" target="_blank" class="text-xs text-blue-500 hover:underline block mb-3">Website</a>

          <!-- Status selector -->
          <select
            :value="entry.status"
            @change="updateStatus(entry._id, ($event.target as HTMLSelectElement).value)"
            class="w-full text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 mb-2"
          >
            <option v-for="c in columns" :key="c.status" :value="c.status">{{ c.status }}</option>
          </select>

          <textarea
            :value="entry.notes"
            @blur="updateNotes(entry._id, ($event.target as HTMLTextAreaElement).value, entry.status)"
            placeholder="Notes..."
            rows="2"
            class="w-full text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none mb-2"
          ></textarea>

          <button @click="removeEntry(entry._id)" class="text-xs text-red-400 hover:text-red-600 transition">Remove</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../../services/api';

interface TrackerEntry {
  _id: string;
  universityName: string;
  country: string;
  website: string;
  status: string;
  notes: string;
}

const entries = ref<TrackerEntry[]>([]);
const loading = ref(false);
const adding = ref(false);
const showAdd = ref(false);
const newEntry = ref({ universityName: '', country: '', website: '' });

const columns = [
  { status: 'Interested', labelClass: 'bg-gray-100 text-gray-700' },
  { status: 'Applied', labelClass: 'bg-blue-100 text-blue-700' },
  { status: 'Waiting', labelClass: 'bg-yellow-100 text-yellow-700' },
  { status: 'Accepted', labelClass: 'bg-green-100 text-green-700' },
  { status: 'Rejected', labelClass: 'bg-red-100 text-red-700' },
];

const byStatus = (status: string) => entries.value.filter(e => e.status === status);
const formatUrl = (url: string) => url.startsWith('http') ? url : `https://${url}`;

const load = async () => {
  loading.value = true;
  try {
    const res = await api.get('users/tracker');
    entries.value = res.data;
  } catch {} finally { loading.value = false; }
};

const addEntry = async () => {
  if (!newEntry.value.universityName) return;
  adding.value = true;
  try {
    const res = await api.post('users/tracker', newEntry.value);
    entries.value.push(res.data);
    showAdd.value = false;
    newEntry.value = { universityName: '', country: '', website: '' };
  } catch {} finally { adding.value = false; }
};

const updateStatus = async (id: string, status: string) => {
  const entry = entries.value.find(e => e._id === id);
  if (!entry) return;
  entry.status = status;
  try { await api.patch(`users/tracker/${id}`, { status, notes: entry.notes }); } catch {}
};

const updateNotes = async (id: string, notes: string, status: string) => {
  const entry = entries.value.find(e => e._id === id);
  if (!entry || entry.notes === notes) return;
  entry.notes = notes;
  try { await api.patch(`users/tracker/${id}`, { status, notes }); } catch {}
};

const removeEntry = async (id: string) => {
  entries.value = entries.value.filter(e => e._id !== id);
  try { await api.delete(`users/tracker/${id}`); } catch {}
};

onMounted(load);
</script>
