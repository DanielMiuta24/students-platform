<template>
  <article
    class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
    :data-post-slug="post.slug"
  >
    <div class="p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img
            :src="authorAvatar"
            :alt="authorName"
            @click="navigateToAuthorProfile"
            class="w-12 h-12 rounded-full object-cover border-2 border-blue-100 hover:border-blue-300 transition cursor-pointer"
          />

          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3
                @click="navigateToAuthorProfile"
                class="font-bold text-gray-900 text-base hover:text-blue-600 transition cursor-pointer"
              >
                {{ authorName }}
              </h3>

              <span v-if="authorType" :class="authorTypeClass">
                <svg class="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" preserveAspectRatio="xMidYMid meet">
                  <path v-if="authorTypeIcon === 'student'" d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  <path v-else-if="authorTypeIcon === 'seeker'" d="M9 9a2 2 0 114 0 2 2 0 01-4 0z M9 9a2 2 0 114 0 2 2 0 01-4 0zM9 9a2 2 0 114 0 2 2 0 01-4 0z M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
                  <path v-else-if="authorTypeIcon === 'admin'" d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  <path v-else d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                {{ authorType }}
              </span>

              <div v-if="isOwner" class="flex gap-1.5">
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
            </div>

            <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span class="font-medium">{{ formatDate(post.createdAt) }}</span>
              <span>•</span>
              <span v-if="categoryName" class="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-200">
                {{ categoryName }}
              </span>
              <span v-if="post.visibility === 'public'" class="relative group inline-flex items-center px-2 py-0.5 rounded-md bg-green-50 text-green-700 font-medium border border-green-200 cursor-help">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Public
                <span class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-green-50 text-green-700 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-green-200">
                  Everyone can see this post
                  <span class="absolute right-full top-1/2 transform -translate-y-1/2 mr-0 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-green-50"></span>
                </span>
              </span>
              <span v-if="post.visibility === 'friends'" class="relative group inline-flex items-center px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-medium border border-purple-200 cursor-help">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Friends
                <span class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-purple-50 text-purple-700 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-purple-200">
                  Only your friends can see this post
                  <span class="absolute right-full top-1/2 transform -translate-y-1/2 mr-0 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-purple-50"></span>
                </span>
              </span>
              <span v-if="post.visibility === 'private'" class="relative group inline-flex items-center px-2 py-0.5 rounded-md bg-gray-50 text-gray-700 font-medium border border-gray-200 cursor-help">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Private
                <span class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-50 text-gray-700 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-gray-200">
                  Only you can see this post
                  <span class="absolute right-full top-1/2 transform -translate-y-1/2 mr-0 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-50"></span>
                </span>
              </span>
              <span v-if="post.visibility === 'public' || post.visibility === 'friends' || post.visibility === 'private'">•</span>
              <span v-if="categoryName">•</span>
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ post.viewCount }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="isOwner" class="relative">
<button
            @click="toggleMenu"
            class="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all"
            title="Post options"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          <div
            v-if="showMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
          >
<button
              @click="handleEdit"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Post
            </button>

<button
              @click="handleDelete"
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Post
            </button>

            <button
              @click="handleChangeAudience"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Change Audience
            </button>
          </div>
        </div>

        <div v-else-if="sessionStore.isAuthenticated && authorId" class="follow-button-container">
