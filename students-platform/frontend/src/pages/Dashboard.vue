<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
    <div class="max-w-6xl mx-auto px-4">

      <!-- Header -->
      <section class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p class="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full mb-4">
              My Dashboard
            </p>

            <h1 class="text-4xl font-bold text-blue-900 mb-3">
              Welcome back{{ user?.name ? `, ${user.name}` : "" }}!
            </h1>

            <p class="text-gray-600 text-lg max-w-2xl">
              Track your saved universities, scholarships, communities, and study abroad progress in one place.
            </p>
          </div>

          <router-link
            to="/edit-profile"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-center"
          >
            Edit Profile
          </router-link>
        </div>
      </section>

      <!-- Stats -->
      <section class="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div class="stat-card">
          <p class="stat-number">{{ savedUniversities.length }}</p>
          <p class="stat-label">Saved Universities</p>
        </div>

        <div class="stat-card">
          <p class="stat-number">3</p>
          <p class="stat-label">Scholarships</p>
        </div>

        <div class="stat-card">
          <p class="stat-number">2</p>
          <p class="stat-label">Communities Joined</p>
        </div>

        <div class="stat-card">
          <p class="stat-number">5</p>
          <p class="stat-label">Posts Created</p>
        </div>
      </section>

      <!-- Main Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

        <!-- Left -->
        <main class="space-y-8">

          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-blue-900 mb-6">Quick Actions</h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <router-link to="/universities" class="action-card">
                <div class="action-icon">🏛️</div>
                <h3>Find Universities</h3>
                <p>Search universities by country.</p>
              </router-link>

              <router-link to="/scholarships" class="action-card">
                <div class="action-icon">🎓</div>
                <h3>Find Scholarships</h3>
                <p>Explore funding opportunities.</p>
              </router-link>

              <router-link to="/community" class="action-card">
                <div class="action-icon">👥</div>
                <h3>Join Communities</h3>
                <p>Connect with other students.</p>
              </router-link>
            </div>
          </div>

          <!-- Saved Universities -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-blue-900">Saved Universities</h2>

              <router-link to="/universities" class="text-blue-600 font-bold">
                Search more
              </router-link>
            </div>

            <div v-if="isLoading" class="text-gray-500">
              Loading saved universities...
            </div>

            <div v-else-if="savedUniversities.length === 0" class="empty-card">
              <p class="font-semibold text-blue-900">No saved universities yet</p>
              <p class="text-gray-500 mt-1">Start searching and save universities you like.</p>
            </div>

            <ul v-else class="space-y-4">
              <li
                v-for="university in savedUniversities"
                :key="university.id || university.name"
                class="border border-blue-100 rounded-xl p-5 flex justify-between items-center"
              >
                <div>
                  <h3 class="font-bold text-blue-900">
                    {{ university.name }}
                  </h3>
                  <p class="text-gray-500 text-sm">
                    {{ university.country || "Country not listed" }}
                  </p>
                </div>

                <a
                  v-if="university.website"
                  :href="university.website"
                  target="_blank"
                  class="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-lg"
                >
                  Visit
                </a>
              </li>
            </ul>
          </div>

        </main>

        <!-- Right Sidebar -->
        <aside class="space-y-8">

          <!-- Profile Summary -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-blue-900 mb-5">Profile Summary</h2>

            <div class="flex items-center gap-4 mb-5">
              <img
                :src="user?.profilePicture || 'https://via.placeholder.com/150'"
                class="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
              />

              <div>
                <p class="font-bold text-blue-900">
                  {{ user?.name || "Student" }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ user?.study || "Study abroad explorer" }}
                </p>
              </div>
            </div>

            <router-link
              to="/profile/101"
              class="block text-center bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-4 py-3 rounded-xl"
            >
              View Profile
            </router-link>
          </div>

          <!-- My Communities -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-blue-900 mb-5">My Communities</h2>

            <div class="space-y-3">
              <router-link to="/community/1" class="community-pill">
                Study in Germany
              </router-link>

              <router-link to="/community/2" class="community-pill">
                Scholarship Seekers
              </router-link>
            </div>
          </div>

          <!-- Progress -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-blue-900 mb-5">Study Abroad Progress</h2>

            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-600">Profile completed</span>
                  <span class="font-bold text-blue-700">75%</span>
                </div>
                <div class="h-2 bg-blue-100 rounded-full">
                  <div class="h-2 bg-blue-600 rounded-full w-3/4"></div>
                </div>
              </div>

              <ul class="space-y-2 text-sm text-gray-600">
                <li>✅ Profile created</li>
                <li>✅ Joined communities</li>
                <li>🔲 Saved 3 universities</li>
                <li>🔲 Applied for scholarship</li>
              </ul>
            </div>
          </div>

        </aside>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { api } from "../services/api";
import axios from "axios";

const user = ref<any>(null);
const savedUniversities = ref<any[]>([]);
const isLoading = ref(false);

onMounted(() => {
  fetchUserProfile();
  fetchSavedUniversities();
});

const fetchUserProfile = async () => {
  try {
    const response = await api.get("users/get-profile");
    user.value = response.data;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
  }
};

const fetchSavedUniversities = async () => {
  isLoading.value = true;

  try {
    const response = await axios.get(
      "http://localhost:3000/api/users/my-saved-universities"
    );
    savedUniversities.value = response.data;
  } catch (error) {
    console.error("Failed to fetch saved universities:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.stat-card {
  background: white;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(15, 42, 95, 0.1);
  border: 1px solid #e5efff;
}

.stat-number {
  color: #0f2a5f;
  font-size: 32px;
  font-weight: 900;
}

.stat-label {
  color: #64748b;
  font-weight: 600;
}

.action-card {
  background: #f8fbff;
  border: 1px solid #e5efff;
  border-radius: 18px;
  padding: 22px;
  text-decoration: none;
  transition: 0.2s ease;
}

.action-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(15, 42, 95, 0.12);
}

.action-icon {
  width: 56px;
  height: 56px;
  background: #eff6ff;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin-bottom: 16px;
}

.action-card h3 {
  color: #0f2a5f;
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 8px;
}

.action-card p {
  color: #64748b;
  font-size: 14px;
}

.empty-card {
  background: #f8fbff;
  border: 1px dashed #bfdbfe;
  border-radius: 16px;
  padding: 28px;
  text-align: center;
}

.community-pill {
  display: block;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 700;
  padding: 12px 14px;
  border-radius: 12px;
  text-decoration: none;
}

.community-pill:hover {
  background: #dbeafe;
}
</style>