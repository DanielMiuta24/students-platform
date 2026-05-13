<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div class="px-6 py-8">
      <div class="flex gap-6">
        <aside class="w-72 flex-shrink-0">
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden sticky top-20">
            <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600">
              <h2 class="text-2xl font-bold text-white">Dashboard</h2>
              <p class="text-blue-100 text-sm mt-1">Manage your account</p>
            </div>

            <nav class="p-4">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-medium transition-all mb-2',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transform scale-[1.02]'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                ]"
              >
                <component :is="tab.icon" class="w-5 h-5 flex-shrink-0" />
                <span>{{ tab.label }}</span>
              </button>
            </nav>
          </div>
        </aside>

        <main class="flex-1 min-w-0">
          <DashboardGeneral
            v-if="activeTab === 'general'"
            :user="user"
            :saved-universities-count="savedUniversities.length"
            :communities-count="communitiesCount"
            :posts-count="postsCount"
          />

          <DashboardChangePassword v-else-if="activeTab === 'change-password'" />

          <div v-else-if="activeTab === 'student-status'" class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div class="max-w-3xl mx-auto">
              <div class="text-center mb-8">
                <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>

                <h2 class="text-3xl font-bold text-gray-900 mb-3">Get Verified Student Status</h2>
                <p class="text-lg text-gray-600 mb-8">
                  Verify your account with your university email to unlock exclusive student benefits and features.
                </p>
              </div>

              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Benefits of Student Verification:</h3>
                <ul class="space-y-3">
                  <li class="flex items-start gap-3">
                    <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-gray-700"><strong>Display verified student badge on your profile</strong> to stand out in the community</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-gray-700"><strong>Make your profile trustable for people who are looking for study</strong></span>
                  </li>
                </ul>
              </div>

              <form @submit.prevent="handleVerifyStudent" class="space-y-6">
                <div>
                  <label for="universityEmail" class="block text-sm font-semibold text-gray-900 mb-2">
                    University Email Address
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                    </div>
                    <input
                      id="universityEmail"
                      v-model="studentVerificationEmail"
                      type="email"
                      placeholder="student@university.edu"
                      class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                  <p class="text-sm text-gray-500 mt-2">
                    Please use your official university email address (e.g., .edu, .ac.uk, etc.)
                  </p>
                </div>

                <button
                  type="submit"
                  class="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 text-lg"
                >
                  Send Verification Email
                </button>

                <p class="text-sm text-gray-500 text-center">
                  You'll receive a verification link at your university email address
                </p>
              </form>
            </div>
          </div>

          <div v-else-if="activeTab === 'saved-universities'" class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-3xl font-bold text-gray-900">Saved Universities</h2>
              <router-link to="/universities" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/30">
                Search more
              </router-link>
            </div>

            <div v-if="isLoading" class="text-center py-16">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <p class="mt-4 text-gray-600 font-medium">Loading saved universities...</p>
            </div>

            <div v-else-if="savedUniversities.length === 0" class="empty-state">
              <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p class="text-xl font-bold text-gray-900 mb-2">No saved universities yet</p>
              <p class="text-gray-600">Start searching and save universities you like.</p>
            </div>

            <div v-else class="grid gap-4">
              <div
                v-for="university in savedUniversities"
                :key="university.id || university.name"
                class="border-2 border-gray-100 rounded-xl p-5 flex justify-between items-center hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div>
                  <h3 class="font-bold text-gray-900 text-lg">{{ university.name }}</h3>
                  <p class="text-sm text-gray-600 mt-1">{{ university.country || "Country not listed" }}</p>
                </div>
                <a
                  v-if="university.website"
                  :href="university.website"
                  target="_blank"
                  class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/20"
                >
                  Visit
                </a>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'saved-scholarships'" class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-3xl font-bold text-gray-900">Saved Scholarships</h2>
              <router-link to="/scholarships" class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition shadow-lg shadow-green-500/30">
                Search more
              </router-link>
            </div>

            <div class="empty-state">
              <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-xl font-bold text-gray-900 mb-2">No saved scholarships yet</p>
              <p class="text-gray-600">Start searching and save scholarships you're interested in.</p>
            </div>
          </div>

          <div v-else-if="activeTab === 'drafts'" class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-3xl font-bold text-gray-900">My Drafts</h2>
              <div class="text-sm text-gray-600">
                <span class="font-semibold text-gray-900">{{ drafts.length }}</span> draft{{ drafts.length !== 1 ? 's' : '' }}
              </div>
            </div>

            <div v-if="deleteSuccessMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <p class="text-green-800 font-medium">{{ deleteSuccessMessage }}</p>
            </div>

            <div v-if="isDraftsLoading" class="text-center py-16">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <p class="mt-4 text-gray-600 font-medium">Loading drafts...</p>
            </div>

            <div v-else-if="drafts.length === 0" class="empty-state">
              <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p class="text-xl font-bold text-gray-900 mb-2">No drafts yet</p>
              <p class="text-gray-600">Start creating posts and save them as drafts.</p>
            </div>

            <div v-else class="grid gap-4">
              <div
                v-for="draft in drafts"
                :key="draft.id"
                class="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h3 class="font-bold text-gray-900 text-lg mb-1">{{ draft.title }}</h3>
                      <div class="flex items-center gap-3 text-xs text-gray-600">
                        <span class="flex items-center gap-1">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ formatDate(draft.updatedAt) }}
                        </span>
                        <span v-if="draft.community" class="flex items-center gap-1 text-purple-600 font-medium">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {{ typeof draft.community === 'string' ? draft.community : draft.community?.name }}
                        </span>
                      </div>
                    </div>
                    <span class="px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">DRAFT</span>
                  </div>
                </div>

                <div class="px-6 py-3 bg-gray-50 flex items-center gap-2">
                  <button
                    @click="editDraft(draft)"
                    class="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    @click="deleteDraft(draft)"
                    class="flex items-center gap-1.5 px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'notifications'" class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-8">Notifications</h2>

            <div class="empty-state">
              <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p class="text-xl font-bold text-gray-900 mb-2">No notifications yet</p>
              <p class="text-gray-600">You'll see notifications here when you have activity.</p>
            </div>
          </div>

          <div v-else-if="activeTab === 'requests'" class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-8">Requests</h2>

            <div v-if="requestSuccessMessage" class="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
              <svg class="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p v-if="requestSuccessMessage.startsWith('ownership-transfer:')" class="text-green-800 font-semibold">
                You are now the owner of
                <button
                  @click="$router.push(`/community/${requestSuccessMessage.split(':')[2]}`)"
                  class="underline hover:text-green-900 font-bold"
                >
                  {{ requestSuccessMessage.split(':')[1] }}
                </button>!
              </p>
              <p v-else class="text-green-800 font-semibold">{{ requestSuccessMessage }}</p>
            </div>

            <div v-if="requestsLoading" class="text-center py-8">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p class="text-gray-600 mt-4">Loading requests...</p>
            </div>

            <div v-else class="space-y-6">
              <div class="border-l-4 border-blue-600 pl-6 py-4">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Community Join Requests</h3>
                <div v-if="joinRequestsToMyCommunities.length === 0" class="empty-state-small">
                  <p class="text-gray-600">No pending join requests</p>
                </div>
                <div v-else class="space-y-3">
                  <div
                    v-for="request in joinRequestsToMyCommunities"
                    :key="request.id"
                    class="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-semibold text-gray-900">{{ request.user?.name || 'Unknown User' }}</p>
                        <p class="text-sm text-gray-600">wants to join {{ request.communityName }}</p>
                        <p class="text-xs text-gray-500 mt-1">{{ new Date(request.createdAt).toLocaleDateString() }}</p>
                      </div>
                      <div class="flex gap-2">
                        <button
                          @click="approveJoinRequest(request)"
                          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          @click="rejectJoinRequest(request)"
                          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-l-4 border-green-600 pl-6 py-4">
                <h3 class="text-xl font-bold text-gray-900 mb-4">My Join Requests</h3>
                <div v-if="myJoinRequests.length === 0" class="empty-state-small">
                  <p class="text-gray-600">No pending requests to join communities</p>
                </div>
                <div v-else class="space-y-3">
                  <div
                    v-for="community in myJoinRequests"
                    :key="community.id"
                    class="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-semibold text-gray-900">{{ community.name }}</p>
                        <p class="text-sm text-gray-600">Request pending approval</p>
                      </div>
                      <button
                        @click="cancelMyJoinRequest(community)"
                        class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-l-4 border-indigo-600 pl-6 py-4">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Community Invitations</h3>
                <div v-if="myInvitations.length === 0" class="empty-state-small">
                  <p class="text-gray-600">No pending invitations</p>
                </div>
                <div v-else class="space-y-3">
                  <div
                    v-for="invitation in myInvitations"
                    :key="invitation.id"
                    class="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-semibold text-gray-900">{{ invitation.communityName }}</p>
                        <p class="text-sm text-gray-600">Invited to join this community</p>
                        <p class="text-xs text-gray-500 mt-1">{{ new Date(invitation.createdAt).toLocaleDateString() }}</p>
                      </div>
                      <div class="flex gap-2">
                        <button
                          @click="acceptInvitation(invitation)"
                          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          @click="declineInvitation(invitation)"
                          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-l-4 border-purple-600 pl-6 py-4">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Ownership Transfer Requests</h3>
                <div v-if="ownershipTransferRequests.length === 0" class="empty-state-small">
                  <p class="text-gray-600">No ownership transfer requests</p>
                </div>
                <div v-else class="space-y-3">
                  <div
                    v-for="transfer in ownershipTransferRequests"
                    :key="transfer.id"
                    class="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-semibold text-gray-900">{{ transfer.community?.name || 'Unknown Community' }}</p>
                        <p class="text-sm text-gray-600">from {{ transfer.currentOwner?.name || 'Unknown' }}</p>
                        <p class="text-xs text-gray-500 mt-1">{{ new Date(transfer.createdAt).toLocaleDateString() }}</p>
                      </div>
                      <div class="flex gap-2">
                        <button
                          @click="acceptOwnershipTransfer(transfer)"
                          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          @click="rejectOwnershipTransfer(transfer)"
                          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>

  <EditPostModal
    v-if="showEditPostModal && selectedPost"
    :post="selectedPost"
    :is-open="showEditPostModal"
    :is-community-post="!!selectedPost.community"
    @close="handleCloseEditModal"
    @updated="handlePostUpdated"
  />

  <ConfirmModal
    :show="showDeleteModal"
    title="Delete Draft"
    message="Are you sure you want to delete this draft? This action cannot be undone."
    confirm-text="Delete"
    cancel-text="Cancel"
    @confirm="confirmDeleteDraft"
    @cancel="cancelDeleteDraft"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, h, watch } from 'vue';