<button
            @click="toggleFollow"
            @mouseenter="followButtonHovered = true"
            @mouseleave="followButtonHovered = false"
            :disabled="isFollowing === null || isLoadingFollow"
            class="follow-btn"
            :class="followButtonClass"
          >
            {{ isLoadingFollow ? 'Loading...' : followButtonText }}
          </button>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {{ post.title }}
        </h4>

        <p class="text-gray-700 text-base leading-relaxed line-clamp-3">
          {{ contentPreview }}
        </p>
      </div>
    </div>

    <div v-if="post.images && post.images.length > 0" class="relative bg-gray-900 cursor-pointer" @click="viewPost">
      <!-- Single image -->
      <div v-if="post.images.length === 1" class="w-full">
        <img
          :src="post.images[0].url"
          :alt="post.images[0].alt || generateImageAlt(post.images[0].url)"
          class="w-full h-[500px] object-contain bg-black"
        />
      </div>

      <!-- Two images -->
      <div v-else-if="post.images.length === 2" class="grid grid-cols-2 gap-1">
        <img
          v-for="(image, index) in post.images"
          :key="index"
          :src="image.url"
          :alt="image.alt || generateImageAlt(image.url)"
          class="w-full h-[400px] object-cover"
        />
      </div>

      <!-- Three images -->
      <div v-else-if="post.images.length === 3" class="grid grid-cols-2 gap-1">
        <img
          :src="post.images[0].url"
          :alt="post.images[0].alt || generateImageAlt(post.images[0].url)"
          class="w-full h-[400px] object-cover col-span-2"
        />
        <img
          v-for="(image, index) in post.images.slice(1)"
          :key="index + 1"
          :src="image.url"
          :alt="image.alt || generateImageAlt(image.url)"
          class="w-full h-[300px] object-cover"
        />
      </div>

      <!-- Four or more images: show first 4 with +X overlay if needed -->
      <div v-else class="relative">
        <div class="grid grid-cols-2 gap-1">
          <div
            v-for="(image, index) in post.images.slice(0, 4)"
            :key="index"
            class="relative"
          >
            <img
              :src="image.url"
              :alt="image.alt || generateImageAlt(image.url)"
              class="w-full h-[300px] object-cover"
            />
            <!-- Show "+X more" overlay on last image if there are more than 4 -->
            <div
              v-if="index === 3 && post.images.length > 4"
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-4xl font-bold"
            >
              +{{ post.images.length - 4 }}
            </div>
          </div>
        </div>
      </div>
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
        <svg class="action-icon" viewBox="0 0 20 20" :fill="isLiked ? 'currentColor' : 'none'" :stroke="isLiked ? 'none' : 'currentColor'" stroke-width="1.5">
          <path v-if="isLiked" d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        <span v-if="likeCount > 0" class="action-count">{{ likeCount }}</span>
      </button>

      <button @click="toggleComments" class="action-btn" :class="{ 'action-btn-active': showComments }">
        <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span v-if="commentCount > 0" class="action-count">{{ commentCount }}</span>
      </button>

      <div class="relative">
        <button @click="toggleShareMenu" class="action-btn" data-share-toggle>
          <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
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

    <div v-if="showComments" class="border-t border-gray-200">
      <CommentSection :postId="post.id" :postAuthorId="typeof post.author === 'object' ? post.author.id : post.author" @comment-added="handleCommentAdded" @comment-deleted="handleCommentDeleted" />
    </div>

    <div v-if="actionError" class="px-4 pb-3 pt-0">
      <div class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
        {{ actionError }}
      </div>
    </div>

    <ConfirmModal
      :show="showDeleteModal"
      title="Delete Post?"
      message="This post will be permanently deleted. This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />

    <PostModal
      :show="showPostModal"
      :post="post"
      @close="showPostModal = false"
    />

    <LikesModal
      :show="showLikesModal"
      :likeable-id="post.id"
      likeable-type="Post"
      @close="showLikesModal = false"
    />

    <AudienceModal
      :show="showAudienceModal"
      :current-visibility="post.visibility"
      @close="showAudienceModal = false"
      @save="handleVisibilityChange"
    />
  </article>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import type { SafePost } from '../types/post';
import { updatePost, deletePost, updatePostVisibility } from '../api/post';
import ConfirmModal from './ConfirmModal.vue';
import PostModal from './PostModal.vue';
import AudienceModal from './AudienceModal.vue';
import CommentSection from './CommentSection.vue';
import LikesModal from './LikesModal.vue';
import { generateImageAlt } from '../utils/imageAlt';
import { getAvatarUrl } from '../utils/avatar';
import { useLike } from '../composables/useLike';
import { useFollow } from '../composables/useFollow';
import { useSessionStore } from '../store/session';

interface Props {
  post: SafePost;
  isOwner: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'edit', post: SafePost): void;
  (e: 'update', post: SafePost): void;
  (e: 'delete', postId: string): void;
}>();

const router = useRouter();
const sessionStore = useSessionStore();
const actionLoading = ref(false);
const actionError = ref<string | null>(null);
const showMenu = ref(false);
const showDeleteModal = ref(false);
const showPostModal = ref(false);
const showComments = ref(false);
const showLikesModal = ref(false);
const showAudienceModal = ref(false);
const commentCount = ref(props.post.commentCount || 0);
const followButtonHovered = ref(false);
const showShareMenu = ref(false);
const linkCopied = ref(false);

