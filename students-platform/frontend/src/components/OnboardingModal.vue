<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">

      <!-- Progress -->
      <div class="flex items-center gap-2 mb-8">
        <div v-for="i in 3" :key="i" :class="['h-2 flex-1 rounded-full transition-all', i <= step ? 'bg-blue-600' : 'bg-gray-200']"></div>
      </div>

      <!-- Step 1: Country of origin -->
      <div v-if="step === 1">
        <h2 class="text-2xl font-bold text-blue-900 mb-2">Where are you from?</h2>
        <p class="text-gray-500 mb-6">We'll show scholarships and content relevant to your nationality.</p>
        <select v-model="form.country" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
          <option value="">Select your country</option>
          <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <!-- Step 2: Field of study -->
      <div v-if="step === 2">
        <h2 class="text-2xl font-bold text-blue-900 mb-2">What do you want to study?</h2>
        <p class="text-gray-500 mb-6">We'll highlight universities and programmes in your field.</p>
        <select v-model="form.fieldOfStudy" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
          <option value="">Select a field</option>
          <option v-for="f in fields" :key="f" :value="f">{{ f }}</option>
        </select>
      </div>

      <!-- Step 3: Destination -->
      <div v-if="step === 3">
        <h2 class="text-2xl font-bold text-blue-900 mb-2">Where do you want to study?</h2>
        <p class="text-gray-500 mb-6">We'll connect you with communities and visa guides for your destination.</p>
        <select v-model="form.destinationCountry" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
          <option value="">Select destination</option>
          <option v-for="d in destinations" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>

      <!-- Actions -->
      <div class="flex justify-between items-center mt-8">
        <button v-if="step > 1" @click="step--" class="text-gray-500 hover:text-gray-700 font-medium">Back</button>
        <div v-else></div>
        <button
          v-if="step < 3"
          @click="next"
          :disabled="!canProceed"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition disabled:opacity-40"
        >Continue</button>
        <button
          v-else
          @click="submit"
          :disabled="!canProceed || saving"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition disabled:opacity-40"
        >{{ saving ? 'Saving...' : 'Get started' }}</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { api } from '../services/api';
import { useSessionStore } from '../store/session';

const props = defineProps<{ show: boolean }>();
const emit = defineEmits<{ (e: 'done'): void }>();

const session = useSessionStore();
const step = ref(1);
const saving = ref(false);

const form = ref({ country: '', fieldOfStudy: '', destinationCountry: '' });

const canProceed = computed(() => {
  if (step.value === 1) return !!form.value.country;
  if (step.value === 2) return !!form.value.fieldOfStudy;
  return !!form.value.destinationCountry;
});

const next = () => { if (canProceed.value) step.value++; };

const submit = async () => {
  if (!canProceed.value) return;
  saving.value = true;
  try {
    const res = await api.post('users/onboarding', form.value);
    session.setUser({ ...session.user!, ...res.data });
    emit('done');
  } catch {
    // fail silently, user can redo from profile
    emit('done');
  } finally {
    saving.value = false;
  }
};

const countries = [
  'Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Australia','Austria','Azerbaijan',
  'Bangladesh','Belarus','Belgium','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Bulgaria','Burkina Faso','Burundi',
  'Cambodia','Cameroon','Canada','Chad','Chile','China','Colombia','Congo','Costa Rica','Croatia','Cuba','Czech Republic',
  'Denmark','Dominican Republic','Ecuador','Egypt','El Salvador','Ethiopia',
  'Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Guatemala','Guinea',
  'Haiti','Honduras','Hungary','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy',
  'Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kosovo','Kuwait','Kyrgyzstan',
  'Laos','Latvia','Lebanon','Liberia','Libya','Lithuania','Luxembourg',
  'Madagascar','Malawi','Malaysia','Mali','Malta','Mexico','Moldova','Mongolia','Montenegro','Morocco','Mozambique','Myanmar',
  'Namibia','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Macedonia','Norway',
  'Pakistan','Palestine','Panama','Paraguay','Peru','Philippines','Poland','Portugal',
  'Romania','Russia','Rwanda','Saudi Arabia','Senegal','Serbia','Sierra Leone','Singapore','Slovakia','Slovenia',
  'Somalia','South Africa','South Sudan','Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria',
  'Taiwan','Tajikistan','Tanzania','Thailand','Togo','Tunisia','Turkey','Turkmenistan',
  'Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan',
  'Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
];

const fields = [
  'Languages and Cultural Studies',
  'Law, Economics and Social Sciences',
  'Mathematics and Natural Sciences',
  'Computer Science and IT',
  'Human Medicine',
  'Engineering',
  'Architecture and Urban Planning',
  'Art, Music and Sport',
  'Education and Teaching',
  'Agriculture and Environmental Sciences',
  'Business Administration',
  'Political Science and International Relations',
];

const destinations = [
  'Germany','Austria','Switzerland','Netherlands','France','Sweden','Denmark','Norway','Finland',
  'Belgium','Luxembourg','United Kingdom','Ireland','Spain','Italy','Portugal','Poland','Czech Republic',
  'Hungary','Romania','Bulgaria','Croatia','Slovakia','Slovenia','Estonia','Latvia','Lithuania',
  'United States','Canada','Australia','New Zealand','Japan','South Korea','Singapore',
];
</script>
