<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pb-32">

    <!-- Hero -->
    <section class="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 px-4">
      <div class="max-w-5xl mx-auto">
        <p class="inline-block bg-white/20 border border-white/30 font-semibold px-4 py-2 rounded-full text-sm mb-4">Student Videos</p>
        <h1 class="text-4xl font-bold mb-3">Guidance from real students</h1>
        <p class="text-blue-100 text-lg mb-6">Watch videos about visas, scholarships, campus life and more - shared by international students just like you.</p>
        <button @click="showSubmit = true" class="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow">
          + Submit a Video
        </button>
      </div>
    </section>

    <!-- Filters -->
    <section class="max-w-5xl mx-auto px-4 py-8">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat.value"
          @click="toggleCategory(cat.value)"
          :class="['px-4 py-2 rounded-full border-2 font-semibold text-sm transition', activeCategory === cat.value ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-blue-200 text-blue-700 hover:border-blue-400']"
        >
          {{ cat.emoji }} {{ cat.label }}
        </button>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 text-gray-400">Loading videos...</div>

    <!-- Empty -->
    <div v-else-if="videos.length === 0" class="max-w-5xl mx-auto px-4 text-center py-20">
      <div class="text-6xl mb-4">🎬</div>
      <h2 class="text-2xl font-bold text-blue-900 mb-2">No videos yet</h2>
      <p class="text-gray-500 mb-6">Be the first to share a helpful video for international students.</p>
      <button @click="showSubmit = true" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition">Submit a Video</button>
    </div>

    <!-- Video grid -->
    <section v-else class="max-w-5xl mx-auto px-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="video in videos" :key="video._id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
          <!-- YouTube embed -->
          <div class="relative w-full" style="padding-top: 56.25%">
            <iframe
              :src="`https://www.youtube.com/embed/${video.videoId}`"
              class="absolute inset-0 w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <!-- Info -->
          <div class="p-4">
            <div class="flex flex-wrap gap-1 mb-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded-full" :class="categoryClass(video.category)">
                {{ categoryLabel(video.category) }}
              </span>
              <span v-if="video.country" class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{{ video.country }}</span>
            </div>
            <h3 class="font-bold text-blue-900 leading-tight mb-1">{{ video.title }}</h3>
            <p v-if="video.description" class="text-xs text-gray-500 leading-relaxed line-clamp-2">{{ video.description }}</p>
            <div class="flex items-center gap-2 mt-3">
              <img v-if="video.submittedBy?.avatar" :src="video.submittedBy.avatar" class="w-6 h-6 rounded-full object-cover" />
              <div v-else class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                {{ video.submittedBy?.name?.[0]?.toUpperCase() }}
              </div>
              <span class="text-xs text-gray-400">{{ video.submittedBy?.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Submit modal -->
    <div v-if="showSubmit" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 class="text-2xl font-bold text-blue-900 mb-6">Submit a Video</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">YouTube URL *</label>
            <input v-model="form.youtubeUrl" placeholder="https://www.youtube.com/watch?v=..." class="input-field" />
            <p v-if="urlError" class="text-red-500 text-xs mt-1">{{ urlError }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input v-model="form.title" placeholder="e.g. How I got my German student visa" class="input-field" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select v-model="form.category" class="input-field">
                <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input v-model="form.country" placeholder="e.g. Germany" class="input-field" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="form.description" placeholder="What is this video about?" rows="3" class="input-field resize-none"></textarea>
          </div>
          <p class="text-xs text-gray-400">Your video will be reviewed before it goes live.</p>
        </div>
        <p v-if="submitError" class="text-red-500 text-sm mt-3">{{ submitError }}</p>
        <p v-if="submitSuccess" class="text-green-600 text-sm mt-3 font-medium">Submitted! It will appear after review.</p>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="closeSubmit" class="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
          <button @click="submitVideo" :disabled="submitting" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2 rounded-xl transition disabled:opacity-50">
            {{ submitting ? 'Submitting...' : 'Submit' }}
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

useSEO({ title: 'Student Videos | ISCompass', description: 'Watch guidance videos from international students' });

const categories = [
  { value: 'all', label: 'All', emoji: '🎬' },
  { value: 'visa', label: 'Visa', emoji: '🛂' },
  { value: 'scholarships', label: 'Scholarships', emoji: '🎓' },
  { value: 'campus-life', label: 'Campus Life', emoji: '🏫' },
  { value: 'housing', label: 'Housing', emoji: '🏠' },
  { value: 'student-life', label: 'Student Life', emoji: '🎉' },
  { value: 'interviews', label: 'Interviews', emoji: '🎙️' },
  { value: 'other', label: 'Other', emoji: '📹' },
];

const categoryColors: Record<string, string> = {
  visa: 'bg-purple-100 text-purple-700',
  scholarships: 'bg-yellow-100 text-yellow-700',
  'campus-life': 'bg-green-100 text-green-700',
  housing: 'bg-orange-100 text-orange-700',
  'student-life': 'bg-pink-100 text-pink-700',
  interviews: 'bg-blue-100 text-blue-700',
  other: 'bg-gray-100 text-gray-600',
};

const categoryLabel = (val: string) => categories.find(c => c.value === val)?.label || val;
const categoryClass = (val: string) => categoryColors[val] || categoryColors.other;

const videos = ref<any[]>([]);
const loading = ref(true);
const activeCategory = ref('all');
const showSubmit = ref(false);
const submitting = ref(false);
const submitError = ref('');
const submitSuccess = ref(false);
const urlError = ref('');

const emptyForm = () => ({ youtubeUrl: '', title: '', category: 'other', country: '', description: '' });
const form = ref(emptyForm());

const fetchVideos = async () => {
  loading.value = true;
  try {
    const params: any = {};
    if (activeCategory.value !== 'all') params.category = activeCategory.value;
    const res = await api.get('videos', { params });
    videos.value = res.data || [];
  } catch {
    videos.value = [];
  } finally {
    loading.value = false;
  }
};

const toggleCategory = (val: string) => {
  activeCategory.value = val;
  fetchVideos();
};

const closeSubmit = () => {
  showSubmit.value = false;
  form.value = emptyForm();
  submitError.value = '';
  submitSuccess.value = false;
  urlError.value = '';
};

const submitVideo = async () => {
  urlError.value = '';
  submitError.value = '';
  if (!form.value.title.trim()) { submitError.value = 'Title is required'; return; }
  if (!form.value.youtubeUrl.trim()) { urlError.value = 'YouTube URL is required'; return; }
  submitting.value = true;
  try {
    await api.post('videos', form.value);
    submitSuccess.value = true;
    setTimeout(closeSubmit, 2500);
  } catch (err: any) {
    const msg = err?.response?.data?.message;
    if (msg === 'Invalid YouTube URL') urlError.value = 'Please enter a valid YouTube URL';
    else submitError.value = 'Something went wrong. Please try again.';
  } finally {
    submitting.value = false;
  }
};

onMounted(fetchVideos);
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