const { likeCount, isLiked, isLoading: isLoadingLike, toggleLike, fetchLikeStatus, likeText } = useLike(
  props.post.id,
  'Post',
  props.post.likeCount,
  false
);

import { useCategoryLookup } from '../composables/useCategoryLookup';
const { fetchCategories: loadCategories, getCategoryName } = useCategoryLookup();

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const closeMenuOnClickOutside = (event: MouseEvent) => {
  // Don't close menus when modal is open
  if (showDeleteModal.value || showPostModal.value || showLikesModal.value || showAudienceModal.value) {
    return;
  }

  const target = event.target as HTMLElement;
  if (showMenu.value && !target.closest('.relative')) {
    showMenu.value = false;
  }
  if (showShareMenu.value && !target.closest('.share-menu') && !target.closest('button[data-share-toggle]')) {
    showShareMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeMenuOnClickOutside);
  loadCategories();
  if (sessionStore.isAuthenticated) {
    fetchLikeStatus();
    if (!props.isOwner && authorId.value) {
      fetchFollowStatus();
    }
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenuOnClickOutside);
});

const authorName = computed(() => {
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
  const author = props.post.author;

  if (author && typeof author === 'object') {
    const authorObj = author as any;
    return getAvatarUrl(authorName.value, authorObj.avatar);
  }

  return getAvatarUrl(authorName.value);
});

const authorUsername = computed(() => {
  const author = props.post.author;

  if (author && typeof author === 'object') {
    const authorObj = author as any;
    return authorObj.username || null;
  }

  return null;
});

const authorId = computed(() => {
  const author = props.post.author;

  if (author && typeof author === 'object') {
    const authorObj = author as any;
    return authorObj.id || null;
  }

  if (typeof author === 'string') {
    return author;
  }

  return null;
});

const authorType = computed(() => {
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
    return `${baseClass} bg-purple-50 text-purple-700 border-purple-200`;
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

const { isFollowing, followsBack, isLoading: isLoadingFollow, toggleFollow, fetchFollowStatus, followText } = useFollow(
  authorId.value || ''
);

const followButtonClass = computed(() => {
  if (isFollowing.value) {
    return followButtonHovered.value ? 'following-hover' : 'following';
  }
  return 'not-following';
});

const followButtonText = computed(() => {
  if (isFollowing.value) {
    // Show Friends if mutual follow exists
    if (followsBack.value) {
      return followButtonHovered.value ? 'Unfollow' : 'Friends';
    }
    return followButtonHovered.value ? 'Unfollow' : 'Following';
  }
  return followsBack.value ? 'Follow Back' : 'Follow';
});

const categoryName = computed(() => {
  if (!props.post.category) return null;

  if (typeof props.post.category === 'object' && props.post.category !== null) {
    const categoryObj = props.post.category as any;
    return categoryObj.name || null;
  }

  if (typeof props.post.category === 'string') {
    return getCategoryName(props.post.category);
  }

  return null;
});

const contentPreview = computed(() => {
  if (!props.post.content) return '';

  if (typeof props.post.content === 'string') {
    return props.post.content.length > 200
      ? props.post.content.substring(0, 200) + '...'
      : props.post.content;
  }

  try {
    const lexicalContent = props.post.content as any;
    if (lexicalContent.root && lexicalContent.root.children) {
      let text = '';
      const extractText = (node: any): void => {
        if (node.type === 'text' && node.text) {
          text += node.text + ' ';
        }
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach(extractText);
        }
      };
      lexicalContent.root.children.forEach(extractText);
      const trimmed = text.trim();
      return trimmed.length > 200 ? trimmed.substring(0, 200) + '...' : trimmed;
    }
  } catch (err) {
  }

  return 'No content available';
});

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  // Just now (less than 1 minute)
  if (diffInSeconds < 60) {
    return 'Just now';
  }

  // Minutes ago (less than 1 hour)
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  // Hours ago (less than 24 hours)
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  }

  // Less than 7 days ago - show day name
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  }

  // Less than a year - show month and day
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // More than a year - show full date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const viewPost = () => {
  showPostModal.value = true;
};

const editPost = () => {
  emit('edit', props.post);
};

const handleEdit = () => {
  showMenu.value = false;
  editPost();
};

const handleDelete = () => {
  showMenu.value = false;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  showDeleteModal.value = false;

  try {
    actionLoading.value = true;
    actionError.value = null;

    // Delete from API
    await deletePost(props.post.id);

    actionLoading.value = false;
    actionError.value = null;

    // Emit delete event to parent so it can update its state
    emit('delete', props.post.id);
  } catch (err: any) {
    actionLoading.value = false;
    actionError.value = err.message || 'Failed to delete post';
  }
};

