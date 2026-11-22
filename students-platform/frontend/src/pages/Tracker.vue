<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pb-32">

    <!-- Header -->
    <section class="max-w-6xl mx-auto px-4 py-12">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p class="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full mb-3">Application Tracker</p>
          <h1 class="text-4xl font-bold text-blue-900 leading-tight">Track your university applications.</h1>
          <p class="text-gray-600 mt-2">Keep all your applications organised in one place.</p>
        </div>
        <button @click="openAdd" class="self-start md:self-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition shadow-md">
          + Add University
        </button>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 text-gray-500">Loading...</div>

    <!-- Empty state -->
    <div v-else-if="entries.length === 0" class="max-w-6xl mx-auto px-4 text-center py-20">
      <div class="text-6xl mb-4">🎓</div>
      <h2 class="text-2xl font-bold text-blue-900 mb-2">No applications yet</h2>
      <p class="text-gray-500 mb-6">Add your first university to start tracking your journey.</p>
      <button @click="openAdd" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition">Add University</button>
    </div>

    <!-- Kanban board -->
    <section v-else class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div v-for="col in columns" :key="col.status" class="flex flex-col gap-3">
          <!-- Column header -->
          <div :class="['flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm', col.headerClass]">
            <span>{{ col.label }}</span>
            <span class="bg-white/40 px-2 py-0.5 rounded-full text-xs">{{ byStatus(col.status).length }}</span>
          </div>
          <!-- Cards -->
          <div v-for="entry in byStatus(col.status)" :key="entry._id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2 hover:shadow-md transition">
            <h3 class="font-bold text-blue-900 text-sm leading-tight">{{ entry.universityName }}</h3>
            <p v-if="entry.programme" class="text-xs text-gray-500">{{ entry.programme }}</p>
            <p v-if="entry.country" class="text-xs text-gray-400">{{ entry.country }}</p>
            <p v-if="entry.deadline" class="text-xs text-orange-500 font-medium">Deadline: {{ formatDate(entry.deadline) }}</p>
            <p v-if="entry.notes" class="text-xs text-gray-500 italic border-t border-gray-100 pt-2 mt-1">{{ entry.notes }}</p>
            <!-- Status change -->
            <select :value="entry.status" @change="changeStatus(entry, ($event.target as HTMLSelectElement).value)"
              :class="['text-xs font-semibold px-2 py-1 rounded-lg border-0 mt-1 cursor-pointer', col.selectClass]">
              <option v-for="c in columns" :key="c.status" :value="c.status">{{ c.label }}</option>
            </select>
            <div class="flex gap-2 mt-1">
              <button @click="openEdit(entry)" class="text-xs text-blue-500 hover:text-blue-700">Edit</button>
              <button @click="removeEntry(entry._id)" class="text-xs text-red-400 hover:text-red-600">Remove</button>
            </div>
          </div>
          <!-- Empty column hint -->
          <div v-if="byStatus(col.status).length === 0" class="text-center text-xs text-gray-300 py-4 border-2 border-dashed border-gray-100 rounded-xl">
            No entries
          </div>
        </div>
      </div>
    </section>

    <!-- Add / Edit modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 class="text-2xl font-bold text-blue-900 mb-6">{{ editing ? 'Edit Application' : 'Add University' }}</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">University name *</label>
            <input v-model="form.universityName" placeholder="e.g. TU Munich" class="input-field" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input v-model="form.country" placeholder="e.g. Germany" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="form.status" class="input-field">
                <option v-for="c in columns" :key="c.status" :value="c.status">{{ c.label }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Programme</label>
            <input v-model="form.programme" placeholder="e.g. M.Sc. Computer Science" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Application deadline</label>
            <input v-model="form.deadline" type="date" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea v-model="form.notes" placeholder="Requirements, contacts, links..." rows="3" class="input-field resize-none"></textarea>
          </div>
        </div>
        <p v-if="formError" class="text-red-500 text-sm mt-3">{{ formError }}</p>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="closeModal" class="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
          <button @click="submit" :disabled="saving" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2 rounded-lg transition disabled:opacity-50">
            {{ saving ? 'Saving...' : (editing ? 'Save changes' : 'Add') }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../services/api';
import { useSEO } from '../composables/useSEO';

useSEO({ title: 'Application Tracker | ISCompass', description: 'Track your university applications' });

type Status = 'interested' | 'applied' | 'waiting' | 'accepted' | 'rejected';

interface Entry {
  _id: string;
  universityName: string;
  country: string;
  programme: string;
  status: Status;
  notes: string;
  deadline?: string;
}

const columns = [
  { status: 'interested' as Status, label: 'Interested', headerClass: 'bg-gray-100 text-gray-700', selectClass: 'bg-gray-100 text-gray-700' },
  { status: 'applied' as Status, label: 'Applied', headerClass: 'bg-blue-100 text-blue-700', selectClass: 'bg-blue-100 text-blue-700' },
  { status: 'waiting' as Status, label: 'Waiting', headerClass: 'bg-yellow-100 text-yellow-700', selectClass: 'bg-yellow-100 text-yellow-700' },
  { status: 'accepted' as Status, label: 'Accepted', headerClass: 'bg-green-100 text-green-700', selectClass: 'bg-green-100 text-green-700' },
  { status: 'rejected' as Status, label: 'Rejected', headerClass: 'bg-red-100 text-red-700', selectClass: 'bg-red-100 text-red-700' },
];

const entries = ref<Entry[]>([]);
const loading = ref(true);
const showModal = ref(false);
const saving = ref(false);
const formError = ref('');
const editing = ref<Entry | null>(null);

const emptyForm = () => ({ universityName: '', country: '', programme: '', status: 'interested' as Status, notes: '', deadline: '' });
const form = ref(emptyForm());

const byStatus = (s: Status) => entries.value.filter(e => e.status === s);
const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

onMounted(async () => {
  try {
    const res = await api.get('tracker');
    entries.value = res.data;
  } catch {} finally { loading.value = false; }
});

const openAdd = () => { editing.value = null; form.value = emptyForm(); formError.value = ''; showModal.value = true; };
const openEdit = (entry: Entry) => {
  editing.value = entry;
  form.value = {
    universityName: entry.universityName,
    country: entry.country,
    programme: entry.programme,
    status: entry.status,
    notes: entry.notes,
    deadline: entry.deadline ? entry.deadline.slice(0, 10) : '',
  };
  formError.value = '';
  showModal.value = true;
};
const closeModal = () => { showModal.value = false; editing.value = null; };

const submit = async () => {
  if (!form.value.universityName.trim()) { formError.value = 'University name is required'; return; }
  saving.value = true; formError.value = '';
  try {
    const payload = { ...form.value, deadline: form.value.deadline || undefined };
    if (editing.value) {
      const res = await api.patch(`tracker/${editing.value._id}`, payload);
      const idx = entries.value.findIndex(e => e._id === editing.value!._id);
      if (idx !== -1) entries.value[idx] = res.data;
    } else {
      const res = await api.post('tracker', payload);
      entries.value.unshift(res.data);
    }
    closeModal();
  } catch { formError.value = 'Something went wrong. Please try again.'; }
  finally { saving.value = false; }
};

const changeStatus = async (entry: Entry, newStatus: string) => {
  try {
    const res = await api.patch(`tracker/${entry._id}`, { status: newStatus });
    const idx = entries.value.findIndex(e => e._id === entry._id);
    if (idx !== -1) entries.value[idx] = res.data;
  } catch {}
};

const removeEntry = async (id: string) => {
  try {
    await api.delete(`tracker/${id}`);
    entries.value = entries.value.filter(e => e._id !== id);
  } catch {}
};
</script>

<style scoped>
@reference "../assets/styles.css";

.input-field {
  @apply w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm;
}
</style>
