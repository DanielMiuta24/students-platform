<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pb-32">
    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-4 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <p class="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full mb-5">
            Scholarship search
          </p>

          <h1 class="text-5xl font-bold text-blue-900 mb-5 leading-tight">
            Find scholarships that match your goals.
          </h1>

          <p class="text-lg text-gray-700 leading-relaxed max-w-xl">
            Search for scholarships and training opportunities by field of study,
            location, and program details.
          </p>
        </div>

        <div class="bg-white/70 rounded-2xl shadow-lg p-6">
          <div class="scholarship-hero-image"></div>
        </div>
      </div>
    </section>

    <!-- Search Card -->
    <section class="max-w-6xl mx-auto px-4 -mt-4 mb-10">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-3xl font-bold text-blue-900 mb-6 text-center">
          Search Scholarships
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-[1fr_280px_auto] gap-4">
          <input
            v-model="searchInput"
            placeholder="Field of study, e.g. nursing, business, computer science"
            @keyup.enter="newSearch"
            @input="clearFieldError"
            :class="searchInputClasses"
          />

          <div class="relative">
            <input
              v-model="location"
              @input="filterLocations"
              @focus="showDropdown = true"
              @blur="hideDropdown"
              @keyup.enter="newSearch"
              placeholder="Location optional"
              class="px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <ul
              v-if="shouldShowLocationDropdown"
              class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg"
            >
              <li
                v-for="(loc, index) in filteredLocations"
                :key="index"
                @mousedown="selectLocation(loc)"
                class="px-4 py-2 hover:bg-blue-50 cursor-pointer"
              >
                {{ loc }}
              </li>
            </ul>
          </div>

          <button
            @click="newSearch"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-3 rounded-lg transition duration-200 shadow-md"
          >
            Search
          </button>
        </div>

        <p v-if="isFieldInvalid" class="text-red-600 text-sm mt-4 text-center">
          Please enter a search keyword, for example nursing, computer science, or business.
        </p>
      </div>
    </section>

    <!-- Helpful Cards -->
    <section class="max-w-6xl mx-auto px-4 mb-10" v-if="!hasSearched">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="info-card">
          <div class="info-icon">🎓</div>
          <h3>Search by field</h3>
          <p>Start with your study area, such as nursing, IT, health, or business.</p>
        </div>

        <div class="info-card">
          <div class="info-icon">📍</div>
          <h3>Filter by location</h3>
          <p>Use the location field when you want opportunities in a specific state.</p>
        </div>

        <div class="info-card">
          <div class="info-icon">🌍</div>
          <h3>Compare options</h3>
          <p>Check program details, school names, contact information, and websites.</p>
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

        <div v-else-if="hasNoResults" class="text-center text-gray-600 text-lg py-10">
          No training programs found for "{{ searchInput }}".
        </div>

        <div v-else>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <h2 class="text-2xl font-bold text-blue-900">
              Results for "{{ searchInput }}"
            </h2>

            <p class="text-sm text-gray-500">
              {{ resultCountText }}
            </p>
          </div>

          <ul class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <li
              v-for="(scholarship, index) in scholarships"
              :key="index"
              class="result-card"
            >
              <div>
                <h3 class="text-xl font-bold text-blue-800 mb-2">
                  {{ scholarship.programName }}
                </h3>

                <p class="text-gray-700 font-medium mb-4">
                  {{ scholarship.schoolName }}
                </p>

                <div class="space-y-2 text-sm text-gray-500">
                  <p v-if="hasLocation(scholarship)">
                    <strong class="text-gray-700">Location:</strong>
                    {{ formatLocation(scholarship) }}
                  </p>

                  <p v-if="scholarship.address">
                    <strong class="text-gray-700">Address:</strong>
                    {{ scholarship.address }}
                  </p>

                  <p v-if="scholarship.phone">
                    <strong class="text-gray-700">Phone:</strong>
                    {{ scholarship.phone }}
                  </p>

                  <p v-if="scholarship.programLength">
                    <strong class="text-gray-700">Duration:</strong>
                    {{ scholarship.programLength }}
                  </p>
                </div>
              </div>

              <a
                v-if="scholarship.website"
                :href="formatWebsiteUrl(scholarship.website)"
                target="_blank"
                class="inline-block mt-5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-lg transition"
              >
                Visit Website
              </a>
            </li>
          </ul>

          <div v-if="hasMultiplePages" class="flex justify-between items-center mt-8">
            <button
              @click="goToPrevPage"
              :disabled="isFirstPage"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-2 rounded-lg transition duration-200 disabled:opacity-50"
            >
              Previous
            </button>

            <span class="text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>

            <button
              @click="goToNextPage"
              :disabled="isLastPage"
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
import { computed, ref } from "vue";
import { api } from "../services/api";
import { US_STATES } from "../utils/locations";