import { api } from '../services/api';
import { deletePost } from '../api/post';
import { useRouter } from 'vue-router';
import axios from 'axios';
import DashboardGeneral from '../components/dashboard/DashboardGeneral.vue';
import DashboardChangePassword from '../components/dashboard/DashboardChangePassword.vue';
import EditPostModal from '../components/EditPostModal.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const router = useRouter();
const activeTab = ref('general');
const user = ref<any>(null);
const savedUniversities = ref<any[]>([]);
const isLoading = ref(false);
const studentVerificationEmail = ref('');
const communitiesCount = ref(0);
const postsCount = ref(0);
const drafts = ref<any[]>([]);
const isDraftsLoading = ref(false);
const showEditPostModal = ref(false);
const selectedPost = ref<any>(null);
const showDeleteModal = ref(false);
const draftToDelete = ref<any>(null);
const deleteSuccessMessage = ref('');
const joinRequestsToMyCommunities = ref<any[]>([]);
const myJoinRequests = ref<any[]>([]);
const myInvitations = ref<any[]>([]);
const ownershipTransferRequests = ref<any[]>([]);
const requestsLoading = ref(false);
const requestSuccessMessage = ref('');

const tabs = [
  {
    id: 'general',
    label: 'General',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
    ])
  },
  {
    id: 'change-password',
    label: 'Change Password',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' })
    ])
  },
  {
    id: 'student-status',
    label: 'Student Status',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' })
    ])
  },
  {
    id: 'saved-universities',
    label: 'Saved Universities',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' })
    ])
  },
  {
    id: 'saved-scholarships',
    label: 'Saved Scholarships',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ])
  },
  {
    id: 'drafts',
    label: 'Post Drafts',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' })
    ])
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' })
    ])
  },
  {
    id: 'requests',
    label: 'Requests',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' })
    ])
  }
];

