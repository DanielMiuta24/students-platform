<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center px-4 py-16">
    <div class="max-w-6xl w-full">
      <!-- Header -->
      <div class="text-center mb-12">
        <p class="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full mb-4">
          Student Communities
        </p>
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Connect with Your<br />
          <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Study Abroad Circle
          </span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Join existing communities or create your own to connect with students worldwide
        </p>
      </div>

      <!-- Choice Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <!-- Join Community Card -->
        <div
          @click="navigateToJoin"
          class="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-blue-500 transform hover:-translate-y-2"
        >
          <div class="relative h-48 bg-gradient-to-br from-blue-600 to-indigo-600 overflow-hidden">
            <div class="absolute inset-0 opacity-20">
              <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="join-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="2" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#join-pattern)" />
              </svg>
            </div>
            <div class="relative h-full flex items-center justify-center">
              <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-3">Browse Communities</h2>
            <p class="text-gray-600 mb-6 leading-relaxed">
              Explore and join communities based on countries, scholarships, study fields, and student life topics
            </p>

            <ul class="space-y-3 mb-6">
              <li class="flex items-center gap-3 text-sm text-gray-700">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Search from hundreds of communities</span>
              </li>
              <li class="flex items-center gap-3 text-sm text-gray-700">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Filter by category and interest</span>
              </li>
              <li class="flex items-center gap-3 text-sm text-gray-700">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Join instantly and start connecting</span>
              </li>
            </ul>

            <div class="flex items-center justify-between">
              <span class="text-blue-600 font-semibold group-hover:text-blue-700">
                Browse Now
              </span>
              <svg class="w-6 h-6 text-blue-600 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Create Community Card -->
        <div
          @click="navigateToCreate"
          class="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-blue-500 transform hover:-translate-y-2"
        >
          <div class="relative h-48 overflow-hidden" style="background-color: #0f2a5f;">
            <div class="absolute inset-0 opacity-20">
              <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="create-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="2" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#create-pattern)" />
              </svg>
            </div>
            <div class="relative h-full flex items-center justify-center">
              <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <svg class="w-12 h-12" style="color: #0f2a5f;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </div>

          <div class="p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-3">Create Community</h2>
            <p class="text-gray-600 mb-6 leading-relaxed">
              Start your own community and bring together students who share your interests and goals
            </p>

            <ul class="space-y-3 mb-6">
              <li class="flex items-center gap-3 text-sm text-gray-700">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Easy step-by-step creation process</span>
              </li>
              <li class="flex items-center gap-3 text-sm text-gray-700">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Customize category and description</span>
              </li>
              <li class="flex items-center gap-3 text-sm text-gray-700">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Become a community leader</span>
              </li>
            </ul>

            <div class="flex items-center justify-between">
              <span class="font-semibold" style="color: #0f2a5f;">
                Get Started
              </span>
              <svg class="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" style="color: #0f2a5f;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
          <div class="text-3xl font-bold text-blue-600 mb-2">500+</div>
          <div class="text-gray-600 font-medium">Active Communities</div>
        </div>
        <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
          <div class="text-3xl font-bold mb-2" style="color: #0f2a5f;">10K+</div>
          <div class="text-gray-600 font-medium">Student Members</div>
        </div>
        <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
          <div class="text-3xl font-bold mb-2" style="color: #0f2a5f;">50+</div>
          <div class="text-gray-600 font-medium">Countries</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToJoin = () => {
  router.push('/community/join');
};

const navigateToCreate = () => {
  router.push('/community/create');
};
</script>