type Scholarship = {
  programName?: string;
  schoolName?: string;
  city?: string;
  state?: string;
  address?: string;
  phone?: string;
  programLength?: string;
  website?: string;
};

const scholarships = ref<Scholarship[]>([]);
const searchInput = ref("");
const location = ref("");
const isLoading = ref(false);
const hasSearched = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const errorMessage = ref("");
const showDropdown = ref(false);
const filteredLocations = ref<string[]>([]);
const isFieldInvalid = ref(false);

const hasNoResults = computed(() => scholarships.value.length === 0);
const hasMultiplePages = computed(() => totalPages.value > 1);
const isFirstPage = computed(() => currentPage.value === 1);
const isLastPage = computed(() => currentPage.value === totalPages.value);

const shouldShowLocationDropdown = computed(
  () => showDropdown.value && filteredLocations.value.length > 0
);

const resultCountText = computed(() => {
  const count = scholarships.value.length;
  return `${count} result${count === 1 ? "" : "s"} found`;
});

const searchInputClasses = computed(() => [
  "px-4 py-3 border rounded-lg focus:outline-none focus:ring-2",
  isFieldInvalid.value
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-blue-500",
]);

const clearFieldError = () => {
  isFieldInvalid.value = false;
};

const resetSearchResults = () => {
  scholarships.value = [];
};

const showSearchValidationError = () => {
  errorMessage.value = "Please enter a search keyword.";
  hasSearched.value = true;
  isFieldInvalid.value = true;
  resetSearchResults();
};

const isSearchInputValid = () => searchInput.value.trim().length > 0;

const buildSearchParams = () => ({
  q: searchInput.value,
  location: location.value || undefined,
});

const updateScholarshipResults = (data: any) => {
  scholarships.value = data.scholarships || [];
  totalPages.value = 1;
};

const getErrorMessage = (error: any) =>
  error.response?.data?.error || "Failed to fetch scholarships. Please try again.";

const handleFetchError = (error: any) => {
  console.error("Error fetching scholarships:", error);
  errorMessage.value = getErrorMessage(error);
  resetSearchResults();
};

const markSearchStarted = () => {
  hasSearched.value = true;
};

const fetchScholarships = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  errorMessage.value = "";
  markSearchStarted();

  try {
    const response = await api.get("scholarships", {
      params: buildSearchParams(),
    });

    updateScholarshipResults(response.data);
  } catch (error: any) {
    handleFetchError(error);
  } finally {
    isLoading.value = false;
  }
};

const newSearch = () => {
  if (!isSearchInputValid()) {
    showSearchValidationError();
    return;
  }

  clearFieldError();
  currentPage.value = 1;
  fetchScholarships();
};

const changePage = (newPage: number) => {
  currentPage.value = newPage;
  fetchScholarships();
};

const goToNextPage = () => {
  if (isLastPage.value) return;
  changePage(currentPage.value + 1);
};

const goToPrevPage = () => {
  if (isFirstPage.value) return;
  changePage(currentPage.value - 1);
};

const filterLocations = () => {
  const searchTerm = location.value.toLowerCase();

  filteredLocations.value = searchTerm
    ? US_STATES.filter((loc) => loc.toLowerCase().includes(searchTerm))
    : [];
};

const selectLocation = (loc: string) => {
  location.value = loc;
  showDropdown.value = false;
};

const hideDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

const hasLocation = (scholarship: Scholarship) =>
  Boolean(scholarship.city || scholarship.state);

const formatLocation = (scholarship: Scholarship) =>
  [scholarship.city, scholarship.state].filter(Boolean).join(", ");

const formatWebsiteUrl = (website: string) =>
  website.startsWith("http") ? website : `https://${website}`;
</script>

<style scoped>
.scholarship-hero-image {
  min-height: 300px;
  border-radius: 20px;
  background:
    linear-gradient(rgba(239, 246, 255, 0.15), rgba(239, 246, 255, 0.15)),
    url("../images/scholarship-hero.png");
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