onMounted(async () => {
  await fetchUserProfile();
  fetchSavedUniversities();
  fetchCommunitiesCount();
  fetchPostsCount();
});

const fetchUserProfile = async () => {
  try {
    const response = await api.get('users/get-profile');
    user.value = response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
  }
};

const fetchSavedUniversities = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/users/my-saved-universities');
    savedUniversities.value = response.data;
  } catch (error) {
    console.error('Failed to fetch saved universities:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchCommunitiesCount = async () => {
  try {
    const response = await api.get('communities?limit=1000');
    const communities = response.data.communities || [];
    const joinedCount = communities.filter((c: any) => c.joined).length;
    communitiesCount.value = joinedCount;
    console.log('Communities count:', joinedCount, 'Total communities:', communities.length);
  } catch (error) {
    console.error('Failed to fetch communities count:', error);
  }
};

const fetchPostsCount = async () => {
  try {
    const response = await api.get('posts/my-posts/count');
    postsCount.value = response.data.count || 0;
    console.log('Posts count:', response.data.count);
  } catch (error) {
    console.error('Failed to fetch posts count:', error);
  }
};

const fetchRequests = async () => {
  requestsLoading.value = true;
  try {
    const communities = await api.get('communities?limit=1000');
    const myCommunities = communities.data.communities.filter((c: any) =>
      c.role === 'admin' || c.role === 'founder'
    );

    const allJoinRequests: any[] = [];
    for (const community of myCommunities) {
      try {
        const { getJoinRequests } = await import('../api/community');
        const result = await getJoinRequests(community.id);
        const requests = result.requests.map((req: any) => ({
          ...req,
          communityName: community.name,
          communitySlug: community.slug
        }));
        allJoinRequests.push(...requests);
      } catch (err) {
        console.error(`Failed to fetch join requests for community ${community.id}:`, err);
      }
    }
    joinRequestsToMyCommunities.value = allJoinRequests;

    try {
      const { getMyInvitations } = await import('../api/community');
      const invitations = await getMyInvitations();
      myInvitations.value = invitations.map((inv: any) => ({
        ...inv,
        communityName: inv.community?.name,
        communitySlug: inv.community?.slug,
        communityId: inv.community?.id
      }));
    } catch (err) {
      console.error('Failed to fetch invitations:', err);
      myInvitations.value = [];
    }

    const myCommunitiesWithRequests = communities.data.communities.filter((c: any) => c.hasPendingRequest);
    myJoinRequests.value = myCommunitiesWithRequests;

    try {
      const { getMyOwnershipTransferRequests } = await import('../api/community');
      const transfers = await getMyOwnershipTransferRequests();
      console.log('Ownership transfer requests:', transfers);
      ownershipTransferRequests.value = transfers || [];
    } catch (err) {
      console.error('Failed to fetch ownership transfers:', err);
      ownershipTransferRequests.value = [];
    }
  } catch (error) {
    console.error('Failed to fetch requests:', error);
  } finally {
    requestsLoading.value = false;
  }
};

const handleVerifyStudent = async () => {
  if (!studentVerificationEmail.value) {
    alert('Please enter your university email');
    return;
  }

  try {
    alert(`Verification email will be sent to ${studentVerificationEmail.value}`);
    studentVerificationEmail.value = '';
  } catch (error) {
    console.error('Failed to send verification email:', error);
    alert('Failed to send verification email. Please try again.');
  }
};

watch(activeTab, (newTab) => {
  if (newTab === 'drafts' && drafts.value.length === 0) {
    fetchDrafts();
  }
});

const fetchDrafts = async () => {
  isDraftsLoading.value = true;
  try {
    const response = await api.get('posts/my-drafts');
    drafts.value = response.data.drafts || [];
  } catch (error) {
    console.error('Failed to fetch drafts:', error);
    drafts.value = [];
  } finally {
    isDraftsLoading.value = false;
  }
};

const getPlainText = (content: any): string => {
  if (!content) return 'No content';

  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      return extractTextFromContent(parsed);
    } catch {
      return content.substring(0, 200);
    }
  }

  return extractTextFromContent(content);
};

