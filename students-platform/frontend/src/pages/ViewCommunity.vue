<template>
  <div class="min-h-screen bg-gray-100">
    <div class="shadow-md">
      <div class="relative h-40 sm:h-48 md:h-64 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        <div class="absolute inset-0 opacity-20">
          <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div class="absolute top-8 left-1/4 animate-float">
          <svg class="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div class="absolute top-16 right-1/4 animate-float-delayed">
          <svg class="w-10 h-10 text-white/30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <div class="absolute bottom-12 left-1/3 animate-float">
          <svg class="w-8 h-8 text-white/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-4">
        <div class="relative -mt-12 sm:-mt-16 md:-mt-20">
          <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-6 relative z-10">
            <div class="flex flex-col sm:flex-row items-center sm:items-end gap-0 w-full md:w-auto mx-auto md:mx-0 max-w-lg sm:max-w-none">
              <div class="w-24 h-24 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 bg-gradient-to-br from-white to-gray-50 rounded-t-2xl sm:rounded-l-2xl sm:rounded-t-none flex items-center justify-center shadow-2xl border-4 border-white ring-2 ring-gray-100 z-20">
                <svg class="w-12 h-12 sm:w-10 sm:h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 4 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>

              <div class="flex-1 w-full min-h-[100px] sm:h-20 md:h-28 lg:h-36 flex flex-col justify-center items-center sm:items-start px-4 sm:px-4 md:px-6 py-3 sm:py-3 md:py-4 bg-blue-600 rounded-b-2xl sm:rounded-r-2xl sm:rounded-b-none shadow-2xl relative text-center sm:text-left">
                <div class="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 mb-1 sm:mb-1 md:mb-2 flex-wrap">
                  <span class="inline-flex items-center px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-white text-blue-700 shadow-sm">
                    {{ communityCategory }}
                  </span>
                  <span class="inline-flex items-center px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-white text-blue-700 shadow-sm">
                    <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                    Public Community
                  </span>
                </div>

                <h1 class="text-lg sm:text-lg md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-1 sm:mb-1 md:mb-2 leading-tight">
                  {{ communityName }}
                </h1>

                <div class="flex items-center justify-center sm:justify-start gap-2 sm:gap-2 md:gap-3 flex-wrap text-xs sm:text-xs md:text-sm">
                  <div class="inline-flex items-center gap-1 sm:gap-1.5 text-white/95">
                    <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span class="text-xs sm:text-sm font-bold">{{ memberCount.toLocaleString() }}</span>
                    <span class="text-xs sm:text-sm font-medium">members</span>
                  </div>
                  <span class="text-white/60 hidden sm:inline">•</span>
                  <div class="inline-flex items-center gap-1 sm:gap-1.5 text-white/95">
                    <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-xs sm:text-sm font-bold">{{ filteredPosts.length }}</span>
                    <span class="text-xs sm:text-sm font-medium">posts</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="w-full md:w-auto md:pb-3 md:self-end">
              <div class="flex items-center justify-center md:justify-start gap-2 sm:gap-3 flex-wrap md:overflow-x-auto pb-2 md:pb-0">
                <div v-if="sessionStore.isAuthenticated" class="relative">
                  <button
                    @click="toggleJoinedDropdown"
                    class="px-4 sm:px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 whitespace-nowrap text-sm"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Joined
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    v-if="showJoinedDropdown"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20"
                  >
                    <button
                      @click="handleLeaveGroup"
                      class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Leave Group
                    </button>
                  </div>
                </div>
                <button
                  v-else
                  class="px-4 sm:px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 whitespace-nowrap text-sm"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Join Community
                </button>

                <button
                  @click="handleInvitePeople"
                  class="px-4 sm:px-4 md:px-6 py-2 md:py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 whitespace-nowrap text-sm"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Invite
                </button>

                <button
                  @click="handleShare"
                  class="px-4 sm:px-4 md:px-6 py-2 md:py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 whitespace-nowrap text-sm"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white sticky top-0 z-30 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-4">
        <div class="pt-3">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <nav class="flex gap-1 justify-center md:justify-start overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button
              @click="activeTab = 'feed'"
              :class="[
                'px-3 sm:px-4 md:px-6 py-2 md:py-3 font-semibold text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap',
                activeTab === 'feed'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              <div class="flex items-center gap-1.5 sm:gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Feed
              </div>
            </button>
            <button
              @click="activeTab = 'about'"
              :class="[
                'px-3 sm:px-4 md:px-6 py-2 md:py-3 font-semibold text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap',
                activeTab === 'about'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              <div class="flex items-center gap-1.5 sm:gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </div>
            </button>
            <button
              @click="activeTab = 'members'"
              :class="[
                'px-3 sm:px-4 md:px-6 py-2 md:py-3 font-semibold text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap',
                activeTab === 'members'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              <div class="flex items-center gap-1.5 sm:gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Members
              </div>
            </button>
            <button
              @click="activeTab = 'media'"
              :class="[
                'px-3 sm:px-4 md:px-6 py-2 md:py-3 font-semibold text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap',
                activeTab === 'media'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              <div class="flex items-center gap-1.5 sm:gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Media
              </div>
            </button>
          </nav>

            <div class="relative w-full md:flex-1 md:max-w-md">
              <div class="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search posts..."
                class="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
              >
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 mt-3"></div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-4 py-4 sm:py-6">
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div class="flex-1 w-full lg:max-w-3xl mx-auto lg:mx-0">

      <div v-if="activeTab === 'feed'">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <h2 class="text-sm font-semibold text-gray-700 mb-3">Filter by Category</h2>
        <CategoryFilter @change="handleCategoryChange" />
      </div>

      <div v-if="pinnedPosts.length > 0" class="mb-4">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border-2 border-blue-200 p-4 mb-3">
          <div class="flex items-center gap-2 mb-3">
            <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" />
            </svg>
            <h2 class="text-lg font-bold text-gray-900">Pinned Posts</h2>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">
              {{ pinnedPosts.length }}
            </span>
          </div>
          <p class="text-sm text-gray-600">Important announcements and featured content</p>
        </div>

        <div class="space-y-4">
          <div
            v-for="post in pinnedPosts"
            :key="post.id"
            class="relative isolate"
          >
            <div class="absolute -top-2 -right-2 z-[5]">
              <div class="bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-semibold">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" />
                </svg>
                Pinned
              </div>
            </div>

            <PostCard
              :post="post"
              :is-owner="isPostOwner(post)"
              @update="handlePostUpdate"
              @delete="handlePostDelete"
            />
          </div>
        </div>

        <div class="my-6 flex items-center">
          <div class="flex-1 border-t-2 border-gray-300"></div>
          <div class="px-4 text-sm font-semibold text-gray-500">Recent Posts</div>
          <div class="flex-1 border-t-2 border-gray-300"></div>
        </div>
      </div>

      <div class="mb-4">
        <CreatePostForm
          v-if="sessionStore.isAuthenticated"
          @post-created="handlePostCreated"
        />
        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p class="text-gray-600 mb-4">Sign in to create a post</p>
          <button
            @click="$router.push('/login')"
            class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </div>
      </div>

      <div v-if="loading" class="space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="w-12 h-12 mx-auto text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-700 font-semibold mb-2">Failed to load posts</p>
        <p class="text-red-600 text-sm mb-4">{{ error }}</p>
        <button
          @click="fetchPosts"
          class="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>

      <div v-else-if="filteredPosts.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
        <p class="text-gray-600 mb-6">
          {{ selectedCategory ? 'No posts in this category.' : 'Be the first to share something with the community!' }}
        </p>
        <button
          v-if="selectedCategory"
          @click="selectedCategory = null"
          class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Show All Posts
        </button>
      </div>

      <div v-else class="space-y-4">
        <PostCard
          v-for="post in filteredPosts"
          :key="post.id"
          :post="post"
          :is-owner="isPostOwner(post)"
          @update="handlePostUpdate"
          @delete="handlePostDelete"
        />
      </div>

      <div v-if="hasMore && !loading" class="mt-6 text-center">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loadingMore ? 'Loading...' : 'Load More Posts' }}
        </button>
      </div>
      </div>

      <div v-else-if="activeTab === 'about'" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="relative h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 overflow-hidden">
          <div class="absolute inset-0 opacity-10">
            <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="about-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#about-pattern)" />
            </svg>
          </div>

          <div class="relative h-full flex items-center px-4 sm:px-6 md:px-8">
            <div class="flex items-center gap-3 sm:gap-4 md:gap-6">
              <div class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <svg class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">About</h2>
                <p class="text-sm sm:text-base text-blue-100">{{ communityName }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-6 md:p-8">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p class="text-gray-700 leading-relaxed">
                {{ communityDescription }}
              </p>
            </div>

            <div class="border-t pt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 font-medium">Members</p>
                      <p class="text-2xl font-bold text-gray-900">{{ memberCount.toLocaleString() }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 font-medium">Total Posts</p>
                      <p class="text-2xl font-bold text-gray-900">{{ posts.length }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 font-medium">Created</p>
                      <p class="text-2xl font-bold text-gray-900">{{ communityCreatedDate }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t pt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Category</h3>
              <span class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                {{ communityCategory }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'members'" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="relative h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 overflow-hidden">
          <div class="absolute inset-0 opacity-10">
            <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="members-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#members-pattern)" />
            </svg>
          </div>

          <div class="relative h-full flex items-center px-4 sm:px-6 md:px-8">
            <div class="flex items-center gap-3 sm:gap-4 md:gap-6">
              <div class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <svg class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">Members</h2>
                <p class="text-xs sm:text-sm md:text-base text-blue-100">Community members and administrators</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-6 md:p-8">
          <div class="mb-4 sm:mb-6">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="membersSearchQuery"
                type="text"
                placeholder="Search members..."
                class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                v-if="membersSearchQuery"
                @click="membersSearchQuery = ''"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg class="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="mb-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-1">Total Members</p>
                <p class="text-4xl font-extrabold text-blue-600">{{ memberCount.toLocaleString() }}</p>
              </div>
              <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-1.5 sm:gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
                <h3 class="text-xl font-bold text-gray-900">Administrators</h3>
              </div>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                1 Admin
              </span>
            </div>

            <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div class="p-4 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-1.5 sm:gap-2">
                      <h4 class="font-semibold text-gray-900">Admin User</h4>
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                        Admin
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">Community administrator</p>
                  </div>
                </div>
              </div>

              <div class="p-6 text-center bg-gray-50">
                <p class="text-sm text-gray-600">More administrators will be displayed here</p>
              </div>
            </div>
          </div>

          <div class="text-center py-12">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">All Members</h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              The full member list is coming soon. You'll be able to see all community members and connect with them.
            </p>
            <div class="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Coming Soon
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'media'" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="relative h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 overflow-hidden">
          <div class="absolute inset-0 opacity-10">
            <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="media-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#media-pattern)" />
            </svg>
          </div>

          <div class="relative h-full flex items-center px-4 sm:px-6 md:px-8">
            <div class="flex items-center gap-3 sm:gap-4 md:gap-6">
              <div class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <svg class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">Media</h2>
                <p class="text-xs sm:text-sm md:text-base text-blue-100">Photos and videos shared in this community</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-6 md:p-8">
          <div v-if="recentImages.length > 0">
            <div class="mb-3 sm:mb-4 flex items-center justify-between">
              <p class="text-sm text-gray-600 font-medium">{{ recentImages.length }} media items</p>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              <div
                v-for="(image, index) in recentImages"
                :key="index"
                class="aspect-square rounded-xl overflow-hidden bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <img
                  :src="image.url"
                  :alt="image.alt || 'Community image'"
                  class="w-full h-full object-cover group-hover:brightness-95"
                />
              </div>
            </div>
          </div>
          <div v-else class="text-center py-16">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No Media Yet</h3>
            <p class="text-gray-600 max-w-md mx-auto">
              When community members share photos and videos in their posts, they'll appear here.
            </p>
          </div>
        </div>
      </div>

        </div>

        <div class="hidden lg:block w-full lg:w-[32rem] space-y-4 lg:sticky lg:top-24 self-start flex-shrink-0">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-4 border-b border-gray-200 bg-gray-50">
              <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About Community
              </h2>
            </div>
            <div class="p-4 space-y-3">
              <p class="text-sm text-gray-700 leading-relaxed">
                {{ communityDescription }}
              </p>
              <div class="pt-3 border-t border-gray-100 space-y-2">
                <div class="flex items-center gap-2 text-sm">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span class="text-gray-700 font-medium">{{ memberCount }} members</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-gray-700 font-medium">{{ filteredPosts.length }} posts</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-gray-700 font-medium">Created {{ communityCreatedDate }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-4 border-b border-gray-200 bg-gray-50">
              <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Recent Pictures
              </h2>
            </div>
            <div class="p-4">
              <div v-if="recentImages.length > 0" class="grid grid-cols-3 gap-2">
                <div
                  v-for="(image, index) in recentImages"
                  :key="index"
                  class="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition cursor-pointer"
                >
                  <img
                    :src="image.url"
                    :alt="image.alt || 'Community image'"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div v-else class="text-center py-8">
                <svg class="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-sm text-gray-500">No images yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showLeaveConfirmation"
      class="fixed inset-0 flex items-center justify-center z-50 px-4"
      @click.self="showLeaveConfirmation = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all border-2 border-blue-200">
        <div class="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Leave Community?</h3>
              <p class="text-blue-100 text-sm">This action cannot be undone</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <p class="text-gray-700 mb-4 leading-relaxed">
            Are you sure you want to leave <span class="font-semibold text-gray-900">{{ communityName }}</span>?
          </p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div class="flex gap-3">
              <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div class="text-sm text-blue-900">
                <p class="font-semibold mb-1">You will lose access to:</p>
                <ul class="list-disc list-inside space-y-1 text-blue-800">
                  <li>Community posts and discussions</li>
                  <li>Member connections and network</li>
                  <li>Community events and updates</li>
                </ul>
              </div>
            </div>
          </div>
          <p class="text-sm text-gray-600">
            You can always rejoin this community later if you change your mind.
          </p>
        </div>

        <div class="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
          <button
            @click="showLeaveConfirmation = false"
            class="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            @click="confirmLeaveGroup"
            class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Leave Community
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showLeaveSuccess"
      class="fixed inset-0 flex items-center justify-center z-50 px-4 pointer-events-none"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all border-2 border-green-200 pointer-events-auto">
        <div class="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Successfully Left Community</h3>
              <p class="text-green-100 text-sm">You are no longer a member</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <p class="text-gray-700 leading-relaxed mb-4">
            You have successfully left <span class="font-semibold text-gray-900">{{ communityName }}</span>.
          </p>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex gap-3">
              <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div class="text-sm text-green-900">
                <p class="font-medium">You can rejoin this community anytime by clicking the "Join Community" button.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-4 flex items-center justify-end">
          <button
            @click="showLeaveSuccess = false"
            class="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Got it
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showInviteModal"
      class="fixed inset-0 flex items-center justify-center z-50 px-4"
      @click.self="showInviteModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all border-2 border-blue-200">
        <div class="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">Invite People</h3>
                <p class="text-blue-100 text-sm">Select friends, followers, and people you follow</p>
              </div>
            </div>
            <button
              @click="showInviteModal = false"
              class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-4 border-b border-gray-200">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="inviteSearchQuery"
              type="text"
              placeholder="Search people..."
              class="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div class="max-h-96 overflow-y-auto">
          <div v-if="friendsAndFollowing.length === 0" class="p-12 text-center">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-gray-500">No people found</p>
          </div>

          <div v-else class="divide-y divide-gray-100">
            <div
              v-for="person in friendsAndFollowing"
              :key="person.id"
              class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              @click="toggleInviteSelection(person.id)"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {{ person.name.charAt(0) }}
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1.5 sm:gap-2">
                    <h4 class="font-semibold text-gray-900 truncate">{{ person.name }}</h4>
                    <span
                      :class="[
                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold',
                        person.type === 'friend'
                          ? 'bg-blue-100 text-blue-700'
                          : person.type === 'following'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      ]"
                    >
                      {{ person.type === 'friend' ? 'Friend' : person.type === 'following' ? 'Following' : 'Follower' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">{{ person.mutualFriends }} mutual friends</p>
                </div>

                <div
                  :class="[
                    'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all',
                    selectedInvites.has(person.id)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 hover:border-blue-400'
                  ]"
                >
                  <svg
                    v-if="selectedInvites.has(person.id)"
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div class="text-sm text-gray-600">
            <span v-if="selectedInvites.size > 0" class="font-semibold text-blue-600">
              {{ selectedInvites.size }} {{ selectedInvites.size === 1 ? 'person' : 'people' }} selected
            </span>
            <span v-else>
              No one selected
            </span>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="showInviteModal = false"
              class="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              @click="sendInvites"
              :disabled="selectedInvites.size === 0"
              :class="[
                'px-6 py-2.5 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2',
                selectedInvites.size > 0
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Invites
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showInviteSuccess"
      class="fixed inset-0 flex items-center justify-center z-50 px-4 pointer-events-none"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all border-2 border-blue-200 pointer-events-auto">
        <div class="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Invitations Sent!</h3>
              <p class="text-blue-100 text-sm">Your invites have been delivered</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <p class="text-gray-700 leading-relaxed mb-4">
            You have successfully sent {{ invitedCount }} {{ invitedCount === 1 ? 'invitation' : 'invitations' }} to join <span class="font-semibold text-gray-900">{{ communityName }}</span>.
          </p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex gap-3">
              <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div class="text-sm text-blue-900">
                <p class="font-medium">Your friends will receive a notification and can join the community with a single click.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-4 flex items-center justify-end">
          <button
            @click="showInviteSuccess = false"
            class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSessionStore } from '../store/session';
import CategoryFilter from '../components/CategoryFilter.vue';
import CreatePostForm from '../components/CreatePostForm.vue';
import PostCard from '../components/PostCard.vue';
import { getScoredFeed } from '../api/post';
import type { SafePost } from '../types/post';

const route = useRoute();
const sessionStore = useSessionStore();

const posts = ref<SafePost[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref<string | null>(null);
const selectedCategory = ref<string | null>(null);
const hasMore = ref(false);
const nextCursor = ref<string | null>(null);
const activeTab = ref<'feed' | 'about' | 'members' | 'media'>('feed');
const searchQuery = ref('');
const showJoinedDropdown = ref(false);
const showLeaveConfirmation = ref(false);
const showLeaveSuccess = ref(false);
const showInviteModal = ref(false);
const showInviteSuccess = ref(false);
const inviteSearchQuery = ref('');
const selectedInvites = ref<Set<string>>(new Set());
const invitedCount = ref(0);
const membersSearchQuery = ref('');

const pinnedPosts = ref<SafePost[]>([]);

const communityId = computed(() => Number(route.params.id));

const communityName = computed(() => {
  const communities: Record<number, string> = {
    1: 'Study in Germany',
    2: 'Scholarship Seekers',
    3: 'Student Life',
  };
  return communities[communityId.value] || 'Community';
});

const communityCategory = computed(() => {
  const categories: Record<number, string> = {
    1: 'Education & Study Abroad',
    2: 'Scholarships & Financial Aid',
    3: 'Student Life & Campus',
  };
  return categories[communityId.value] || 'General';
});

const filteredPosts = computed(() => {
  let filtered = posts.value;

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(post => {
      if (typeof post.category === 'string') {
        return post.category === selectedCategory.value;
      }
      if (typeof post.category === 'object' && post.category !== null) {
        return (post.category as any).id === selectedCategory.value;
      }
      return false;
    });
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(post => {
      const title = post.title?.toLowerCase() || '';
      const content = typeof post.content === 'string'
        ? post.content.toLowerCase()
        : JSON.stringify(post.content).toLowerCase();
      const authorName = typeof post.author === 'object' && post.author !== null
        ? ((post.author as any).name || '').toLowerCase()
        : '';

      return title.includes(query) || content.includes(query) || authorName.includes(query);
    });
  }

  return filtered;
});

const communityDescription = computed(() => {
  const descriptions: Record<number, string> = {
    1: 'A community for students interested in studying in Germany. Share experiences, ask questions, and connect with fellow students.',
    2: 'Find and share scholarship opportunities for students worldwide. Get tips on applications and connect with scholarship recipients.',
    3: 'Discuss all aspects of student life, from academics to social activities. Share tips, experiences, and support each other.',
  };
  return descriptions[communityId.value] || 'A community for students to connect and share.';
});

const memberCount = computed(() => {
  const counts: Record<number, number> = {
    1: 1247,
    2: 892,
    3: 2156,
  };
  return counts[communityId.value] || 0;
});

const communityCreatedDate = computed(() => {
  const dates: Record<number, string> = {
    1: 'Jan 2024',
    2: 'Mar 2024',
    3: 'Dec 2023',
  };
  return dates[communityId.value] || 'Recently';
});

const recentImages = computed(() => {
  const images: Array<{ url: string; alt?: string }> = [];

  // Extract images from posts
  for (const post of filteredPosts.value) {
    if (post.images && Array.isArray(post.images)) {
      for (const img of post.images) {
        if (typeof img === 'object' && img !== null && 'url' in img) {
          images.push({
            url: img.url,
            alt: img.alt || 'Post image',
          });
        }
        if (images.length >= 9) break; // Show max 9 images (3x3 grid)
      }
    }
    if (images.length >= 9) break;
  }

  return images;
});

// Mock data for friends, following, and followers (TODO: Replace with actual API call)
const friendsAndFollowing = computed(() => {
  const mockData = [
    { id: '1', name: 'Sarah Johnson', avatar: null, type: 'friend', mutualFriends: 12 },
    { id: '2', name: 'Michael Chen', avatar: null, type: 'following', mutualFriends: 8 },
    { id: '3', name: 'Emma Williams', avatar: null, type: 'friend', mutualFriends: 15 },
    { id: '4', name: 'David Brown', avatar: null, type: 'following', mutualFriends: 5 },
    { id: '5', name: 'Lisa Anderson', avatar: null, type: 'friend', mutualFriends: 20 },
    { id: '6', name: 'James Wilson', avatar: null, type: 'follower', mutualFriends: 3 },
    { id: '7', name: 'Sophia Martinez', avatar: null, type: 'friend', mutualFriends: 18 },
    { id: '8', name: 'Robert Taylor', avatar: null, type: 'following', mutualFriends: 7 },
    { id: '9', name: 'Jennifer Lee', avatar: null, type: 'follower', mutualFriends: 6 },
    { id: '10', name: 'Kevin Park', avatar: null, type: 'follower', mutualFriends: 9 },
    { id: '11', name: 'Amanda Garcia', avatar: null, type: 'friend', mutualFriends: 14 },
    { id: '12', name: 'Christopher Moore', avatar: null, type: 'follower', mutualFriends: 4 },
  ];

  // Filter by search query
  if (inviteSearchQuery.value.trim()) {
    const query = inviteSearchQuery.value.toLowerCase();
    return mockData.filter(person =>
      person.name.toLowerCase().includes(query)
    );
  }

  return mockData;
});

const isPostOwner = (post: SafePost): boolean => {
  if (!sessionStore.user) return false;

  const authorId = typeof post.author === 'string'
    ? post.author
    : (post.author as any)?.id;

  return authorId === sessionStore.user.id;
};

const fetchPosts = async (cursor?: string | null) => {
  try {
    if (!cursor) {
      loading.value = true;
    } else {
      loadingMore.value = true;
    }
    error.value = null;

    const result = await getScoredFeed({
      cursor: cursor || undefined,
      limit: 10,
    });

    if (!cursor) {
      posts.value = result.posts;
    } else {
      posts.value = [...posts.value, ...result.posts];
    }

    hasMore.value = result.hasMore;
    nextCursor.value = result.nextCursor;
  } catch (err: any) {
    error.value = err.message || 'Failed to load posts';
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMore = () => {
  if (hasMore.value && nextCursor.value) {
    fetchPosts(nextCursor.value);
  }
};

const handleCategoryChange = (categoryId: string | null) => {
  selectedCategory.value = categoryId;
};

const handlePostCreated = (newPost: SafePost) => {
  posts.value = [newPost, ...posts.value];
};

const handlePostUpdate = (updatedPost: SafePost) => {
  const index = posts.value.findIndex(p => p.id === updatedPost.id);
  if (index !== -1) {
    posts.value[index] = updatedPost;
  }
};

const handlePostDelete = (postId: string) => {
  posts.value = posts.value.filter(p => p.id !== postId);
};

const toggleJoinedDropdown = () => {
  showJoinedDropdown.value = !showJoinedDropdown.value;
};

const handleLeaveGroup = () => {
  showJoinedDropdown.value = false;

  showLeaveConfirmation.value = true;
};

const confirmLeaveGroup = () => {
  showLeaveConfirmation.value = false;

  console.log('Leaving community:', communityId.value);

  showLeaveSuccess.value = true;

  setTimeout(() => {
    showLeaveSuccess.value = false;
  }, 3000);
};

const handleInvitePeople = () => {
  showInviteModal.value = true;
  selectedInvites.value.clear();
  inviteSearchQuery.value = '';
};

const toggleInviteSelection = (userId: string) => {
  if (selectedInvites.value.has(userId)) {
    selectedInvites.value.delete(userId);
  } else {
    selectedInvites.value.add(userId);
  }
};

const sendInvites = () => {
  invitedCount.value = selectedInvites.value.size;

  console.log('Sending invites to:', Array.from(selectedInvites.value));

  showInviteModal.value = false;

  showInviteSuccess.value = true;

  setTimeout(() => {
    showInviteSuccess.value = false;
  }, 3000);

  selectedInvites.value.clear();
};

const handleShare = () => {
  const shareUrl = window.location.href;
  const shareText = `Check out ${communityName.value} community!`;

  if (navigator.share) {
    navigator.share({
      title: communityName.value,
      text: shareText,
      url: shareUrl,
    }).catch((error) => {
      console.log('Error sharing:', error);
    });
  } else {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Community link copied to clipboard!');
    }).catch((error) => {
      console.log('Error copying to clipboard:', error);
      alert(`Share this community:\n${shareUrl}`);
    });
  }
};

onMounted(() => {
  fetchPosts();

  pinnedPosts.value = [
    {
      id: 'pinned-1',
      title: 'Welcome to Study in Germany Community! 🎓',
      content: 'We\'re excited to have you here! This community is dedicated to helping students pursue their dreams of studying in Germany. Share your experiences, ask questions, and connect with fellow students.',
      author: {
        id: 'admin-1',
        name: 'Community Admin',
        avatar: null,
      },
      category: { id: '1', name: 'Announcements' },
      createdAt: '2024-01-15T10:00:00Z',
      images: [],
      likes: 45,
      comments: 12,
      isLiked: false,
    },
  ] as SafePost[];

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.relative')) {
      showJoinedDropdown.value = false;
    }
  });
});
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 8s ease-in-out infinite;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-10px);
  }
  75% {
    transform: translateY(-25px) translateX(5px);
  }
}

@media (max-width: 768px) {
  .max-w-4xl, .max-w-7xl {
    padding-left: 0;
    padding-right: 0;
  }

  .px-4 {
    padding-left: 12px;
    padding-right: 12px;
  }
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

@media (max-width: 1024px) {
  .lg\:block {
    display: none !important;
  }
}
</style>
