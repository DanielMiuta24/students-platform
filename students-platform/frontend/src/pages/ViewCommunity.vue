<template>
  <div class="min-h-screen bg-gray-100">
    <div class="shadow-md">
      <!-- Cover Image Section -->
      <div class="relative h-40 sm:h-48 md:h-64 overflow-hidden">
        <!-- Background: Cover Image or Gradient -->
        <div
          v-if="community?.coverImage"
          class="absolute inset-0"
        >
          <img
            :src="community.coverImage"
            :alt="`${communityName} cover`"
            class="w-full h-full object-cover"
          />
          <!-- Overlay for better text readability -->
          <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
        </div>

        <!-- Fallback Gradient when no cover image -->
        <div
          v-else
          class="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700"
        >
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
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-4">
        <div class="relative -mt-12 sm:-mt-16 md:-mt-20">
          <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-6 relative z-10">
            <div class="flex flex-col sm:flex-row items-center sm:items-end gap-0 w-full md:w-auto mx-auto md:mx-0 max-w-lg sm:max-w-none">
              <div class="w-24 h-24 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 bg-gradient-to-br from-white to-gray-50 rounded-tl-2xl rounded-tr-2xl sm:rounded-tl-2xl sm:rounded-tr-none sm:rounded-bl-none flex items-center justify-center shadow-2xl border-4 border-white ring-2 ring-gray-100 z-20">
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
                <div v-if="sessionStore.isAuthenticated && isJoined">
                  <button
                    @click="handleLeaveGroup"
                    @mouseenter="hoveredJoinButton = true"
                    @mouseleave="hoveredJoinButton = false"
                    :disabled="isFounder"
                    :class="[
                      'px-4 sm:px-4 md:px-6 py-2 md:py-2.5 font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap text-sm',
                      getJoinButtonClass()
                    ]"
                  >
                    {{ getJoinButtonText() }}
                  </button>
                </div>
                <button
                  v-else-if="sessionStore.isAuthenticated && hasPendingRequest"
                  @click="handleCancelRequest"
                  @mouseenter="hoveredRequestButton = true"
                  @mouseleave="hoveredRequestButton = false"
                  :class="[
                    'px-4 sm:px-4 md:px-6 py-2 md:py-2.5 font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap text-sm',
                    hoveredRequestButton
                      ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                      : 'bg-yellow-100 text-yellow-700'
                  ]"
                >
                  <svg v-if="!hoveredRequestButton" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {{ hoveredRequestButton ? 'Cancel Request' : 'Requested' }}
                </button>
                <button
                  v-else-if="sessionStore.isAuthenticated && !isJoined"
                  @click="handleJoinCommunity"
                  class="px-4 sm:px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 whitespace-nowrap text-sm"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Join Community
                </button>
                <button
                  v-else
                  @click="router.push('/login')"
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
            <button
              v-if="isAdmin"
              @click="activeTab = 'settings'"
              :class="[
                'px-3 sm:px-4 md:px-6 py-2 md:py-3 font-semibold text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap',
                activeTab === 'settings'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              <div class="flex items-center gap-1.5 sm:gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
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
        <TabContentHeader
          :icon="`<svg fill='currentColor' viewBox='0 0 24 24'><path d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>`"
          title="About"
          :subtitle="communityName"
          gradient-from="#3b82f6"
          gradient-via="#2563eb"
          gradient-to="#4f46e5"
        />

        <div class="p-4 sm:p-6 lg:p-8">
          <div class="max-w-4xl mx-auto space-y-6">
            <!-- Description Section -->
            <div>
              <h3 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Description
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p class="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {{ communityDescription }}
                </p>
              </div>
            </div>

            <!-- Community Stats Section -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Community Stats
              </h3>
              <CommunityStatsCard :stats="aboutStats" />
            </div>

            <!-- Category Section -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Category
              </h3>
              <div class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border-2 border-blue-200 shadow-sm">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
                {{ communityCategory }}
              </div>
            </div>

            <!-- Founder Section -->
            <div v-if="community?.founder" class="border-t border-gray-200 pt-6">
              <h3 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Founded By
              </h3>
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
                <div class="flex items-center gap-3">
                  <div v-if="community.founder.avatar" class="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                    <img :src="community.founder.avatar" :alt="community.founder.name" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg ring-2 ring-white shadow-md">
                    {{ community.founder.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-base font-semibold text-gray-900 truncate">{{ community.founder.name }}</p>
                    <p class="text-sm text-gray-600">@{{ community.founder.username }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'members'" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
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
                <p class="text-4xl font-extrabold text-blue-600">{{ totalMembers.toLocaleString() }}</p>
              </div>
              <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div v-if="membersLoading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">Loading members...</p>
          </div>

          <div v-else-if="membersError" class="text-center py-12">
            <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Failed to Load Members</h3>
            <p class="text-gray-600 mb-6">{{ membersError }}</p>
            <button
              @click="fetchMembers"
              class="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>

          <template v-else-if="filteredMembers.length > 0">
            <div v-if="adminMembers.length > 0" class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                  </svg>
                  <h3 class="text-xl font-bold text-gray-900">Administrators</h3>
                </div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  {{ adminMembers.length }} {{ adminMembers.length === 1 ? 'Admin' : 'Admins' }}
                </span>
              </div>

              <div class="bg-white border border-gray-200 rounded-xl overflow-visible">
                <div
                  v-for="member in adminMembers"
                  :key="member.id"
                  class="p-4 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0 relative"
                >
                  <div class="flex items-center gap-4">
                    <div v-if="member.avatar" class="w-12 h-12 rounded-full overflow-hidden">
                      <img :src="member.avatar" :alt="member.name" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {{ member.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-1.5 sm:gap-2">
                        <h4 class="font-semibold text-gray-900">{{ member.name }}</h4>
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                          {{ member.role === 'founder' ? 'Founder' : 'Admin' }}
                        </span>
                      </div>
                      <p class="text-sm text-gray-600">@{{ member.username }}</p>
                    </div>

                    <!-- Admin Actions (only for non-founder admins, and only if you're founder) -->
                    <div v-if="isFounder && member.role === 'admin' && member.id !== sessionStore.user?.id" class="relative">
                      <button
                        @click="toggleMemberDropdown(member.id)"
                        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      <div
                        v-if="openMemberDropdown === member.id"
                        class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
                      >
                        <button
                          @click="handleDemoteMember(member)"
                          class="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                          Demote to Member
                        </button>
                        <button
                          @click="handleRemoveMember(member)"
                          class="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-2"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Remove (Can Rejoin)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="regularMembers.length > 0" class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 class="text-xl font-bold text-gray-900">Members</h3>
                </div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                  {{ regularMembers.length }} {{ regularMembers.length === 1 ? 'Member' : 'Members' }}
                </span>
              </div>

              <div class="bg-white border border-gray-200 rounded-xl overflow-visible">
                <div
                  v-for="member in regularMembers"
                  :key="member.id"
                  class="p-4 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0 relative"
                >
                  <div class="flex items-center gap-4">
                    <div v-if="member.avatar" class="w-12 h-12 rounded-full overflow-hidden">
                      <img :src="member.avatar" :alt="member.name" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {{ member.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900">{{ member.name }}</h4>
                      <p class="text-sm text-gray-600">@{{ member.username }}</p>
                    </div>

                    <!-- Admin Actions -->
                    <div v-if="isAdmin && member.id !== sessionStore.user?.id" class="relative">
                      <button
                        @click="toggleMemberDropdown(member.id)"
                        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      <div
                        v-if="openMemberDropdown === member.id"
                        class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
                      >
                        <button
                          v-if="isFounder"
                          @click="handlePromoteMember(member)"
                          class="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          Promote to Admin
                        </button>
                        <button
                          @click="handleRemoveMember(member)"
                          class="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-2"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Remove (Can Rejoin)
                        </button>
                        <button
                          @click="handleBanMember(member)"
                          class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-gray-200"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          Ban Permanently
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div v-else class="text-center py-12">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No Members Found</h3>
            <p class="text-gray-600 max-w-md mx-auto">
              {{ membersSearchQuery ? 'No members match your search criteria.' : 'This community has no members yet.' }}
            </p>
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
                @click="openPostModal(image.post)"
                class="aspect-square rounded-xl overflow-hidden bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer group relative"
              >
                <img
                  :src="image.url"
                  :alt="image.alt || 'Community image'"
                  class="w-full h-full object-cover group-hover:brightness-95"
                />
                <!-- Overlay on hover -->
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
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

      <!-- Settings Tab -->
      <div v-else-if="activeTab === 'settings'" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="relative h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 overflow-hidden">
          <div class="absolute inset-0 opacity-10">
            <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="settings-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#settings-pattern)" />
            </svg>
          </div>

          <div class="relative h-full flex items-center px-4 sm:px-6 md:px-8">
            <div class="flex items-center gap-3 sm:gap-4 md:gap-6">
              <div class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <svg class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">Community Settings</h2>
                <p class="text-xs sm:text-sm md:text-base text-blue-100">Manage your community preferences</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-6 md:p-8 space-y-6">
          <!-- Privacy Settings -->
          <div class="border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Privacy & Access
            </h3>

            <div class="space-y-4">
              <!-- Requires Approval Toggle -->
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <label class="font-semibold text-gray-900 block mb-1">Require Approval to Join</label>
                  <p class="text-sm text-gray-600">When enabled, new members must be approved by an admin before joining</p>
                </div>
                <div class="ml-4">
                  <button
                    @click="toggleRequiresApproval"
                    :disabled="settingsSaving"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      community?.requiresApproval ? 'bg-blue-600' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        community?.requiresApproval ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </div>
              </div>

              <!-- Allow Member Posts Toggle -->
              <div class="flex items-start justify-between pt-4 border-t border-gray-200">
                <div class="flex-1">
                  <label class="font-semibold text-gray-900 block mb-1">Allow Member Posts</label>
                  <p class="text-sm text-gray-600">Let all members create posts in this community</p>
                </div>
                <div class="ml-4">
                  <button
                    @click="toggleAllowMemberPosts"
                    :disabled="settingsSaving"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      community?.allowMemberPosts ? 'bg-blue-600' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        community?.allowMemberPosts ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </div>
              </div>

              <!-- Allow Member Invites Toggle -->
              <div class="flex items-start justify-between pt-4 border-t border-gray-200">
                <div class="flex-1">
                  <label class="font-semibold text-gray-900 block mb-1">Allow Member Invites</label>
                  <p class="text-sm text-gray-600">Let members invite their friends to join</p>
                </div>
                <div class="ml-4">
                  <button
                    @click="toggleAllowMemberInvites"
                    :disabled="settingsSaving"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      community?.allowMemberInvites ? 'bg-blue-600' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        community?.allowMemberInvites ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Join Requests Section (Admin/Founder only, when requiresApproval is enabled) -->
          <div v-if="isAdmin && community?.requiresApproval" class="border border-yellow-200 bg-yellow-50 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pending Join Requests
              </h3>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-200 text-yellow-800">
                {{ joinRequests.length }} {{ joinRequests.length === 1 ? 'Request' : 'Requests' }}
              </span>
            </div>

            <div v-if="joinRequestsLoading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
              <p class="mt-2 text-sm text-gray-600">Loading requests...</p>
            </div>

            <div v-else-if="joinRequestsError" class="text-center py-8">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-sm text-red-600">{{ joinRequestsError }}</p>
            </div>

            <div v-else-if="joinRequests.length === 0" class="text-center py-8">
              <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-sm text-gray-600">No pending join requests</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="request in joinRequests"
                :key="request.id"
                class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex items-center gap-4">
                  <!-- User Avatar -->
                  <div v-if="typeof request.user === 'object' && request.user.avatar" class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img :src="request.user.avatar" :alt="typeof request.user === 'object' ? request.user.name : ''" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {{ typeof request.user === 'object' ? request.user.name.charAt(0).toUpperCase() : '?' }}
                  </div>

                  <!-- User Info -->
                  <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-900 truncate">
                      {{ typeof request.user === 'object' ? request.user.name : 'Unknown User' }}
                    </h4>
                    <p class="text-sm text-gray-600 truncate">
                      @{{ typeof request.user === 'object' ? request.user.username : 'unknown' }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      Requested {{ formatRequestDate(request.createdAt) }}
                    </p>
                    <p v-if="request.message" class="text-sm text-gray-700 mt-2 italic">
                      "{{ request.message }}"
                    </p>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <button
                      @click="handleApproveRequest(request)"
                      :disabled="processingRequestId === request.id"
                      class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Approve
                    </button>
                    <button
                      @click="handleRejectRequest(request)"
                      :disabled="processingRequestId === request.id"
                      class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Member Management Section (Admin/Founder only) -->
          <div v-if="isAdmin" class="border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Member Management
            </h3>

            <div class="space-y-3">
              <button
                @click="activeTab = 'members'"
                class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors flex items-center justify-between group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">Manage Members</p>
                    <p class="text-sm text-gray-600">View, promote, or remove members</p>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Banned Users Section (Admin/Founder only) -->
          <div v-if="isAdmin" class="border border-red-200 rounded-lg p-6 bg-red-50">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Banned Users {{ bannedUsers.length > 0 ? `(${bannedUsers.length})` : '' }}
            </h3>

            <div v-if="bannedUsersLoading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p class="text-sm text-gray-600 mt-2">Loading banned users...</p>
            </div>

            <div v-else-if="bannedUsers.length === 0" class="text-center py-8">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-gray-600 font-medium">No banned users</p>
              <p class="text-sm text-gray-500 mt-1">Users you ban will appear here</p>
            </div>

            <div v-else class="space-y-2 max-h-96 overflow-y-auto">
              <div
                v-for="user in bannedUsers"
                :key="user.id"
                class="flex items-center justify-between p-3 bg-white border border-red-200 rounded-lg hover:border-red-300 transition-colors"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    v-if="user.avatar"
                    :src="user.avatar"
                    :alt="user.name"
                    class="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center flex-shrink-0"
                  >
                    <span class="text-white font-bold text-sm">{{ user.name.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-900 truncate">{{ user.name }}</p>
                    <p class="text-sm text-gray-600 truncate">@{{ user.username }}</p>
                  </div>
                </div>
                <button
                  @click="handleUnbanUser(user.id)"
                  :disabled="unbanningUserId === user.id"
                  class="ml-3 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
                >
                  {{ unbanningUserId === user.id ? 'Unbanning...' : 'Unban' }}
                </button>
              </div>
            </div>

            <p v-if="bannedUsers.length > 0" class="text-xs text-gray-600 mt-3">
              Banned users cannot join or view this community. Their posts have been permanently deleted.
            </p>
          </div>

          <!-- Transfer Ownership Section (Founder only) -->
          <div v-if="isFounder" class="border border-amber-200 bg-amber-50 rounded-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Transfer Ownership
            </h3>

            <p class="text-sm text-gray-700 mb-4">
              Transfer community ownership to another admin. This action requires the new owner to accept the transfer.
            </p>

            <button
              @click="showTransferOwnershipModal = true; fetchMembers()"
              class="w-full px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Transfer Ownership
            </button>
          </div>

          <!-- Pending Ownership Transfer Section (Admin only - NOT Founder) -->
          <div v-if="isAdmin && !isFounder && pendingOwnershipTransfer" class="border border-purple-200 bg-purple-50 rounded-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Pending Ownership Transfer
            </h3>

            <div class="bg-white border border-purple-200 rounded-lg p-4 mb-4">
              <p class="text-sm text-gray-700 mb-3">
                <span class="font-semibold">{{ pendingOwnershipTransfer.fromUser?.name || 'Community Founder' }}</span> wants to transfer ownership of this community to you.
              </p>

              <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 mb-2">What this means:</h4>
                    <ul class="space-y-1.5">
                      <li class="text-sm text-gray-700 flex items-start gap-2">
                        <span class="text-blue-600 mt-0.5">•</span>
                        <span>You will become the founder and have full control over this community</span>
                      </li>
                      <li class="text-sm text-gray-700 flex items-start gap-2">
                        <span class="text-blue-600 mt-0.5">•</span>
                        <span>The current founder will become a regular admin</span>
                      </li>
                      <li class="text-sm text-gray-700 flex items-start gap-2">
                        <span class="text-blue-600 mt-0.5">•</span>
                        <span>Only you will be able to delete the community or transfer ownership again</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  @click="handleRejectOwnership"
                  class="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Decline
                </button>
                <button
                  @click="handleAcceptOwnership"
                  class="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
                >
                  Accept Ownership
                </button>
              </div>
            </div>
          </div>

          <!-- Danger Zone (Founder only) -->
          <div v-if="isFounder" class="border border-red-200 bg-red-50 rounded-lg p-6">
            <h3 class="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Danger Zone
            </h3>

            <p class="text-sm text-gray-700 mb-4">
              Once you delete a community, there is no going back. This action is permanent and will delete all posts, members, and data associated with this community.
            </p>

            <button
              @click="showDeleteConfirmModal = true"
              class="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Community
            </button>
          </div>

          <!-- Success Message -->
          <div v-if="settingsSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <p class="text-green-800 font-medium">Settings saved successfully!</p>
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

    <!-- Leave Confirmation Modal -->
    <ConfirmationModal
      :is-open="showLeaveConfirmation"
      variant="warning"
      title="Leave Community?"
      subtitle="This action cannot be undone"
      :message="`Are you sure you want to leave ${communityName}?`"
      :info-box="{
        icon: '<svg fill=\'currentColor\' viewBox=\'0 0 20 20\'><path fill-rule=\'evenodd\' d=\'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\' clip-rule=\'evenodd\' /></svg>',
        title: 'You will lose access to:',
        items: [
          'Community posts and discussions',
          'Member connections and network',
          'Community events and updates'
        ]
      }"
      confirm-text="Leave Community"
      cancel-text="Cancel"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1\' /></svg>'"
      @close="showLeaveConfirmation = false"
      @confirm="confirmLeaveGroup"
    />

    <div
      v-if="showLeaveSuccess"
      class="fixed inset-0 flex items-center justify-center z-50 px-4 pointer-events-none"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all border-2 border-green-200 pointer-events-auto">
        <div class="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 px-6 py-4">
          <div class="flex items-center gap-3">
            <div v-if="community?.coverImage" class="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img :src="community.coverImage" :alt="communityName" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
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

    <!-- Join Request Success Modal -->
    <ConfirmationModal
      :is-open="showJoinRequestSuccess"
      variant="info"
      title="Join Request Sent!"
      subtitle="Waiting for approval"
      :message="`Your request to join ${communityName} has been sent to the community administrators.`"
      :info-box="{
        icon: '<svg fill=\'currentColor\' viewBox=\'0 0 20 20\'><path fill-rule=\'evenodd\' d=\'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\' clip-rule=\'evenodd\' /></svg>',
        title: 'What happens next?',
        items: [
          'Community admins will review your request',
          'You\'ll be notified when your request is approved',
          'You can cancel the request anytime'
        ]
      }"
      confirm-text="Got it"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showJoinRequestSuccess = false"
      @confirm="showJoinRequestSuccess = false"
    />

    <!-- Approve Request Confirmation Modal -->
    <ConfirmationModal
      :is-open="showApproveConfirmation"
      variant="success"
      title="Approve Join Request?"
      :message="`Are you sure you want to approve the join request from ${selectedRequestToApprove?.user?.name || 'this user'}?`"
      :info-box="{
        icon: '<svg fill=\'currentColor\' viewBox=\'0 0 20 20\'><path fill-rule=\'evenodd\' d=\'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\' clip-rule=\'evenodd\' /></svg>',
        title: 'This will:',
        items: [
          'Grant them full member access',
          'Allow them to view and create posts',
          'Add them to the member list'
        ]
      }"
      confirm-text="Approve Request"
      cancel-text="Cancel"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showApproveConfirmation = false; selectedRequestToApprove = null"
      @confirm="confirmApproveRequest"
    />

    <!-- Approve Success Modal -->
    <ConfirmationModal
      :is-open="showApproveSuccess"
      variant="success"
      title="Request Approved!"
      subtitle="Member added successfully"
      :message="`${selectedRequestToApprove?.user?.name || 'The user'} is now a member of ${communityName}.`"
      confirm-text="Got it"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showApproveSuccess = false"
      @confirm="showApproveSuccess = false"
    />

    <!-- Reject Request Confirmation Modal -->
    <ConfirmationModal
      :is-open="showRejectConfirmation"
      variant="danger"
      title="Reject Join Request?"
      :message="`Are you sure you want to reject the join request from ${selectedRequestToReject?.user?.name || 'this user'}?`"
      :info-box="{
        icon: '<svg fill=\'currentColor\' viewBox=\'0 0 20 20\'><path fill-rule=\'evenodd\' d=\'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\' clip-rule=\'evenodd\' /></svg>',
        title: 'This will:',
        items: [
          'Decline their request to join',
          'Remove the request from your list',
          'They can request again later'
        ]
      }"
      confirm-text="Reject Request"
      cancel-text="Cancel"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M6 18L18 6M6 6l12 12\' /></svg>'"
      @close="showRejectConfirmation = false; selectedRequestToReject = null"
      @confirm="confirmRejectRequest"
    />

    <!-- Ban User Confirmation Modal -->
    <ConfirmationModal
      :is-open="showBanConfirmation"
      variant="danger"
      title="Ban User?"
      subtitle="This is a serious action"
      :message="`Are you sure you want to ban ${selectedMemberToBan?.name} from ${communityName}?`"
      :info-box="{
        icon: '<svg fill=\'currentColor\' viewBox=\'0 0 20 20\'><path fill-rule=\'evenodd\' d=\'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\' clip-rule=\'evenodd\' /></svg>',
        title: 'This will:',
        items: [
          'Remove them from the community',
          'Delete all their posts in this community',
          'Prevent them from rejoining'
        ]
      }"
      confirm-text="Ban User"
      cancel-text="Cancel"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636\' /></svg>'"
      @close="showBanConfirmation = false; selectedMemberToBan = null"
      @confirm="confirmBanMember"
    />

    <!-- Ban Success Modal -->
    <ConfirmationModal
      :is-open="showBanSuccess"
      variant="success"
      title="User Banned"
      subtitle="Action completed"
      :message="`${selectedMemberToBan?.name} has been banned from ${communityName}.`"
      confirm-text="Got it"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showBanSuccess = false"
      @confirm="showBanSuccess = false"
    />

    <!-- Unban User Confirmation Modal -->
    <ConfirmationModal
      :is-open="showUnbanConfirmation"
      variant="success"
      title="Unban User?"
      :message="`Are you sure you want to unban ${selectedUserToUnban?.name}?`"
      :info-box="{
        icon: '<svg fill=\'currentColor\' viewBox=\'0 0 20 20\'><path fill-rule=\'evenodd\' d=\'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\' clip-rule=\'evenodd\' /></svg>',
        title: 'This will:',
        items: [
          'Remove them from the banned list',
          'Allow them to join the community again',
          'They will need to request to join if approval is required'
        ]
      }"
      confirm-text="Unban User"
      cancel-text="Cancel"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showUnbanConfirmation = false; selectedUserToUnban = null"
      @confirm="confirmUnbanUser"
    />

    <!-- Accept Ownership Confirmation Modal -->
    <ConfirmationModal
      :is-open="showAcceptOwnershipConfirmation"
      variant="success"
      title="Accept Ownership Transfer?"
      message="You will become the founder of this community with full control."
      :info-box="{
        icon: '<svg fill=\'currentColor\' viewBox=\'0 0 20 20\'><path fill-rule=\'evenodd\' d=\'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\' clip-rule=\'evenodd\' /></svg>',
        title: 'As founder, you will be able to:',
        items: [
          'Transfer ownership to someone else',
          'Delete the entire community',
          'Manage all community settings',
          'Promote or demote admins and members'
        ]
      }"
      confirm-text="Accept Ownership"
      cancel-text="Cancel"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showAcceptOwnershipConfirmation = false"
      @confirm="confirmAcceptOwnership"
    />

    <!-- Accept Ownership Success Modal -->
    <ConfirmationModal
      :is-open="showAcceptOwnershipSuccess"
      variant="success"
      title="Ownership Accepted!"
      message="You are now the founder of this community. Congratulations!"
      confirm-text="Got it"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showAcceptOwnershipSuccess = false"
      @confirm="showAcceptOwnershipSuccess = false"
    />

    <!-- Reject Ownership Confirmation Modal -->
    <ConfirmationModal
      :is-open="showRejectOwnershipConfirmation"
      variant="danger"
      title="Decline Ownership Transfer?"
      message="Are you sure you want to decline this ownership transfer?"
      :info-box="{
        icon: '<svg fill=\'currentColor\' viewBox=\'0 0 20 20\'><path fill-rule=\'evenodd\' d=\'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\' clip-rule=\'evenodd\' /></svg>',
        title: 'This will:',
        items: [
          'Notify the current founder',
          'You will remain an admin',
          'The founder can send another transfer request later'
        ]
      }"
      confirm-text="Decline Transfer"
      cancel-text="Cancel"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M6 18L18 6M6 6l12 12\' /></svg>'"
      @close="showRejectOwnershipConfirmation = false"
      @confirm="confirmRejectOwnership"
    />

    <!-- Reject Ownership Success Modal -->
    <ConfirmationModal
      :is-open="showRejectOwnershipSuccess"
      variant="info"
      title="Transfer Declined"
      message="You have declined the ownership transfer request."
      confirm-text="Got it"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showRejectOwnershipSuccess = false"
      @confirm="showRejectOwnershipSuccess = false"
    />

    <!-- Transfer Ownership Success Modal -->
    <ConfirmationModal
      :is-open="showTransferOwnershipSuccess"
      variant="success"
      title="Transfer Request Sent!"
      message="Ownership transfer request sent successfully! The new owner must accept the transfer."
      confirm-text="Got it"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showTransferOwnershipSuccess = false"
      @confirm="showTransferOwnershipSuccess = false"
    />

    <!-- Transfer Ownership Error Modal -->
    <ConfirmationModal
      :is-open="showTransferOwnershipError"
      variant="danger"
      title="Transfer Failed"
      :message="ownershipErrorMessage"
      confirm-text="OK"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showTransferOwnershipError = false"
      @confirm="showTransferOwnershipError = false"
    />

    <!-- Accept Ownership Error Modal -->
    <ConfirmationModal
      :is-open="showAcceptOwnershipError"
      variant="danger"
      title="Accept Failed"
      :message="ownershipErrorMessage"
      confirm-text="OK"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showAcceptOwnershipError = false"
      @confirm="showAcceptOwnershipError = false"
    />

    <!-- Reject Ownership Error Modal -->
    <ConfirmationModal
      :is-open="showRejectOwnershipError"
      variant="danger"
      title="Reject Failed"
      :message="ownershipErrorMessage"
      confirm-text="OK"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showRejectOwnershipError = false"
      @confirm="showRejectOwnershipError = false"
    />

    <!-- Promote Member Confirmation Modal -->
    <ConfirmationModal
      :is-open="showPromoteConfirmation"
      variant="success"
      title="Promote to Admin?"
      :message="`Are you sure you want to promote ${selectedMemberForAction?.name} to Admin?`"
      :info-box="{
        icon: '<svg fill=\'currentColor\' viewBox=\'0 0 20 20\'><path fill-rule=\'evenodd\' d=\'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\' clip-rule=\'evenodd\' /></svg>',
        title: 'As an admin, they will be able to:',
        items: [
          'Manage community settings',
          'Approve join requests',
          'Ban and remove members',
          'Promote other members to admin'
        ]
      }"
      confirm-text="Promote to Admin"
      cancel-text="Cancel"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showPromoteConfirmation = false; selectedMemberForAction = null"
      @confirm="confirmPromoteMember"
    />

    <!-- Promote Member Success Modal -->
    <ConfirmationModal
      :is-open="showPromoteSuccess"
      variant="success"
      title="Member Promoted!"
      :message="`${selectedMemberForAction?.name} has been promoted to Admin.`"
      confirm-text="Got it"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showPromoteSuccess = false"
      @confirm="showPromoteSuccess = false"
    />

    <!-- Promote Member Error Modal -->
    <ConfirmationModal
      :is-open="showPromoteError"
      variant="danger"
      title="Promotion Failed"
      :message="memberActionErrorMessage"
      confirm-text="OK"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showPromoteError = false"
      @confirm="showPromoteError = false"
    />

    <!-- Demote Member Confirmation Modal -->
    <ConfirmationModal
      :is-open="showDemoteConfirmation"
      variant="warning"
      title="Demote to Member?"
      :message="`Are you sure you want to demote ${selectedMemberForAction?.name} to Member?`"
      :info-box="{
        icon: '<svg fill=\'currentColor\' viewBox=\'0 0 20 20\'><path fill-rule=\'evenodd\' d=\'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\' clip-rule=\'evenodd\' /></svg>',
        title: 'This will:',
        items: [
          'Remove their admin privileges',
          'They will become a regular member',
          'They can still create posts if allowed'
        ]
      }"
      confirm-text="Demote to Member"
      cancel-text="Cancel"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z\' /></svg>'"
      @close="showDemoteConfirmation = false; selectedMemberForAction = null"
      @confirm="confirmDemoteMember"
    />

    <!-- Demote Member Success Modal -->
    <ConfirmationModal
      :is-open="showDemoteSuccess"
      variant="info"
      title="Member Demoted"
      :message="`${selectedMemberForAction?.name} has been demoted to Member.`"
      confirm-text="Got it"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showDemoteSuccess = false"
      @confirm="showDemoteSuccess = false"
    />

    <!-- Demote Member Error Modal -->
    <ConfirmationModal
      :is-open="showDemoteError"
      variant="danger"
      title="Demotion Failed"
      :message="memberActionErrorMessage"
      confirm-text="OK"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showDemoteError = false"
      @confirm="showDemoteError = false"
    />

    <!-- Remove Member Confirmation Modal -->
    <ConfirmationModal
      :is-open="showRemoveConfirmation"
      variant="danger"
      title="Remove Member?"
      :message="`Are you sure you want to remove ${selectedMemberForAction?.name} from the community?`"
      :info-box="{
        icon: '<svg fill=\'currentColor\' viewBox=\'0 0 20 20\'><path fill-rule=\'evenodd\' d=\'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\' clip-rule=\'evenodd\' /></svg>',
        title: 'This will:',
        items: [
          'Remove them from the community',
          'They will be able to rejoin if the community is public',
          'Their posts will remain in the community'
        ]
      }"
      confirm-text="Remove Member"
      cancel-text="Cancel"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M6 18L18 6M6 6l12 12\' /></svg>'"
      @close="showRemoveConfirmation = false; selectedMemberForAction = null"
      @confirm="confirmRemoveMember"
    />

    <!-- Remove Member Success Modal -->
    <ConfirmationModal
      :is-open="showRemoveSuccess"
      variant="info"
      title="Member Removed"
      :message="`${selectedMemberForAction?.name} has been removed from the community.`"
      confirm-text="Got it"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showRemoveSuccess = false"
      @confirm="showRemoveSuccess = false"
    />

    <!-- Remove Member Error Modal -->
    <ConfirmationModal
      :is-open="showRemoveError"
      variant="danger"
      title="Removal Failed"
      :message="memberActionErrorMessage"
      confirm-text="OK"
      :show-cancel="false"
      :icon="'<svg fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\' /></svg>'"
      @close="showRemoveError = false"
      @confirm="showRemoveError = false"
    />

    <!-- Invite People Modal -->
    <InvitePeopleModal
      :is-open="showInviteModal"
      @close="showInviteModal = false"
      @send-invites="handleSendInvites"
    />

    <PostModal
      :show="showPostModal"
      :post="selectedPost"
      @close="closePostModal"
    />

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

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      @click.self="showDeleteConfirmModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
        <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Delete Community</h3>
              <p class="text-red-100 text-sm">This action cannot be undone</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <p class="text-gray-700 leading-relaxed mb-4">
            Are you sure you want to delete <span class="font-semibold text-gray-900">{{ communityName }}</span>? This will permanently delete:
          </p>

          <ul class="space-y-2 mb-6">
            <li class="flex items-start gap-2 text-sm text-gray-700">
              <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              All community posts and content
            </li>
            <li class="flex items-start gap-2 text-sm text-gray-700">
              <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              All member data and relationships
            </li>
            <li class="flex items-start gap-2 text-sm text-gray-700">
              <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Community settings and configurations
            </li>
          </ul>

          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-sm text-red-900 font-medium">
              Type "<span class="font-bold">{{ community?.name }}</span>" to confirm deletion:
            </p>
            <input
              v-model="deleteConfirmText"
              type="text"
              class="mt-2 w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Type community name..."
            />
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
          <button
            @click="showDeleteConfirmModal = false"
            class="px-4 py-2 text-gray-700 font-semibold hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleDeleteCommunity"
            :disabled="deleteConfirmText !== community?.name || deletingCommunity"
            :class="[
              'px-4 py-2 font-semibold rounded-lg transition-colors',
              deleteConfirmText === community?.name && !deletingCommunity
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            {{ deletingCommunity ? 'Deleting...' : 'Delete Community' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Transfer Ownership Modal -->
    <div
      v-if="showTransferOwnershipModal"
      class="fixed inset-0 flex items-center justify-center z-50 px-4"
      @click.self="showTransferOwnershipModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
        <div class="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Transfer Ownership</h3>
              <p class="text-amber-100 text-sm">Select the new community owner</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <p class="text-gray-700 leading-relaxed mb-4">
            Transfer ownership of <span class="font-semibold text-gray-900">{{ communityName }}</span> to an admin member. The new owner will have full control of the community.
          </p>

          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              Select New Owner (Admin Members Only)
            </label>

            <div v-if="membersLoading" class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
              Loading admins...
            </div>

            <select
              v-else-if="transferableAdmins.length > 0"
              v-model="selectedNewOwnerId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Choose an admin...</option>
              <option
                v-for="member in transferableAdmins"
                :key="member.id"
                :value="member.id"
              >
                {{ member.name }} (@{{ member.username }})
              </option>
            </select>

            <div v-else class="w-full px-3 py-2 border border-red-300 rounded-lg bg-red-50 text-red-700 text-sm">
              No admin members available. You must first promote a member to admin before transferring ownership.
            </div>
          </div>

          <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div class="flex gap-3">
              <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div class="text-sm text-amber-900">
                <p class="font-medium">The new owner must accept this transfer request. You will remain as founder until they accept.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
          <button
            @click="showTransferOwnershipModal = false"
            class="px-4 py-2 text-gray-700 font-semibold hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleTransferOwnership"
            :disabled="!selectedNewOwnerId || transferringOwnership"
            :class="[
              'px-4 py-2 font-semibold rounded-lg transition-colors',
              selectedNewOwnerId && !transferringOwnership
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            {{ transferringOwnership ? 'Sending Request...' : 'Send Transfer Request' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '../store/session';
import CategoryFilter from '../components/CategoryFilter.vue';
import CreatePostForm from '../components/CreatePostForm.vue';
import PostCard from '../components/PostCard.vue';
import PostModal from '../components/PostModal.vue';
import TabContentHeader from '../components/TabContentHeader.vue';
import CommunityStatsCard from '../components/CommunityStatsCard.vue';
import ConfirmationModal from '../components/ConfirmationModal.vue';
import InvitePeopleModal from '../components/InvitePeopleModal.vue';
import EmptyState from '../components/EmptyState.vue';
import { getScoredFeed, getCommunityScoredFeed } from '../api/post';
import type { SafePost } from '../types/post';
import { useCommunity } from '../composables/useCommunity';
import { useCommunityMembers } from '../composables/useCommunityMembers';
import { sendInvitations, cancelJoinRequest, deleteCommunity, requestOwnershipTransfer, removeMember, banUser, unbanUser, updateMemberRole, getJoinRequests, approveJoinRequest, rejectJoinRequest, getBannedUsers, getPendingOwnershipTransfer, acceptOwnershipTransfer, rejectOwnershipTransfer } from '../api/community';
import type { InviteUsersPayload, SafeJoinRequest, CommunityMember } from '../types/community';

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();

const communitySlug = computed(() => route.params.slug as string);

// Use community composable
const {
  community,
  loading: communityLoading,
  error: communityError,
  isJoined,
  isMember,
  isAdmin,
  isFounder,
  hasPendingRequest,
  canPost,
  canInvite,
  canManage,
  fetchCommunity,
  toggleJoin,
  updateCommunityData,
} = useCommunity(communitySlug);

const {
  members,
  filteredMembers,
  total: totalMembers,
  loading: membersLoading,
  error: membersError,
  searchQuery: membersSearchQuery,
  fetchMembers,
  setSearch: setMembersSearch,
} = useCommunityMembers(communitySlug);

const adminMembers = computed(() => {
  return filteredMembers.value.filter(
    (member) => member.role === 'admin' || member.role === 'founder'
  );
});

const transferableAdmins = computed(() => {
  return filteredMembers.value.filter(
    (member) => member.role === 'admin' && member.id !== sessionStore.user?.id
  );
});

const regularMembers = computed(() => {
  return filteredMembers.value.filter(
    (member) => member.role !== 'admin' && member.role !== 'founder'
  );
});

const posts = ref<SafePost[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref<string | null>(null);
const selectedCategory = ref<string | null>(null);
const hasMore = ref(false);
const nextCursor = ref<string | null>(null);
const activeTab = ref<'feed' | 'about' | 'members' | 'media' | 'settings'>('feed');
const searchQuery = ref('');
const showJoinedDropdown = ref(false);
const showLeaveConfirmation = ref(false);
const showLeaveSuccess = ref(false);
const showJoinRequestSuccess = ref(false);
const showApproveConfirmation = ref(false);
const showApproveSuccess = ref(false);
const selectedRequestToApprove = ref<any>(null);
const showRejectConfirmation = ref(false);
const selectedRequestToReject = ref<any>(null);
const showBanConfirmation = ref(false);
const showBanSuccess = ref(false);
const selectedMemberToBan = ref<any>(null);
const showUnbanConfirmation = ref(false);
const selectedUserToUnban = ref<any>(null);
const pendingOwnershipTransfer = ref<any>(null);
const showAcceptOwnershipConfirmation = ref(false);
const showAcceptOwnershipSuccess = ref(false);
const showRejectOwnershipConfirmation = ref(false);
const showRejectOwnershipSuccess = ref(false);
const showTransferOwnershipSuccess = ref(false);
const showTransferOwnershipError = ref(false);
const showAcceptOwnershipError = ref(false);
const showRejectOwnershipError = ref(false);
const ownershipErrorMessage = ref('');
const showPromoteConfirmation = ref(false);
const showPromoteSuccess = ref(false);
const showPromoteError = ref(false);
const showDemoteConfirmation = ref(false);
const showDemoteSuccess = ref(false);
const showDemoteError = ref(false);
const showRemoveConfirmation = ref(false);
const showRemoveSuccess = ref(false);
const showRemoveError = ref(false);
const selectedMemberForAction = ref<any>(null);
const memberActionErrorMessage = ref('');
const showInviteModal = ref(false);
const showInviteSuccess = ref(false);
const invitedCount = ref(0);
const settingsSaving = ref(false);
const settingsSuccess = ref(false);
const hoveredRequestButton = ref(false);
const showPostModal = ref(false);
const selectedPost = ref<SafePost | null>(null);
const hoveredJoinButton = ref(false);
const showDeleteConfirmModal = ref(false);
const deleteConfirmText = ref('');
const deletingCommunity = ref(false);
const showTransferOwnershipModal = ref(false);
const selectedNewOwnerId = ref('');
const transferringOwnership = ref(false);
const openMemberDropdown = ref<string | null>(null);
const joinRequests = ref<SafeJoinRequest[]>([]);
const joinRequestsLoading = ref(false);
const joinRequestsError = ref<string | null>(null);
const processingRequestId = ref<string | null>(null);

const bannedUsers = ref<CommunityMember[]>([]);
const bannedUsersLoading = ref(false);
const unbanningUserId = ref<string | null>(null);

const pinnedPosts = ref<SafePost[]>([]);

// Computed properties based on backend data
const communityId = computed(() => community.value?.id || '');

const communityName = computed(() => community.value?.name || 'Community');

const communityCategory = computed(() => {
  if (!community.value?.category) return 'General';
  return typeof community.value.category === 'string'
    ? community.value.category
    : community.value.category.name;
});

const communityDescription = computed(() => community.value?.description || '');

const memberCount = computed(() => community.value?.memberCount || 0);

const communityCreatedDate = computed(() => {
  if (!community.value?.createdAt) return 'Recently';
  const date = new Date(community.value.createdAt);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
});

const aboutStats = computed(() => [
  {
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`,
    label: 'Members',
    value: memberCount.value,
  },
  {
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`,
    label: 'Total Posts',
    value: community.value?.postCount || 0,
  },
  {
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    label: 'Created',
    value: communityCreatedDate.value,
  },
]);

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

const recentImages = computed(() => {
  const images: Array<{ url: string; alt?: string; post: SafePost; imageIndex: number }> = [];

  // Extract images from posts
  for (const post of filteredPosts.value) {
    if (post.images && Array.isArray(post.images)) {
      for (let i = 0; i < post.images.length; i++) {
        const img = post.images[i];
        if (typeof img === 'object' && img !== null && 'url' in img) {
          images.push({
            url: img.url,
            alt: img.alt || 'Post image',
            post: post,
            imageIndex: i,
          });
        }
        if (images.length >= 12) break; // Show max 12 images (4x3 grid)
      }
    }
    if (images.length >= 12) break;
  }

  return images;
});

// Mock data for friends, following, and followers (TODO: Replace with actual API call)
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

    const result = await getCommunityScoredFeed(
      communityId.value,
      cursor || undefined,
      10
    );

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

const openPostModal = (post: SafePost) => {
  selectedPost.value = post;
  showPostModal.value = true;
};

const closePostModal = () => {
  showPostModal.value = false;
  selectedPost.value = null;
};

const toggleJoinedDropdown = () => {
  showJoinedDropdown.value = !showJoinedDropdown.value;
};

const getJoinButtonText = () => {
  if (isFounder.value) return 'Joined';
  return hoveredJoinButton.value ? 'Leave' : 'Joined';
};

const getJoinButtonClass = () => {
  if (isFounder.value) {
    return 'bg-blue-100 text-blue-700 cursor-not-allowed';
  }
  return hoveredJoinButton.value
    ? 'bg-red-600 text-white hover:bg-red-700'
    : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
};

const handleJoinCommunity = async () => {
  try {
    const wasRequiringApproval = community.value?.requiresApproval;
    await toggleJoin();

    // If community required approval and now has pending request, show success modal
    if (wasRequiringApproval && community.value?.hasPendingRequest) {
      showJoinRequestSuccess.value = true;
      setTimeout(() => {
        showJoinRequestSuccess.value = false;
      }, 3000);
    }
  } catch (err: any) {
    alert(err.message || 'Failed to join community');
  }
};

const handleCancelRequest = async () => {
  if (!community.value) return;

  try {
    await cancelJoinRequest(community.value.id);
    // Update local state
    if (community.value) {
      community.value.hasPendingRequest = false;
    }
    hoveredRequestButton.value = false;
  } catch (err: any) {
    alert(err.message || 'Failed to cancel join request');
  }
};

const handleLeaveGroup = () => {
  console.log('[ViewCommunity] handleLeaveGroup called');
  showLeaveConfirmation.value = true;
};

const confirmLeaveGroup = async () => {
  console.log('[ViewCommunity] confirmLeaveGroup called');
  showLeaveConfirmation.value = false;

  try {
    console.log('[ViewCommunity] Calling toggleJoin to leave...');
    await toggleJoin();
    console.log('[ViewCommunity] Successfully left community');
    showLeaveSuccess.value = true;

    setTimeout(() => {
      showLeaveSuccess.value = false;
      router.push('/community/join');
    }, 2000);
  } catch (err: any) {
    console.error('[ViewCommunity] Error leaving community:', err);
    alert(err.message || 'Failed to leave community');
  }
};

const handleInvitePeople = () => {
  if (!canInvite.value) {
    alert('You do not have permission to invite members to this community');
    return;
  }
  showInviteModal.value = true;
};

const handleSendInvites = async (data: { userIds: string[]; emails: string[]; users: Array<{ id: string; name: string; username: string }> }) => {
  invitedCount.value = data.userIds.length + data.emails.length;

  try {
    const payload: InviteUsersPayload = { userIds: data.userIds };
    await sendInvitations(communityId.value, payload);

    showInviteModal.value = false;
    showInviteSuccess.value = true;

    setTimeout(() => {
      showInviteSuccess.value = false;
    }, 3000);
  } catch (err: any) {
    alert(err.message || 'Failed to send invitations');
  }
};

const toggleRequiresApproval = async () => {
  if (!community.value) return;

  console.log('[Settings] Toggling requiresApproval from', community.value.requiresApproval, 'to', !community.value.requiresApproval);

  try {
    settingsSaving.value = true;
    settingsSuccess.value = false;

    const formData = new FormData();
    const newValue = !community.value.requiresApproval;
    formData.append('requiresApproval', newValue.toString());

    console.log('[Settings] Calling updateCommunityData with requiresApproval =', newValue);
    const result = await updateCommunityData(formData);
    console.log('[Settings] Update successful, new community:', result.community);

    settingsSuccess.value = true;
    setTimeout(() => {
      settingsSuccess.value = false;
    }, 3000);
  } catch (err: any) {
    console.error('[Settings] Failed to update:', err);
    alert(err.message || 'Failed to update settings');
  } finally {
    settingsSaving.value = false;
  }
};

const toggleAllowMemberPosts = async () => {
  if (!community.value) return;

  try {
    settingsSaving.value = true;
    settingsSuccess.value = false;

    const formData = new FormData();
    formData.append('allowMemberPosts', (!community.value.allowMemberPosts).toString());

    await updateCommunityData(formData);

    settingsSuccess.value = true;
    setTimeout(() => {
      settingsSuccess.value = false;
    }, 3000);
  } catch (err: any) {
    alert(err.message || 'Failed to update settings');
  } finally {
    settingsSaving.value = false;
  }
};

const toggleAllowMemberInvites = async () => {
  if (!community.value) return;

  try {
    settingsSaving.value = true;
    settingsSuccess.value = false;

    const formData = new FormData();
    formData.append('allowMemberInvites', (!community.value.allowMemberInvites).toString());

    await updateCommunityData(formData);

    settingsSuccess.value = true;
    setTimeout(() => {
      settingsSuccess.value = false;
    }, 3000);
  } catch (err: any) {
    alert(err.message || 'Failed to update settings');
  } finally {
    settingsSaving.value = false;
  }
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

const handleDeleteCommunity = async () => {
  if (deleteConfirmText.value !== community.value?.name) {
    return;
  }

  try {
    deletingCommunity.value = true;
    await deleteCommunity(community.value!.id);

    // Redirect to communities page after successful deletion
    router.push('/communities');
  } catch (err: any) {
    alert(err.message || 'Failed to delete community');
    deletingCommunity.value = false;
  }
};

const handleTransferOwnership = async () => {
  if (!selectedNewOwnerId.value) {
    return;
  }

  try {
    transferringOwnership.value = true;
    await requestOwnershipTransfer(community.value!.id, {
      newOwnerId: selectedNewOwnerId.value,
    });

    showTransferOwnershipModal.value = false;
    selectedNewOwnerId.value = '';

    // Show success modal
    showTransferOwnershipSuccess.value = true;
    setTimeout(() => {
      showTransferOwnershipSuccess.value = false;
    }, 3000);
  } catch (err: any) {
    ownershipErrorMessage.value = err.message || 'Failed to send ownership transfer request';
    showTransferOwnershipError.value = true;
  } finally {
    transferringOwnership.value = false;
  }
};

const toggleMemberDropdown = (memberId: string) => {
  openMemberDropdown.value = openMemberDropdown.value === memberId ? null : memberId;
};

const handlePromoteMember = async (member: any) => {
  selectedMemberForAction.value = member;
  showPromoteConfirmation.value = true;
};

const confirmPromoteMember = async () => {
  if (!selectedMemberForAction.value) return;

  const member = selectedMemberForAction.value;
  showPromoteConfirmation.value = false;

  try {
    await updateMemberRole(community.value!.id, member.id, { role: 'admin' });
    openMemberDropdown.value = null;

    // Refresh members list
    fetchMembers();

    // Show success modal
    showPromoteSuccess.value = true;
    setTimeout(() => {
      showPromoteSuccess.value = false;
      selectedMemberForAction.value = null;
    }, 3000);
  } catch (err: any) {
    memberActionErrorMessage.value = err.message || 'Failed to promote member';
    showPromoteError.value = true;
  }
};

const handleDemoteMember = async (member: any) => {
  selectedMemberForAction.value = member;
  showDemoteConfirmation.value = true;
};

const confirmDemoteMember = async () => {
  if (!selectedMemberForAction.value) return;

  const member = selectedMemberForAction.value;
  showDemoteConfirmation.value = false;

  try {
    await updateMemberRole(community.value!.id, member.id, { role: 'member' });
    openMemberDropdown.value = null;

    // Refresh members list
    fetchMembers();

    // Show success modal
    showDemoteSuccess.value = true;
    setTimeout(() => {
      showDemoteSuccess.value = false;
      selectedMemberForAction.value = null;
    }, 3000);
  } catch (err: any) {
    memberActionErrorMessage.value = err.message || 'Failed to demote member';
    showDemoteError.value = true;
  }
};

const handleRemoveMember = async (member: any) => {
  selectedMemberForAction.value = member;
  showRemoveConfirmation.value = true;
};

const confirmRemoveMember = async () => {
  if (!selectedMemberForAction.value) return;

  const member = selectedMemberForAction.value;
  showRemoveConfirmation.value = false;

  try {
    await removeMember(community.value!.id, member.id);
    openMemberDropdown.value = null;

    // Refresh members list and community data
    fetchMembers();
    fetchCommunity();

    // Show success modal
    showRemoveSuccess.value = true;
    setTimeout(() => {
      showRemoveSuccess.value = false;
      selectedMemberForAction.value = null;
    }, 3000);
  } catch (err: any) {
    memberActionErrorMessage.value = err.message || 'Failed to remove member';
    showRemoveError.value = true;
  }
};

const handleBanMember = async (member: any) => {
  selectedMemberToBan.value = member;
  showBanConfirmation.value = true;
};

const confirmBanMember = async () => {
  if (!selectedMemberToBan.value) return;

  const member = selectedMemberToBan.value;
  showBanConfirmation.value = false;

  try {
    await banUser(community.value!.id, member.id);
    openMemberDropdown.value = null;

    // Refresh members list, community data, and banned users list
    fetchMembers();
    fetchCommunity();
    fetchBannedUsers();

    // Show success modal
    showBanSuccess.value = true;
    setTimeout(() => {
      showBanSuccess.value = false;
      selectedMemberToBan.value = null;
    }, 3000);
  } catch (err: any) {
    alert(err.message || 'Failed to ban user');
  }
};

const fetchJoinRequests = async () => {
  if (!community.value?.requiresApproval || !isAdmin.value) {
    return;
  }

  try {
    joinRequestsLoading.value = true;
    joinRequestsError.value = null;

    const response = await getJoinRequests(community.value.id);
    joinRequests.value = response.requests;

    console.log('Fetched join requests:', response.requests);
  } catch (err: any) {
    joinRequestsError.value = err.message || 'Failed to load join requests';
    console.error('Failed to fetch join requests:', err);
  } finally {
    joinRequestsLoading.value = false;
  }
};

const handleApproveRequest = async (request: SafeJoinRequest) => {
  selectedRequestToApprove.value = request;
  showApproveConfirmation.value = true;
};

const confirmApproveRequest = async () => {
  if (!selectedRequestToApprove.value) return;

  const request = selectedRequestToApprove.value;
  showApproveConfirmation.value = false;

  console.log('Approving request:', {
    requestId: request.id,
    communityId: community.value!.id,
    request: request
  });

  try {
    processingRequestId.value = request.id;
    await approveJoinRequest(community.value!.id, request.id);

    // Remove from list
    joinRequests.value = joinRequests.value.filter(r => r.id !== request.id);

    // Refresh community data to update member count
    fetchCommunity();
    fetchMembers();

    // Show success modal
    showApproveSuccess.value = true;
    setTimeout(() => {
      showApproveSuccess.value = false;
      selectedRequestToApprove.value = null;
    }, 3000);
  } catch (err: any) {
    console.error('Approve request error:', err);
    alert(err.message || 'Failed to approve join request');
  } finally {
    processingRequestId.value = null;
  }
};

const handleRejectRequest = async (request: SafeJoinRequest) => {
  selectedRequestToReject.value = request;
  showRejectConfirmation.value = true;
};

const confirmRejectRequest = async () => {
  if (!selectedRequestToReject.value) return;

  const request = selectedRequestToReject.value;
  showRejectConfirmation.value = false;

  try {
    processingRequestId.value = request.id;
    await rejectJoinRequest(community.value!.id, request.id);

    // Remove from list
    joinRequests.value = joinRequests.value.filter(r => r.id !== request.id);
    selectedRequestToReject.value = null;
  } catch (err: any) {
    alert(err.message || 'Failed to reject join request');
  } finally {
    processingRequestId.value = null;
  }
};

const formatRequestDate = (date: Date) => {
  const now = new Date();
  const requestDate = new Date(date);
  const diffInMs = now.getTime() - requestDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffInDays < 7) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;

  return requestDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const fetchBannedUsers = async () => {
  if (!community.value || !isAdmin.value) {
    console.log('Not fetching banned users:', { hasCommunity: !!community.value, isAdmin: isAdmin.value });
    return;
  }

  console.log('Fetching banned users for community:', community.value.id);

  try {
    bannedUsersLoading.value = true;
    const response = await getBannedUsers(community.value.id);
    bannedUsers.value = response.bannedUsers;
    console.log('Fetched banned users:', response.bannedUsers);
  } catch (err: any) {
    console.error('Failed to fetch banned users:', err);
  } finally {
    bannedUsersLoading.value = false;
  }
};

const handleUnbanUser = async (userId: string) => {
  const user = bannedUsers.value.find(u => u.id === userId);
  if (!user) return;

  selectedUserToUnban.value = user;
  showUnbanConfirmation.value = true;
};

const confirmUnbanUser = async () => {
  if (!selectedUserToUnban.value) return;

  const userId = selectedUserToUnban.value.id;
  showUnbanConfirmation.value = false;

  try {
    unbanningUserId.value = userId;
    await unbanUser(community.value!.id, userId);

    // Remove from banned list
    bannedUsers.value = bannedUsers.value.filter(u => u.id !== userId);
    selectedUserToUnban.value = null;
  } catch (err: any) {
    alert(err.message || 'Failed to unban user');
  } finally {
    unbanningUserId.value = null;
  }
};

const fetchPendingOwnershipTransfer = async () => {
  if (!community.value || !isAdmin.value) {
    return;
  }

  try {
    const response = await getPendingOwnershipTransfer(community.value.id);
    pendingOwnershipTransfer.value = response.transfer || null;
    console.log('Pending ownership transfer:', pendingOwnershipTransfer.value);
  } catch (err: any) {
    console.error('Failed to fetch pending ownership transfer:', err);
    pendingOwnershipTransfer.value = null;
  }
};

const handleAcceptOwnership = () => {
  showAcceptOwnershipConfirmation.value = true;
};

const confirmAcceptOwnership = async () => {
  if (!pendingOwnershipTransfer.value) return;

  showAcceptOwnershipConfirmation.value = false;

  try {
    const result = await acceptOwnershipTransfer(pendingOwnershipTransfer.value.id);

    // Update the community data with the new ownership
    if (result.community) {
      community.value = result.community;
    }

    // Clear pending transfer
    pendingOwnershipTransfer.value = null;

    // Show success modal
    showAcceptOwnershipSuccess.value = true;
    setTimeout(() => {
      showAcceptOwnershipSuccess.value = false;
    }, 3000);
  } catch (err: any) {
    console.error('Failed to accept ownership transfer:', err);
    ownershipErrorMessage.value = err.message || 'Failed to accept ownership transfer';
    showAcceptOwnershipError.value = true;
  }
};

const handleRejectOwnership = () => {
  showRejectOwnershipConfirmation.value = true;
};

const confirmRejectOwnership = async () => {
  if (!pendingOwnershipTransfer.value) return;

  showRejectOwnershipConfirmation.value = false;

  try {
    await rejectOwnershipTransfer(pendingOwnershipTransfer.value.id);

    // Clear pending transfer
    pendingOwnershipTransfer.value = null;

    // Show success modal
    showRejectOwnershipSuccess.value = true;
    setTimeout(() => {
      showRejectOwnershipSuccess.value = false;
    }, 3000);
  } catch (err: any) {
    console.error('Failed to reject ownership transfer:', err);
    ownershipErrorMessage.value = err.message || 'Failed to reject ownership transfer';
    showRejectOwnershipError.value = true;
  }
};

onMounted(async () => {
  // Fetch community data
  try {
    await fetchCommunity();

    // Check if user is banned - redirect to home if banned
    if (community.value?.isBanned) {
      console.log('User is banned from this community, redirecting to home');
      router.push('/');
      return;
    }
  } catch (err: any) {
    console.error('Failed to load community:', err);
  }

  // Fetch posts
  fetchPosts();

  // Fetch members
  if (activeTab.value === 'members') {
    fetchMembers();
  }

  // TODO: Fetch pinned posts from backend
  pinnedPosts.value = [];

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.relative')) {
      showJoinedDropdown.value = false;
      openMemberDropdown.value = null;
    }
  });
});

// Watch for slug changes to reload community data
watch(communitySlug, async (newSlug, oldSlug) => {
  if (newSlug && newSlug !== oldSlug) {
    try {
      await fetchCommunity();

      if (community.value?.isBanned) {
        router.push('/');
        return;
      }

      fetchPosts();

      if (activeTab.value === 'members') {
        fetchMembers();
      }
      if (activeTab.value === 'settings') {
        fetchJoinRequests();
        fetchBannedUsers();
        fetchPendingOwnershipTransfer();
      }
    } catch (err: any) {
      console.error('Failed to load community:', err);
    }
  }
});

// Watch for tab changes to load data as needed
watch(activeTab, (newTab, oldTab) => {
  if (newTab === 'members' && oldTab !== 'members') {
    fetchMembers();
  }
  if (newTab === 'settings') {
    fetchJoinRequests();
    fetchBannedUsers();
    fetchPendingOwnershipTransfer();
  }
});

// Watch for changes to requiresApproval to refetch join requests
watch(() => community.value?.requiresApproval, (newValue) => {
  if (newValue && activeTab.value === 'settings') {
    fetchJoinRequests();
  }
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
