<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 bg-black bg-opacity-90"
        @click.self="closeModal"
      >
        <div
          class="relative w-full h-full bg-white flex flex-col"
          @click.stop
        >
          <button
            @click="closeModal"
            class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-full shadow-lg hover:bg-opacity-70 transition text-white"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="flex flex-col md:flex-row h-full">
            <div v-if="post.images && post.images.length > 0" class="md:w-3/5 bg-black flex items-center justify-center relative">
              <img
                :src="post.images[currentImageIndex].url"
                :alt="post.images[currentImageIndex].alt || generateImageAlt(post.images[currentImageIndex].url)"
                class="max-w-full max-h-full object-contain"
              />

              <div v-if="post.images.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <button
                  v-for="(_, index) in post.images"
                  :key="index"
                  @click="currentImageIndex = index"
                  :class="[
                    'w-2 h-2 rounded-full transition',
                    currentImageIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                  ]"
                ></button>
              </div>

              <button
                v-if="post.images.length > 1 && currentImageIndex > 0"
                @click="currentImageIndex--"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-lg hover:bg-white transition"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                v-if="post.images.length > 1 && currentImageIndex < post.images.length - 1"
                @click="currentImageIndex++"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-lg hover:bg-white transition"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div class="md:w-2/5 flex flex-col overflow-hidden bg-white">
              <div class="p-4 border-b border-gray-200">
                <div class="flex items-center gap-3">
                  <img
                    :src="authorAvatar"
                    :alt="authorName"
                    @click="navigateToAuthorProfile"
                    class="w-12 h-12 rounded-full object-cover border-2 border-blue-100 hover:border-blue-300 transition cursor-pointer"
                  />
                  <div class="flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3
                        @click="navigateToAuthorProfile"
                        class="font-bold text-gray-900 hover:text-blue-600 transition cursor-pointer"
                      >
                        {{ authorName }}
                      </h3>

                      <span v-if="authorType" :class="authorTypeClass" :style="(authorType || '').toLowerCase().includes('studyseeker') ? { backgroundColor: '#0f2a5f' } : {}">
                        <svg class="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" preserveAspectRatio="xMidYMid meet">
                          <path v-if="authorTypeIcon === 'student'" d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          <path v-else-if="authorTypeIcon === 'seeker'" d="M9 9a2 2 0 114 0 2 2 0 01-4 0z M9 9a2 2 0 114 0 2 2 0 01-4 0zM9 9a2 2 0 114 0 2 2 0 01-4 0z M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
                          <path v-else-if="authorTypeIcon === 'admin'" d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          <path v-else d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                        {{ authorType }}
                      </span>

                      <span
                        v-if="effectiveAuthorCommunityRole === COMMUNITY_ROLE.FOUNDER || effectiveAuthorCommunityRole === COMMUNITY_ROLE.ADMIN"
                        class="text-xs font-semibold px-2 py-1 rounded-md bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200 flex items-center gap-1"
                      >
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        {{ effectiveAuthorCommunityRole === COMMUNITY_ROLE.FOUNDER ? 'Founder' : 'Admin' }}
                      </span>

                      <template v-if="communityName">
                        <svg class="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                        <span
                          @click="navigateToCommunity"
                          class="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-semibold text-blue-700 border border-blue-200 hover:border-blue-300 transition-all cursor-pointer shadow-sm"
                          style="background: linear-gradient(to right, #eff6ff, rgba(15, 42, 95, 0.05));"
                        >
                          <svg class="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          {{ communityName }}
                        </span>
                      </template>

                      <div v-if="isOwner && post" class="flex gap-1.5">
                        <span
                          v-if="post.status === 'draft'"
                          class="text-xs font-semibold px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200"
                        >
                          📝 Draft
                        </span>
                        <span
                          v-if="post.status === 'archived'"
                          class="text-xs font-semibold px-2 py-1 rounded-md bg-gray-50 text-gray-700 border border-gray-200"
                        >
                          📦 Archived
                        </span>
                      </div>

                      <span
                        v-if="post && post.isPinned && isCommunityPost"
                        class="text-xs font-semibold px-2 py-1 rounded-md text-blue-700 border border-blue-200 flex items-center gap-1"
                        style="background: linear-gradient(to right, #eff6ff, rgba(15, 42, 95, 0.05));"
                      >
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2h3a1 1 0 011 1v1a1 1 0 01-1 1h-1v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9H2a1 1 0 01-1-1V7a1 1 0 011-1h3V5zm2 0v2h6V5H7zm-1 4h8v6H6V9z" />
                        </svg>
                        Pinned
                      </span>
                    </div>

                    <div class="flex items-center gap-2 text-xs text-gray-500 flex-wrap mt-1">
                      <p>{{ formatDate(post.createdAt) }}</p>
                      <span v-if="categoryName">•</span>
                      <span v-if="categoryName" class="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-200">
                        {{ categoryName }}
                      </span>

                      <span v-if="isCommunityPost" class="relative group inline-flex items-center px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 font-medium border border-emerald-300 cursor-help">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        Community
                        <span class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-emerald-50 text-emerald-800 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-emerald-300">
                          Only community members can see this post
                        </span>
                      </span>

                      <span v-if="!isCommunityPost && post && displayVisibility === 'public'" class="relative group inline-flex items-center px-2 py-0.5 rounded-md bg-green-50 text-green-700 font-medium border border-green-200 cursor-help">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Public
                        <span class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-green-50 text-green-700 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-green-200">
                          Everyone can see this post
                        </span>
                      </span>

                      <span v-if="!isCommunityPost && post && displayVisibility === 'friends'" class="relative group inline-flex items-center px-2 py-0.5 rounded-md font-medium border cursor-help text-white" style="background-color: #0f2a5f; border-color: rgba(15, 42, 95, 0.3);">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Friends
                        <span class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg border text-white" style="background-color: rgba(15, 42, 95, 0.9); border-color: rgba(15, 42, 95, 0.3);">
                          Only your friends can see this post
                        </span>
                      </span>

                      <span v-if="!isCommunityPost && post && displayVisibility === 'private'" class="relative group inline-flex items-center px-2 py-0.5 rounded-md bg-gray-50 text-gray-700 font-medium border border-gray-200 cursor-help">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Private
                        <span class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-50 text-gray-700 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-gray-200">
                          Only you can see this post
                        </span>
                      </span>

                      <span v-if="post" class="flex items-center gap-1 text-gray-500">
                        <span>•</span>
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {{ post.viewCount }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex-1 overflow-y-auto flex flex-col">
                <div class="p-4 border-b border-gray-200">
                  <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ post.title }}</h2>
                  <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed" v-html="formattedContent"></div>
                </div>

                <div v-if="likeCount > 0" class="engagement-stats">
                  <button @click="showLikesModal = true" class="likes-button">
                    <span class="like-icon">👍</span>
                  </button>
                </div>

                <div class="action-buttons">
                  <button
                    @click="toggleLike"
                    :disabled="isLoadingLike"
                    class="action-btn"
                    :class="{ 'action-btn-active': isLiked }"
                  >
                    <svg
                      class="action-icon"
                      viewBox="0 0 20 20"
                      :fill="isLiked ? 'currentColor' : 'none'"
                      :stroke="isLiked ? 'none' : 'currentColor'"
                      stroke-width="1.5"
                    >
                      <path v-if="isLiked" d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span class="action-text">{{ likeCount }}</span>
                  </button>
                  <button @click="focusCommentInput" class="action-btn">
                    <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span class="action-text">{{ post?.commentCount || 0 }}</span>
                  </button>

                  <div class="relative">
                    <button @click="toggleShareMenu" class="action-btn" data-share-toggle>
                      <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                      </svg>
                      <span class="action-text">Share</span>
                    </button>

                    <div v-if="showShareMenu" class="share-menu">
                      <button @click="shareOnWhatsApp" class="share-menu-item">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span>WhatsApp</span>
                      </button>

                      <button @click="shareOnFacebook" class="share-menu-item">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>Facebook</span>
                      </button>

                      <button @click="shareOnTwitter" class="share-menu-item">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        <span>X (Twitter)</span>
                      </button>

                      <button @click="shareOnLinkedIn" class="share-menu-item">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <span>LinkedIn</span>
                      </button>

                      <button @click="copyLink" class="share-menu-item">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span>{{ linkCopied ? 'Copied!' : 'Copy Link' }}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <CommentSection :postId="post.id" :postAuthorId="typeof post?.author === 'object' ? post.author.id : post?.author" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <LikesModal
      :show="showLikesModal"
      :likeable-id="post?.id || ''"
      likeable-type="Post"
      @close="showLikesModal = false"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import type { SafePost } from '../types/post';
