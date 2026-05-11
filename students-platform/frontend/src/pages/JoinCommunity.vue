<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <section class="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <p class="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full mb-5">
            Student communities
          </p>

          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Find your study abroad circle.
          </h1>

          <p class="text-lg text-gray-600 leading-relaxed max-w-xl">
            Join focused communities based on countries, scholarships, study fields, and student life topics.
          </p>
        </div>

        <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <div class="community-hero-image"></div>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 mb-8">
      <div class="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100">
        <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div class="flex-1">
            <div class="relative">
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchInput"
                placeholder="Search communities, e.g. Germany, scholarships, nursing..."
                class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>
          <button
            @click="router.push('/community/create')"
            class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Community
          </button>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside class="bg-white rounded-2xl shadow-xl p-6 h-fit border-2 border-blue-100">
          <h3 class="font-bold text-gray-900 mb-4 text-lg">Categories</h3>
          <CategoryFilter :vertical="true" @change="handleCategoryChange" />
        </aside>

        <main>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900">
              Communities
            </h2>

            <p class="text-sm text-gray-500 bg-white px-4 py-2 rounded-full border-2 border-gray-200">
              {{ filteredCommunities.length }} found
            </p>
          </div>

          <div v-if="filteredCommunities.length === 0" class="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-blue-100">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No communities found</h3>
            <p class="text-gray-600">Try adjusting your search or category filter</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CommunityCard
              v-for="community in filteredCommunities"
              :key="community.id"
              :community="community"
              @toggle-join="toggleJoin"
              @view="viewCommunity"
            />
          </div>
        </main>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import CategoryFilter from "../components/CategoryFilter.vue";
import CommunityCard from "../components/CommunityCard.vue";

interface Community {
  id: number;
  name: string;
  description: string;
  category: string;
  members: number;
  joined: boolean;
}

const router = useRouter();

const searchInput = ref("");
const selectedCategory = ref<string | null>(null);

const communities = ref<Community[]>([
  {
    id: 1,
    name: "Study in Germany",
    description: "For students applying to German universities, Ausbildung, scholarships, and student visas.",
    category: "Country",
    members: 1240,
    joined: false,
  },
  {
    id: 2,
    name: "Scholarship Seekers",
    description: "Share scholarship opportunities, tips, deadlines, and application advice.",
    category: "Scholarships",
    members: 980,
    joined: true,
  },
  {
    id: 3,
    name: "International Nursing Students",
    description: "A space for nursing students planning to study or work abroad.",
    category: "Career",
    members: 430,
    joined: false,
  },
  {
    id: 4,
    name: "Visa Support Circle",
    description: "Ask questions about visa documents, appointments, and embassy processes.",
    category: "Visa",
    members: 760,
    joined: false,
  },
  {
    id: 5,
    name: "University Applications",
    description: "Help with SOPs, documents, application portals, and admission requirements.",
    category: "University Applications",
    members: 690,
    joined: false,
  },
  {
    id: 6,
    name: "Study in USA",
    description: "Connect with students applying to US universities, discussing F-1 visas, GRE/TOEFL, and campus life.",
    category: "Country",
    members: 1580,
    joined: false,
  },
  {
    id: 7,
    name: "Master's in Europe",
    description: "Community for students pursuing Master's degrees in European universities.",
    category: "University Applications",
    members: 850,
    joined: false,
  },
  {
    id: 8,
    name: "Student Housing Abroad",
    description: "Tips on finding accommodation, sharing rent, and navigating housing contracts.",
    category: "Student Life",
    members: 620,
    joined: false,
  },
]);

const filteredCommunities = computed(() => {
  const query = searchInput.value.toLowerCase();

  return communities.value.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(query) ||
      community.description.toLowerCase().includes(query) ||
      community.category.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory.value === null ||
      community.category === selectedCategory.value;

    return matchesSearch && matchesCategory;
  });
});

const handleCategoryChange = (categoryId: string | null) => {
  selectedCategory.value = categoryId;
};

const toggleJoin = (community: Community) => {
  community.joined = !community.joined;
  community.members += community.joined ? 1 : -1;
};

const viewCommunity = (community: Community) => {
  router.push(`/community/${community.id}`);
};
</script>

<style scoped>
.community-hero-image {
  min-height: 280px;
  border-radius: 20px;
  background:
    linear-gradient(rgba(239, 246, 255, 0.15), rgba(239, 246, 255, 0.15)),
    url("../images/community-hero.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