const extractTextFromContent = (content: any): string => {
  if (!content) return 'No content';

  if (typeof content === 'string') return content.substring(0, 200);

  if (content.content && Array.isArray(content.content)) {
    let text = '';
    for (const node of content.content) {
      if (node.content && Array.isArray(node.content)) {
        for (const child of node.content) {
          if (child.text) {
            text += child.text + ' ';
          }
        }
      } else if (node.text) {
        text += node.text + ' ';
      }
    }
    return text.trim().substring(0, 200) || 'No content';
  }

  if (content.text) return content.text.substring(0, 200);

  return 'No content';
};

const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const navigateToDraft = (draft: any) => {
  router.push(`/posts/${draft.slug}`);
};

const editDraft = (draft: any) => {
  selectedPost.value = draft;
  showEditPostModal.value = true;
};

const handlePostUpdated = async (updatedPost?: any) => {
  showEditPostModal.value = false;
  const wasPublished = updatedPost && updatedPost.status !== 'draft';
  selectedPost.value = null;

  if (wasPublished) {
    drafts.value = drafts.value.filter(d => d.id !== updatedPost.id);

    deleteSuccessMessage.value = `Post "${updatedPost.title}" has been published successfully!`;
    setTimeout(() => {
      deleteSuccessMessage.value = '';
    }, 5000);
  } else {
    await fetchDrafts();
  }
};

const handleCloseEditModal = () => {
  showEditPostModal.value = false;
  selectedPost.value = null;
};

const deleteDraft = (draft: any) => {
  draftToDelete.value = draft;
  showDeleteModal.value = true;
};