import { generateImageAlt } from '../utils/imageAlt';
import { getAvatarUrl } from '../utils/avatar';
import { useCategoryLookup } from '../composables/useCategoryLookup';
import { useLike } from '../composables/useLike';
import { useSessionStore } from '../store/session';
import CommentSection from './CommentSection.vue';
import LikesModal from './LikesModal.vue';
import { getPostById } from '../api/post';
import { COMMUNITY_ROLE } from '../types/community';

interface Props {
  show: boolean;
  post: SafePost | null;
  authorCommunityRole?: 'founder' | 'admin' | 'member' | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const router = useRouter();
const sessionStore = useSessionStore();
const currentImageIndex = ref(0);
const viewCount = ref(props.post?.viewCount || 0);
const showLikesModal = ref(false);
const showShareMenu = ref(false);
const linkCopied = ref(false);

const { likeCount, isLiked, isLoading: isLoadingLike, toggleLike, fetchLikeStatus, likeText } = useLike(
  props.post?.id || '',
  'Post',
  props.post?.likeCount || 0,
  false
);

const { fetchCategories: loadCategories, getCategoryName } = useCategoryLookup();

onMounted(() => {
  loadCategories();
});

watch(() => props.show, async (newVal) => {
  if (newVal) {
    currentImageIndex.value = 0;
    document.body.style.overflow = 'hidden';

    if (props.post?.id) {
      try {
        const updatedPost = await getPostById(props.post.id, true);
        viewCount.value = updatedPost.post.viewCount;
      } catch (err) {
        console.error('Failed to increment view:', err);
      }

      if (sessionStore.isAuthenticated) {
        fetchLikeStatus();
      }
    }
  } else {
    document.body.style.overflow = '';
  }
});

const closeModal = () => {
  emit('close');
};

const authorName = computed(() => {
  if (!props.post) return 'Unknown Author';
  const author = props.post.author;

  if (author && typeof author === 'object') {
    const authorObj = author as any;
    if (authorObj.name && typeof authorObj.name === 'string') {
      return authorObj.name;
    }
    if (authorObj.username && typeof authorObj.username === 'string') {
      return authorObj.username;
    }
  }

  if (typeof author === 'string') {
    return author;
  }

  return 'Unknown Author';
});

const authorAvatar = computed(() => {
  if (!props.post) return getAvatarUrl('User');
  const author = props.post.author;

  if (author && typeof author === 'object') {
    const authorObj = author as any;
    return getAvatarUrl(authorName.value, authorObj.avatar);
  }

  return getAvatarUrl(authorName.value);
});

const authorUsername = computed(() => {
  if (!props.post) return null;
  const author = props.post.author;

  if (author && typeof author === 'object') {
    const authorObj = author as any;
    return authorObj.username || null;
  }

  return null;
});

const categoryName = computed(() => {
  if (!props.post || !props.post.category) return null;

  if (typeof props.post.category === 'object' && props.post.category !== null) {
    const categoryObj = props.post.category as any;
    return categoryObj.name || null;
  }

  if (typeof props.post.category === 'string') {
    return getCategoryName(props.post.category);
  }

  return null;
});

const communityName = computed(() => {
  if (!props.post || !props.post.community) return null;

  if (typeof props.post.community === 'object' && props.post.community !== null) {
    const communityObj = props.post.community as any;
    return communityObj.name || null;
  }

  return null;
});

const communitySlug = computed(() => {
  if (!props.post || !props.post.community) return null;

  if (typeof props.post.community === 'object' && props.post.community !== null) {
    const communityObj = props.post.community as any;
    return communityObj.slug || null;
  }

  return null;
});

const navigateToCommunity = () => {
  if (communitySlug.value) {
    router.push(`/community/${communitySlug.value}`);
  }
};

const effectiveAuthorCommunityRole = computed(() => {
  return props.authorCommunityRole || props.post?.authorCommunityRole || null;
});

const isCommunityPost = computed(() => {
  return !!props.post?.community || props.post?.visibility === 'community';
});

const communityVisibility = computed(() => {
  if (!props.post?.community) return null;

  if (typeof props.post.community === 'object' && props.post.community !== null) {
    const communityObj = props.post.community as any;
    return communityObj.visibility || null;
  }

  return null;
});

const displayVisibility = computed(() => {
  if (props.post?.community && communityVisibility.value) {
    return communityVisibility.value;
  }
  if (props.post?.visibility === 'community') {
    return 'public';
  }
  return props.post?.visibility;
});

const authorType = computed(() => {
  if (!props.post) return null;
  const author = props.post.author;

  if (author && typeof author === 'object') {
    const authorObj = author as any;
    return authorObj.type || null;
  }

  return null;
});

const authorTypeClass = computed(() => {
  const baseClass = 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border';
  const type = authorType.value?.toLowerCase() || '';

  if (type.includes('student')) {
    return `${baseClass} bg-blue-50 text-blue-700 border-blue-200`;
  } else if (type.includes('studyseeker')) {
    return `${baseClass} text-white border border-blue-900`;
  } else if (type.includes('admin')) {
    return `${baseClass} bg-red-50 text-red-700 border-red-200`;
  }

  return `${baseClass} bg-gray-50 text-gray-700 border-gray-200`;
});

const authorTypeIcon = computed(() => {
  const type = authorType.value?.toLowerCase() || '';

  if (type.includes('student')) return 'student';
  if (type.includes('studyseeker')) return 'seeker';
  if (type.includes('admin')) return 'admin';
  return 'default';
});

const isOwner = computed(() => {
  if (!sessionStore.user || !props.post) return false;
  const authorId = typeof props.post.author === 'string'
    ? props.post.author
    : (props.post.author as any).id;
  return sessionStore.user.id === authorId;
});

const formattedContent = computed(() => {
  if (!props.post || !props.post.content) return '';

  if (typeof props.post.content === 'string') {
    return props.post.content.replace(/\n/g, '<br>');
  }

  try {
    const lexicalContent = props.post.content as any;
    if (lexicalContent.root && lexicalContent.root.children) {
      let html = '';
      const processNode = (node: any): string => {
        if (node.type === 'text' && node.text) {
          let text = node.text;
          if (node.format) {
            if (node.format & 1) text = `<strong>${text}</strong>`;
            if (node.format & 2) text = `<em>${text}</em>`;
            if (node.format & 4) text = `<u>${text}</u>`;
          }
          return text;
        }
        if (node.type === 'paragraph') {
          const content = node.children?.map(processNode).join('') || '';
          return `<p class="mb-3">${content}</p>`;
        }
        if (node.type === 'heading' && node.tag) {
          const content = node.children?.map(processNode).join('') || '';
          return `<${node.tag} class="font-bold mb-2">${content}</${node.tag}>`;
        }
        if (node.children && Array.isArray(node.children)) {
          return node.children.map(processNode).join('');
        }
        return '';
      };
      html = lexicalContent.root.children.map(processNode).join('');
      return html;
    }
  } catch (err) {
    console.error('Error parsing content:', err);
  }

  return 'No content available';
});

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const navigateToAuthorProfile = () => {
  if (authorUsername.value) {
    router.push(`/profile/${authorUsername.value}`);
    emit('close');
  }
};

const focusCommentInput = () => {
  const commentTextarea = document.querySelector('.comment-form .comment-textarea') as HTMLTextAreaElement;
  if (commentTextarea) {
    commentTextarea.focus();
  }
};

const getPostUrl = () => {
  const baseUrl = window.location.origin;
  const username = typeof props.post?.author === 'object' ? props.post.author.username : '';
  return `${baseUrl}/profile/${username}/posts/${props.post?.slug}`;
};

const toggleShareMenu = (event: Event) => {
  event.stopPropagation();
  showShareMenu.value = !showShareMenu.value;
  linkCopied.value = false;
};

const shareOnWhatsApp = () => {
  const url = getPostUrl();
  const text = `${props.post?.title || 'Check out this post'}\n\n${url}`;
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(shareUrl, '_blank', 'noopener,noreferrer');
  showShareMenu.value = false;
};

const shareOnFacebook = () => {
  const url = getPostUrl();
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    alert(`Facebook share only works with public URLs.\n\nYour post URL: ${url}\n\nDeploy your app to test Facebook sharing, or the link will work once deployed.`);
    showShareMenu.value = false;
    return;
  }

