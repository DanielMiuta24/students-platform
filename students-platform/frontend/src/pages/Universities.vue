<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pb-32">

    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-4 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <p class="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full mb-5">
            University search
          </p>

          <h1 class="text-5xl font-bold text-blue-900 mb-5 leading-tight">
            Find universities that match your study dreams.
          </h1>

          <p class="text-lg text-gray-700 leading-relaxed max-w-xl">
            Search universities by country, explore official websites, and start planning your study abroad journey.
          </p>
        </div>

        <div class="bg-white/70 rounded-2xl shadow-lg p-6">
          <div class="university-hero-image"></div>
        </div>
      </div>
    </section>

    <!-- Search Card -->
    <section class="max-w-6xl mx-auto px-4 -mt-4 mb-10">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-3xl font-bold text-blue-900 mb-6 text-center">
          Search Universities
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
          <input
            v-model="countryInput"
            placeholder="Enter a country, e.g. Germany, Canada, Australia"
            @keyup.enter="newSearch"
            @input="isFieldInvalid = false"
            :class="[
              'px-4 py-3 border rounded-lg focus:outline-none focus:ring-2',
              isFieldInvalid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            ]"
          />

          <button
            @click="newSearch"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-3 rounded-lg transition duration-200 shadow-md"
          >
            Search
          </button>
        </div>

        <p v-if="isFieldInvalid" class="text-red-600 text-sm mt-4 text-center">
          Please enter a country, for example Germany, Canada, or Australia.
        </p>
      </div>
    </section>

    <!-- Helpful Cards -->
    <section class="max-w-6xl mx-auto px-4 mb-10" v-if="!hasSearched">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="info-card">
          <div class="info-icon">🌍</div>
          <h3>Search by country</h3>
          <p>Start with the country where you want to study.</p>
        </div>

        <div class="info-card">
          <div class="info-icon">🏛️</div>
          <h3>Explore universities</h3>
          <p>View university names, countries, and official websites.</p>
        </div>

        <div class="info-card">
          <div class="info-icon">🎓</div>
          <h3>Plan your next step</h3>
          <p>Use each university website to check programs and admission requirements.</p>
        </div>
      </div>
    </section>

    <!-- Results -->
    <section class="max-w-6xl mx-auto px-4 py-5" v-if="hasSearched">
      <div class="bg-white rounded-xl shadow-lg p-8">

        <div v-if="isLoading" class="text-center text-gray-600 text-lg py-10">
          Loading...
        </div>

        <div v-else-if="errorMessage" class="text-center text-red-600 text-lg py-10">
          {{ errorMessage }}
        </div>

        <div v-else-if="universities.length === 0" class="text-center text-gray-600 text-lg py-10">
          No universities found for "{{ countryInput }}".
        </div>

        <div v-else>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <h2 class="text-2xl font-bold text-blue-900">
              Results for "{{ countryInput }}"
            </h2>

            <p class="text-sm text-gray-500">
              {{ universities.length }} result{{ universities.length === 1 ? "" : "s" }} found
            </p>
          </div>

          <ul class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <li
              v-for="university in universities"
              :key="university.name"
              class="result-card"
            >
              <div>
                <h3 class="text-xl font-bold text-blue-800 mb-2">
                  {{ university.name }}
                </h3>

                <p class="text-gray-600 mb-4">
                  {{ university.country }}
                </p>
              </div>

              <a
                :href="university.website"
                target="_blank"
                class="inline-block mt-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-lg transition break-all"
              >
                Visit Website
              </a>
            </li>
          </ul>

          <div v-if="totalPages > 1" class="flex justify-between items-center mt-8">
            <button
              @click="goToPrevPage"
              :disabled="currentPage === 1"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-2 rounded-lg transition duration-200 disabled:opacity-50"
            >
              Previous
            </button>

            <span class="text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>

            <button
              @click="goToNextPage"
              :disabled="currentPage === totalPages"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-2 rounded-lg transition duration-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { api } from "../services/api";

const universities = ref<any[]>([]);
const countryInput = ref("");
const isLoading = ref(false);
const hasSearched = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const errorMessage = ref("");
const isFieldInvalid = ref(false);

const fetchUniversities = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  errorMessage.value = "";

  if (currentPage.value === 1) {
    hasSearched.value = true;
  }

  try {
    const response = await api.get("universities", {
      params: {
        country: countryInput.value,
        page: currentPage.value,
      },
    });

    universities.value = response.data.universities || [];
    totalPages.value = response.data.totalPages || 1;
  } catch (error) {
    console.error("Error fetching universities:", error);
    errorMessage.value = "Failed to fetch universities. Please try again.";
    universities.value = [];
  } finally {
    isLoading.value = false;
  }
};

const newSearch = () => {
  if (!countryInput.value.trim()) {
    errorMessage.value = "Please enter a country.";
    hasSearched.value = true;
    universities.value = [];
    isFieldInvalid.value = true;
    return;
  }

  isFieldInvalid.value = false;
  currentPage.value = 1;
  fetchUniversities();
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchUniversities();
  }
};

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchUniversities();
  }
};
</script>

<style scoped>
.university-hero-image {
  min-height: 300px;
  border-radius: 20px;
  background:
    linear-gradient(rgba(239, 246, 255, 0.15), rgba(239, 246, 255, 0.15)),
    url("../images/university-hero.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.info-card {
  background: white;
  border-radius: 18px;
  padding: 26px;
  box-shadow: 0 12px 30px rgba(15, 42, 95, 0.1);
  border: 1px solid #e5efff;
}

.info-icon {
  width: 56px;
  height: 56px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin-bottom: 16px;
}

.info-card h3 {
  color: #0f2a5f;
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 8px;
}

.info-card p {
  color: #64748b;
  line-height: 1.6;
}

.result-card {
  border: 1px solid #e5efff;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 8px 22px rgba(15, 42, 95, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.2s ease;
}

.result-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(15, 42, 95, 0.13);
}
</style>