const handleChangeAudience = () => {
  showMenu.value = false;
  showAudienceModal.value = true;
};

const handleVisibilityChange = async (newVisibility: 'public' | 'private' | 'friends') => {
  if (!props.isOwner) return;

  try {
    actionLoading.value = true;
    actionError.value = null;

    const updatedPost = await updatePostVisibility(props.post.id, newVisibility);
    emit('update', updatedPost);
  } catch (err: any) {
    actionError.value = err.message || 'Failed to update visibility';
  } finally {
    actionLoading.value = false;
  }
};

const navigateToAuthorProfile = () => {
  if (authorUsername.value) {
    router.push(`/profile/${authorUsername.value}`);
  }
};

const toggleComments = async () => {
  showComments.value = !showComments.value;

  // Fetch accurate count when opening comments
  if (showComments.value) {
    try {
      const { getCommentCount } = await import('../api/comment');
      const count = await getCommentCount(props.post.id);
      commentCount.value = count;
    } catch (err) {
      console.error('Failed to fetch comment count:', err);
    }
  }
};

const handleCommentAdded = async () => {
  try {
    const { getCommentCount } = await import('../api/comment');
    const count = await getCommentCount(props.post.id);
    commentCount.value = count;
  } catch (err) {
    console.error('Failed to fetch comment count:', err);
    commentCount.value++;
  }
};

const handleCommentDeleted = async () => {
  try {
    const { getCommentCount } = await import('../api/comment');
    const count = await getCommentCount(props.post.id);
    commentCount.value = count;
  } catch (err) {
    console.error('Failed to fetch comment count:', err);
    commentCount.value--;
  }
};

const getPostUrl = () => {
  const baseUrl = window.location.origin;
  const username = typeof props.post.author === 'object' ? props.post.author.username : '';
  return `${baseUrl}/profile/${username}/posts/${props.post.slug}`;
};

const toggleShareMenu = (event: Event) => {
  event.stopPropagation();
  showShareMenu.value = !showShareMenu.value;
  linkCopied.value = false;
};

const shareOnWhatsApp = () => {
  const url = getPostUrl();
  const text = `${props.post.title}\n\n${url}`;
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
  const text = props.post.title;
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
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.engagement-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-top: 1px solid #e4e6eb;
}

.stats-left {
  display: flex;
  gap: 8px;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #65676b;
  font-size: 15px;
}

.stat-item:hover {
  text-decoration: underline;
}

.like-icon {
  width: 18px;
  height: 18px;
  background: #1877f2;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  padding: 2px;
}

.stat-count {
  font-size: 15px;
  color: #65676b;
}

.stats-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.stat-text {
  color: #65676b;
  cursor: pointer;
  font-size: 15px;
}

.stat-text:hover {
  text-decoration: underline;
}

.engagement-stats {
  padding: 8px 16px 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.likes-button {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
  color: #65676b;
  font-size: 13px;
  font-weight: 600;
}

.likes-button:hover {
  background: #f0f2f5;
  text-decoration: underline;
}

.like-icon {
  font-size: 14px;
}

.like-count-text {
  color: #65676b;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 4px 16px 8px;
  border-top: 1px solid #e4e6eb;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  color: #65676b;
  font-weight: 600;
  font-size: 15px;
}

.action-btn:hover {
  background: #f0f2f5;
}

.action-btn-active {
  color: #1877f2;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-icon {
  width: 20px;
  height: 20px;
}

.action-text {
  font-size: 15px;
  font-weight: 600;
  color: inherit;
}

.action-count {
  font-size: 15px;
  font-weight: 600;
  color: inherit;
}

.follow-button-container {
  display: flex;
  align-items: center;
}

.follow-btn {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.follow-btn.not-following {
  background: #1877f2;
  color: white;
}

.follow-btn.not-following:hover:not(:disabled) {
  background: #166fe5;
}

.follow-btn.following {
  background: #e4e6eb;
  color: #050505;
}

.follow-btn.following:hover:not(:disabled) {
  background: #ef4444;
  color: white;
}

.follow-btn.following-hover {
  background: #ef4444;
  color: white;
}

.follow-btn.following-hover:hover:not(:disabled) {
  background: #dc2626;
}

.follow-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