  window.open(shareUrl, '_blank', 'noopener,noreferrer');
  showShareMenu.value = false;
};

const shareOnTwitter = () => {
  const url = getPostUrl();
  const text = props.post?.title || 'Check out this post';
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'noopener,noreferrer');
  showShareMenu.value = false;
};

const shareOnLinkedIn = () => {
  const url = getPostUrl();
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    alert(`LinkedIn share only works with public URLs.\n\nYour post URL: ${url}\n\nDeploy your app to test LinkedIn sharing, or the link will work once deployed.`);
    showShareMenu.value = false;
    return;
  }

  window.open(shareUrl, '_blank', 'noopener,noreferrer');
  showShareMenu.value = false;
};

const copyLink = async () => {
  try {
    const url = getPostUrl();
    await navigator.clipboard.writeText(url);
    linkCopied.value = true;
    setTimeout(() => {
      linkCopied.value = false;
      showShareMenu.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy link:', err);
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}

.engagement-stats {
  padding: 8px 16px 0 16px;
  border-top: 1px solid #e4e6eb;
}

.likes-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  color: #65676b;
  font-weight: 600;
  border-radius: 4px;
  transition: background 0.2s;
}

.likes-button:hover {
  background: #f0f2f5;
}

.like-icon {
  font-size: 16px;
}

.like-count {
  font-size: 15px;
  color: #65676b;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 16px 4px 16px;
  border-top: 1px solid #e4e6eb;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: none;
  border: none;
  color: #65676b;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #f0f2f5;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn-active {
  color: #1877f2;
}

.action-icon {
  width: 20px;
  height: 20px;
}

.action-text {
  font-size: 15px;
}

.share-menu {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e4e6eb;
  padding: 8px;
  z-index: 20;
  min-width: 200px;
}

.share-menu::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid white;
}

.share-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  color: #050505;
  font-size: 15px;
  font-weight: 500;
  text-align: left;
}

.share-menu-item:hover {
  background: #f0f2f5;
}

.share-menu-item svg {
  flex-shrink: 0;
}

</style>