const confirmDeleteDraft = async () => {
  if (!draftToDelete.value) return;

  try {
    await deletePost(draftToDelete.value.id);
    drafts.value = drafts.value.filter(d => d.id !== draftToDelete.value!.id);
    showDeleteModal.value = false;
    const deletedTitle = draftToDelete.value.title;
    draftToDelete.value = null;

    deleteSuccessMessage.value = `Draft "${deletedTitle}" has been successfully deleted.`;
    setTimeout(() => {
      deleteSuccessMessage.value = '';
    }, 5000);
  } catch (error: any) {
    console.error('Failed to delete draft:', error);
    alert(error.message || 'Failed to delete draft. Please try again.');
  }
};

const cancelDeleteDraft = () => {
  showDeleteModal.value = false;
  draftToDelete.value = null;
};

const approveJoinRequest = async (request: any) => {
  try {
    const { approveJoinRequest: approveAPI } = await import('../api/community');
    await approveAPI(request.community, request.id);
    joinRequestsToMyCommunities.value = joinRequestsToMyCommunities.value.filter(r => r.id !== request.id);
    requestSuccessMessage.value = `Approved ${request.user?.name || 'user'}'s request to join ${request.communityName}`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);
  } catch (error: any) {
    alert(error.message || 'Failed to approve request');
  }
};

const rejectJoinRequest = async (request: any) => {
  try {
    const { rejectJoinRequest: rejectAPI } = await import('../api/community');
    await rejectAPI(request.community, request.id);
    joinRequestsToMyCommunities.value = joinRequestsToMyCommunities.value.filter(r => r.id !== request.id);
    requestSuccessMessage.value = `Rejected ${request.user?.name || 'user'}'s request to join ${request.communityName}`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);
  } catch (error: any) {
    alert(error.message || 'Failed to reject request');
  }
};

const cancelMyJoinRequest = async (community: any) => {
  try {
    const { cancelJoinRequest } = await import('../api/community');
    await cancelJoinRequest(community.id);
    myJoinRequests.value = myJoinRequests.value.filter(c => c.id !== community.id);
    requestSuccessMessage.value = `Cancelled request to join ${community.name}`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);
  } catch (error: any) {
    alert(error.message || 'Failed to cancel request');
  }
};

const acceptOwnershipTransfer = async (transfer: any) => {
  try {
    const { acceptOwnershipTransfer: acceptAPI } = await import('../api/community');
    await acceptAPI(transfer.id);
    ownershipTransferRequests.value = ownershipTransferRequests.value.filter(t => t.id !== transfer.id);
    requestSuccessMessage.value = `ownership-transfer:${transfer.community?.name}:${transfer.community?.slug}`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);
  } catch (error: any) {
    alert(error.message || 'Failed to accept ownership transfer');
  }
};

const rejectOwnershipTransfer = async (transfer: any) => {
  try {
    const { rejectOwnershipTransfer: rejectAPI } = await import('../api/community');
    await rejectAPI(transfer.id);
    ownershipTransferRequests.value = ownershipTransferRequests.value.filter(t => t.id !== transfer.id);
    requestSuccessMessage.value = `Rejected ownership transfer for ${transfer.community?.name}`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);
  } catch (error: any) {
    alert(error.message || 'Failed to reject ownership transfer');
  }
};

const acceptInvitation = async (invitation: any) => {
  try {
    const { acceptInvitation: acceptAPI } = await import('../api/community');
    await acceptAPI(invitation.id);
    myInvitations.value = myInvitations.value.filter(i => i.id !== invitation.id);
    requestSuccessMessage.value = `You have joined ${invitation.communityName}!`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);
  } catch (error: any) {
    alert(error.message || 'Failed to accept invitation');
  }
};

const declineInvitation = async (invitation: any) => {
  try {
    const { cancelInvitation } = await import('../api/community');
    await cancelInvitation(invitation.communityId, invitation.id);
    myInvitations.value = myInvitations.value.filter(i => i.id !== invitation.id);
    requestSuccessMessage.value = `Declined invitation to ${invitation.communityName}`;
    setTimeout(() => {
      requestSuccessMessage.value = '';
    }, 5000);
  } catch (error: any) {
    alert(error.message || 'Failed to decline invitation');
  }
};

watch(activeTab, (newTab) => {
  if (newTab === 'drafts') {
    fetchDrafts();
  } else if (newTab === 'requests') {
    fetchRequests();
  }
});
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 64px 32px;
}

.empty-state-small {
  text-align: center;
  padding: 32px 24px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 1rem;
  border: 2px dashed #e5e7eb;
}
</style>
