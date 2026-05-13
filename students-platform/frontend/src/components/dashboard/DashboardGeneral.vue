<template>
  <div class="space-y-6">
    <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <div class="flex items-start gap-6">
        <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg flex-shrink-0">
          {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-3xl font-bold text-blue-900">
              {{ user?.name || "User" }}
            </h1>
            <span :class="userTypeClass">
              <svg class="w-3.5 h-3.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="userTypeIcon === 'student'" d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                <path v-else-if="userTypeIcon === 'seeker'" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
                <path v-else-if="userTypeIcon === 'admin'" d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                <path v-else d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              {{ user?.type || 'StudySeeker' }}
            </span>
          </div>
          <p class="text-gray-600 mb-6">
            Track your saved universities, scholarships, and communities.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <div class="flex items-center gap-2 text-sm">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="text-gray-700"><strong>Email:</strong> {{ user?.email || 'N/A' }}</span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-gray-700"><strong>Username:</strong> @{{ user?.username || 'N/A' }}</span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-gray-700"><strong>Location:</strong> {{ user?.location || 'Not specified' }}</span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span class="text-gray-700"><strong>Student Status:</strong>
                <span v-if="user?.isVerified" class="text-green-600 font-semibold">✓ Verified</span>
                <span v-else class="text-amber-600 font-semibold">Not Verified</span>
              </span>
            </div>

            <div v-if="user?.universityEmail" class="flex items-center gap-2 text-sm col-span-2">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              <span class="text-gray-700"><strong>University Email:</strong> {{ user?.universityEmail }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="stat-card group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div class="stat-icon bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-110 transition-all">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p class="stat-number">{{ savedUniversitiesCount }}</p>
        <p class="stat-label">Saved Universities</p>
      </div>

      <div class="stat-card group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div class="stat-icon bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 group-hover:scale-110 transition-all">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="stat-number">0</p>
        <p class="stat-label">Saved Scholarships</p>
      </div>

      <div class="stat-card group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div class="stat-icon bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 group-hover:scale-110 transition-all">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p class="stat-number">{{ communitiesCount }}</p>
        <p class="stat-label">Communities Joined</p>
      </div>

      <div class="stat-card group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div class="stat-icon bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 group-hover:scale-110 transition-all">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="stat-number">{{ postsCount }}</p>
        <p class="stat-label">Posts Created</p>
      </div>
    </div>

    <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Quick Actions
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <router-link to="/universities" class="action-card group">
          <div class="action-icon bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-110 transition-all">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="font-bold text-gray-900 mb-2 text-lg">Find Universities</h3>
          <p class="text-sm text-gray-600">Search universities by country and save your favorites</p>
        </router-link>

        <router-link to="/scholarships" class="action-card group">
          <div class="action-icon bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 group-hover:scale-110 transition-all">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="font-bold text-gray-900 mb-2 text-lg">Find Scholarships</h3>
          <p class="text-sm text-gray-600">Explore funding opportunities for your studies abroad</p>
        </router-link>

        <router-link to="/community" class="action-card group">
          <div class="action-icon bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 group-hover:scale-110 transition-all">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="font-bold text-gray-900 mb-2 text-lg">Join Communities</h3>
          <p class="text-sm text-gray-600">Connect with other students and share experiences</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  user: any;
  savedUniversitiesCount: number;
  communitiesCount: number;
  postsCount: number;
}>();

const userTypeClass = computed(() => {
  const baseClass = 'inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold shadow-sm';
  const userType = (props.user?.type || '').toLowerCase();

  if (userType.includes('student')) {
    return `${baseClass} bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200`;
  } else if (userType.includes('studyseeker')) {
    return `${baseClass} bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200`;
  } else if (userType.includes('admin')) {
    return `${baseClass} bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200`;
  }
  return `${baseClass} bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200`;
});

const userTypeIcon = computed(() => {
  const userType = (props.user?.type || '').toLowerCase();

  if (userType.includes('student')) {
    return 'student';
  } else if (userType.includes('studyseeker')) {
    return 'seeker';
  } else if (userType.includes('admin')) {
    return 'admin';
  }
  return 'default';
});
</script>

<style scoped>
.stat-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.stat-number {
  color: #111827;
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 6px;
}

.stat-label {
  color: #6b7280;
  font-size: 15px;
  font-weight: 600;
}

.action-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(59, 130, 246, 0.1);
  border-radius: 1.5rem;
  padding: 28px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: block;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}

.action-icon {
  width: 56px;
  height: 56px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
</style>
