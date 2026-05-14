<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-10">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <div class="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 font-semibold px-4 py-2 rounded-full">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Community
          </div>
          <button
            @click="router.push('/community/join')"
            class="inline-flex items-center gap-2 bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full hover:bg-blue-200 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Instead
          </button>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 px-4">
          Start Your Own Community
        </h1>
        <p class="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Build a space where students can connect, share experiences, and support each other
        </p>
      </div>

      <div class="mb-8 px-2">
        <div class="grid grid-cols-2 gap-4 sm:hidden">
          <div
            v-for="(step, index) in steps"
            :key="index"
            :class="[
              'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all',
              currentStep > index
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                : currentStep === index
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
                : 'bg-gray-50 border-gray-200'
            ]"
          >
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all mb-2',
                currentStep > index
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : currentStep === index
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-500'
              ]"
            >
              <svg v-if="currentStep > index" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span
              :class="[
                'text-xs font-semibold text-center',
                currentStep >= index ? 'text-gray-900' : 'text-gray-400'
              ]"
            >
              {{ step }}
            </span>
          </div>
        </div>

        <div class="hidden sm:block">
          <div class="flex items-center justify-center max-w-4xl mx-auto">
            <template v-for="(step, index) in steps" :key="index">
              <div class="flex flex-col items-center">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all mb-2',
                    currentStep > index
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : currentStep === index
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  ]"
                >
                  <svg v-if="currentStep > index" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <span
                  :class="[
                    'text-xs font-medium text-center w-24',
                    currentStep >= index ? 'text-gray-900' : 'text-gray-400'
                  ]"
                >
                  {{ step }}
                </span>
              </div>
              <div
                v-if="index < steps.length - 1"
                :class="[
                  'h-1 w-16 mb-8 transition-all flex-shrink-0',
                  currentStep > index ? 'bg-green-500' : 'bg-gray-200'
                ]"
              ></div>
            </template>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border-2 border-blue-100">
        <div v-if="currentStep === 0" class="space-y-6">
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 mb-6">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="text-center sm:text-left">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Basic Information</h2>
                <p class="text-xs sm:text-sm text-gray-600">Give your community a name and identity</p>
              </div>
            </div>

            <div class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Community Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.name"
                  placeholder="e.g., Study in Germany"
                  maxlength="50"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <p class="text-xs text-gray-500 mt-1">{{ formData.name.length }}/50 characters</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.category"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                >
                  <option value="">Choose a category</option>
                  <option v-if="loadingCategories" disabled>Loading categories...</option>
                  <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Visibility <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.visibility"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                >
                  <option value="public">Public - Anyone can find and join</option>
                  <option value="private">Private - Invite-only community</option>
                </select>
                <p class="text-xs text-gray-500 mt-1">
                  {{ formData.visibility === 'public' ? 'Everyone can discover and join your community' : 'Only invited members can join your community' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 1" class="space-y-6">
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 mb-6">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <div class="text-center sm:text-left">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Description</h2>
                <p class="text-xs sm:text-sm text-gray-600">Tell members what this community is about</p>
              </div>
            </div>

            <div class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Community Description <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="formData.description"
                  rows="6"
                  maxlength="300"
                  placeholder="What is this community about? What topics will be discussed? Who should join?"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                ></textarea>
                <p class="text-xs text-gray-500 mt-1">{{ formData.description.length }}/300 characters</p>
              </div>

              <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-1">Writing Tips</h4>
                    <ul class="text-sm text-gray-700 space-y-1">
                      <li>• Be clear and specific about the community's purpose</li>
                      <li>• Mention the type of content and discussions expected</li>
                      <li>• Describe who would benefit from joining</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 2" class="space-y-6">
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 mb-6">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="text-center sm:text-left">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Cover Image</h2>
                <p class="text-xs sm:text-sm text-gray-600">Add a cover image for your community (optional)</p>
              </div>
            </div>

            <div class="space-y-5">
              <div v-if="coverImagePreview" class="relative rounded-2xl border-2 border-blue-200 overflow-hidden group">
                <img
                  :src="coverImagePreview"
                  alt="Cover preview"
                  class="w-full h-48 sm:h-64 object-cover block"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    @click="removeCoverImage"
                    type="button"
                    class="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 flex items-center gap-2 shadow-lg"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    Remove Image
                  </button>
                </div>
              </div>

              <div v-else class="border-2 border-dashed border-gray-300 rounded-2xl p-8 sm:p-12 text-center hover:border-blue-400 transition-all bg-gradient-to-br from-gray-50 to-blue-50">
                <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-2">Upload Cover Image</h3>
                <p class="text-xs sm:text-sm text-gray-600 mb-4">Drag and drop or click to browse</p>
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileUpload"
                  accept="image/*"
                  class="hidden"
                />
                <button
                  @click="triggerFileInput"
                  type="button"
                  class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                >
                  Choose Image
                </button>
                <p class="text-xs text-gray-500 mt-3">Recommended: 1200x400px, max 5MB</p>
              </div>

              <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-1">Cover Image Tips</h4>
                    <ul class="text-sm text-gray-700 space-y-1">
                      <li>• Use high-quality images that represent your community</li>
                      <li>• Avoid images with important text at the edges</li>
                      <li>• You can change the cover image anytime later</li>
                      <li>• This step is optional - you can skip it</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 3" class="space-y-6">
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 mb-6">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div class="text-center sm:text-left">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Invite People</h2>
                <p class="text-xs sm:text-sm text-gray-600">Invite friends to join your community (optional)</p>
              </div>
            </div>

            <div class="space-y-5">
              <!-- Invite Button -->
              <button
                @click="showInviteModal = true"
                type="button"
                class="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center gap-3"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Add Invitations
              </button>

              <!-- Invited Users List -->
              <div v-if="allInvitedUsers.length > 0" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
                <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Invited Members ({{ allInvitedUsers.length }})
                </h4>
                <div class="space-y-2">
                  <div
                    v-for="(invite, index) in allInvitedUsers"
                    :key="index"
                    class="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-blue-200"
                  >
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                      <div v-if="invite.type === 'user'" class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {{ invite.name.charAt(0).toUpperCase() }}
                      </div>
                      <svg v-else class="w-5 h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <div class="flex-1 min-w-0">
                        <span class="text-gray-700 font-medium text-sm truncate block">{{ invite.display }}</span>
                        <span v-if="invite.type === 'user'" class="text-xs text-gray-500">@{{ invite.username }}</span>
                      </div>
                    </div>
                    <button
                      @click="removeInviteByIndex(index)"
                      class="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                    >
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-1">About Invitations</h4>
                    <ul class="text-sm text-gray-700 space-y-1">
                      <li>• Invited members will receive an email invitation</li>
                      <li>• They can join even if they don't have an account yet</li>
                      <li>• You can invite more people after creating the community</li>
                      <li>• This step is completely optional</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 4" class="space-y-6">
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 mb-6">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="text-center sm:text-left">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Review & Create</h2>
                <p class="text-xs sm:text-sm text-gray-600">Double-check your community details</p>
              </div>
            </div>

            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-200">
              <div v-if="coverImagePreview" class="mb-4 -mt-4 -mx-4 sm:-mt-6 sm:-mx-6">
                <img
                  :src="coverImagePreview"
                  alt="Community cover"
                  class="w-full h-32 sm:h-40 object-cover rounded-t-xl sm:rounded-t-2xl"
                />
              </div>

              <div :class="['flex flex-col sm:flex-row items-start sm:items-start gap-3 sm:gap-4 mb-4', coverImagePreview ? 'mt-4' : '']">
                <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg flex-shrink-0 mx-auto sm:mx-0">
                  {{ formData.name.charAt(0).toUpperCase() || '?' }}
                </div>
                <div class="flex-1 text-center sm:text-left">
                  <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{{ formData.name }}</h3>
                  <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span class="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-300">
                      {{ formData.category }}
                    </span>
                    <span :class="[
                      'inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border',
                      formData.visibility === 'public'
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300'
                        : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-300'
                    ]">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path v-if="formData.visibility === 'public'" d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path v-if="formData.visibility === 'public'" fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                        <path v-if="formData.visibility === 'private'" fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                      </svg>
                      {{ formData.visibility === 'public' ? 'Public' : 'Private' }}
                    </span>
                  </div>
                </div>
              </div>

              <p class="text-gray-700 leading-relaxed mb-4">{{ formData.description }}</p>

              <div class="flex flex-wrap items-center gap-3 mb-4">
                <div class="flex items-center gap-2 text-sm text-gray-600 bg-white rounded-lg px-4 py-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span class="font-semibold">{{ 1 + allInvitedUsers.length }} {{ allInvitedUsers.length === 0 ? 'member' : 'members' }}</span>
                </div>
                <div v-if="allInvitedUsers.length > 0" class="flex items-center gap-2 text-sm text-blue-700 bg-white rounded-lg px-4 py-2 border border-blue-300">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span class="font-semibold">{{ allInvitedUsers.length }} {{ allInvitedUsers.length === 1 ? 'invite' : 'invites' }} sent</span>
                </div>
              </div>
            </div>

            <div v-if="invitedUsersList.length > 0" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-200 mt-4">
              <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Member Invitations ({{ invitedUsersList.length }})
              </h4>
              <div class="space-y-1.5 max-h-32 overflow-y-auto">
                <div
                  v-for="(invite, index) in invitedUsersList"
                  :key="index"
                  class="bg-white rounded-lg px-3 py-2 text-sm font-medium border border-blue-200 flex items-center gap-2"
                >
                  <div class="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {{ invite.name.charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-gray-700 flex-1 truncate">{{ invite.display }}</span>
                  <span class="text-xs text-gray-500">@{{ invite.username }}</span>
                </div>
              </div>
            </div>

            <div v-if="invitedEmailsList.length > 0" class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200 mt-4">
              <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Email Invitations ({{ invitedEmailsList.length }})
              </h4>
              <div class="space-y-1.5 max-h-32 overflow-y-auto">
                <div
                  v-for="(invite, index) in invitedEmailsList"
                  :key="index"
                  class="bg-white rounded-lg px-3 py-2 text-sm font-medium border border-green-200 flex items-center gap-2"
                >
                  <svg class="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span class="text-gray-700 flex-1 truncate">{{ invite.display }}</span>
                </div>
              </div>
            </div>

            <div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mt-6">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-1">Before you create</h4>
                  <ul class="text-sm text-gray-700 space-y-1">
                    <li>• You'll become the community founder and admin</li>
                    <li>• Community names and categories cannot be changed later</li>
                    <li>• You can edit the description anytime</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t-2 border-gray-100">
          <button
            v-if="currentStep > 0"
            @click="currentStep--"
            class="w-full sm:flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all order-2 sm:order-1"
          >
            ← Back
          </button>

          <button
            v-if="currentStep < 4"
            @click="nextStep"
            :disabled="!canProceed"
            :class="[
              'w-full sm:flex-1 px-6 py-3 font-bold rounded-xl transition-all shadow-lg order-1 sm:order-2',
              canProceed
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            ]"
          >
            {{
              (currentStep === 2 && !formData.coverImage) ? 'Skip & Continue →' :
              (currentStep === 3 && allInvitedUsers.length === 0) ? 'Skip & Review →' :
              'Continue →'
            }}
          </button>

          <button
            v-if="currentStep === 4"
            @click="createCommunity"
            :disabled="isCreating"
            :class="[
              'w-full sm:flex-1 px-6 py-3 font-bold rounded-xl transition-all shadow-lg order-1 sm:order-2',
              isCreating
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
            ]"
          >
            {{ isCreating ? 'Creating...' : '🎉 Create Community' }}
          </button>
        </div>
      </div>

      <div class="text-center mt-8">
        <button
          @click="router.push('/community/join')"
          class="text-gray-600 hover:text-blue-600 font-medium transition-colors inline-flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Browse Communities
        </button>
      </div>
    </div>

    <ConfirmationModal
      :is-open="showSuccessModal"
      variant="success"
      title="Community Created!"
      subtitle="Your community is now live"
      message="Congratulations! You've successfully created your community. Start inviting members and posting content."
      confirm-text="Go to Community"
      cancel-text="Create Another"
      :show-cancel="true"
      :icon="`<svg fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'/></svg>`"
      @close="handleCreateAnother"
      @confirm="handleGoToCommunity"
    />

    <!-- Invite People Modal -->
    <InvitePeopleModal
      :is-open="showInviteModal"
      @close="showInviteModal = false"
      @send-invites="handleSendInvites"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getActiveCategories } from '../api/category';
import type { Category } from '../types/category';
import ConfirmationModal from '../components/ConfirmationModal.vue';
import InvitePeopleModal from '../components/InvitePeopleModal.vue';
import { createCommunity as createCommunityAPI } from '../api/community';

const router = useRouter();

interface Friend {
  username: string;
  name: string;
  type: 'Friend' | 'Follower' | 'Following';
}

interface InvitedUser {
  type: 'email' | 'user';
  display: string;
  name: string;
  username?: string;
  userId?: string;
}

const steps = ['Basic Info', 'Description', 'Cover Image', 'Invite People', 'Review'];
const currentStep = ref(0);
const showSuccessModal = ref(false);
const showInviteModal = ref(false);
const createdCommunitySlug = ref<string | null>(null);
const isCreating = ref(false);

const categories = ref<Category[]>([]);
const loadingCategories = ref(false);

const formData = ref({
  name: '',
  category: '',
  description: '',
  visibility: 'public' as 'public' | 'private',
  coverImage: null as File | null,
  invites: [] as string[],
  invitedUsers: [] as string[],
});

// Store user data for invited users (id -> {name, username})
const invitedUsersData = ref<Map<string, { name: string; username: string }>>(new Map());

const fileInput = ref<HTMLInputElement | null>(null);

onMounted(async () => {
  await fetchCategories();
});

const fetchCategories = async () => {
  loadingCategories.value = true;
  try {
    categories.value = await getActiveCategories();
  } catch (err) {
    console.error('Failed to load categories:', err);
  } finally {
    loadingCategories.value = false;
  }
};

const friendsList = ref<Friend[]>([
  { username: 'sarah_lee', name: 'Sarah Lee', type: 'Friend' },
  { username: 'john_doe', name: 'John Doe', type: 'Following' },
  { username: 'maria_garcia', name: 'Maria Garcia', type: 'Friend' },
  { username: 'alex_chen', name: 'Alex Chen', type: 'Follower' },
  { username: 'emma_wilson', name: 'Emma Wilson', type: 'Friend' },
  { username: 'david_kim', name: 'David Kim', type: 'Following' },
  { username: 'lisa_brown', name: 'Lisa Brown', type: 'Follower' },
  { username: 'michael_jones', name: 'Michael Jones', type: 'Friend' },
]);

const filteredFriends = computed(() => {
  const query = friendSearchQuery.value.toLowerCase();
  if (!query) return friendsList.value;

  return friendsList.value.filter(friend =>
    friend.name.toLowerCase().includes(query) ||
    friend.username.toLowerCase().includes(query) ||
    friend.type.toLowerCase().includes(query)
  );
});

const allInvitedUsers = computed<InvitedUser[]>(() => {
  const emailInvites: InvitedUser[] = formData.value.invites.map(email => ({
    type: 'email',
    display: email,
    name: email,
  }));

  const userInvites: InvitedUser[] = formData.value.invitedUsers.map(userId => {
    const userData = invitedUsersData.value.get(userId);
    return {
      type: 'user',
      display: userData?.name || userId,
      name: userData?.name || userId,
      username: userData?.username || userId,
      userId: userId,
    };
  });

  return [...emailInvites, ...userInvites];
});

const invitedUsersList = computed<InvitedUser[]>(() => {
  return formData.value.invitedUsers.map(userId => {
    const userData = invitedUsersData.value.get(userId);
    return {
      type: 'user',
      display: userData?.name || userId,
      name: userData?.name || userId,
      username: userData?.username || userId,
      userId: userId,
    };
  });
});

const invitedEmailsList = computed<InvitedUser[]>(() => {
  return formData.value.invites.map(email => ({
    type: 'email',
    display: email,
    name: email,
  }));
});

const coverImagePreview = computed(() => {
  if (!formData.value.coverImage) return null;
  return URL.createObjectURL(formData.value.coverImage);
});

const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return formData.value.name.trim().length >= 3 && formData.value.category.length > 0;
  }
  if (currentStep.value === 1) {
    return formData.value.description.trim().length >= 20;
  }
  if (currentStep.value === 2) {
    return true;
  }
  if (currentStep.value === 3) {
    return true;
  }
  return true;
});

const nextStep = () => {
  if (canProceed.value && currentStep.value < 4) {
    currentStep.value++;
  }
};

const addInvite = () => {
  const email = inviteEmail.value.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && emailRegex.test(email) && !formData.value.invites.includes(email)) {
    formData.value.invites.push(email);
    inviteEmail.value = '';
  }
};

const removeInvite = (index: number) => {
  formData.value.invites.splice(index, 1);
};

const inviteUser = (friend: Friend) => {
  if (!formData.value.invitedUsers.includes(friend.username)) {
    formData.value.invitedUsers.push(friend.username);
  }
};

const isUserInvited = (username: string): boolean => {
  return formData.value.invitedUsers.includes(username);
};

const removeInviteByIndex = (index: number) => {
  const invite = allInvitedUsers.value[index];
  if (invite.type === 'email') {
    const emailIndex = formData.value.invites.indexOf(invite.display);
    if (emailIndex !== -1) {
      formData.value.invites.splice(emailIndex, 1);
    }
  } else if (invite.type === 'user' && invite.userId) {
    const userIndex = formData.value.invitedUsers.indexOf(invite.userId);
    if (userIndex !== -1) {
      formData.value.invitedUsers.splice(userIndex, 1);
      // Also remove from the user data map
      invitedUsersData.value.delete(invite.userId);
    }
  }
};

const handleSendInvites = (data: { userIds: string[]; emails: string[]; users: Array<{ id: string; name: string; username: string }> }) => {
  console.log('handleSendInvites received:', data);

  // Add emails to formData
  data.emails.forEach(email => {
    if (!formData.value.invites.includes(email)) {
      formData.value.invites.push(email);
    }
  });

  // Add userIds and store user data
  data.users.forEach(user => {
    if (!formData.value.invitedUsers.includes(user.id)) {
      formData.value.invitedUsers.push(user.id);
      invitedUsersData.value.set(user.id, {
        name: user.name,
        username: user.username
      });
    }
  });

  console.log('formData.invites:', formData.value.invites);
  console.log('formData.invitedUsers:', formData.value.invitedUsers);
  console.log('invitedUsersData:', invitedUsersData.value);
  console.log('allInvitedUsers:', allInvitedUsers.value);

  showInviteModal.value = false;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file && file.type.startsWith('image/')) {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    formData.value.coverImage = file;
  } else {
    alert('Please select a valid image file');
  }
};

const removeCoverImage = () => {
  formData.value.coverImage = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const createCommunity = async () => {
  if (isCreating.value) return;

  try {
    isCreating.value = true;

    // Create FormData to send to API
    const apiFormData = new FormData();
    apiFormData.append('name', formData.value.name);
    apiFormData.append('category', formData.value.category);
    apiFormData.append('description', formData.value.description);
    apiFormData.append('visibility', formData.value.visibility);

    // Add cover image if present
    if (formData.value.coverImage) {
      apiFormData.append('coverImage', formData.value.coverImage);
    }

    // Add invitations if present
    if (formData.value.invites.length > 0 || formData.value.invitedUsers.length > 0) {
      const invitations: { emails?: string[]; userIds?: string[] } = {};

      if (formData.value.invites.length > 0) {
        invitations.emails = formData.value.invites;
      }

      if (formData.value.invitedUsers.length > 0) {
        invitations.userIds = formData.value.invitedUsers;
      }

      apiFormData.append('invitations', JSON.stringify(invitations));
    }

    // Call API
    const result = await createCommunityAPI(apiFormData);

    createdCommunitySlug.value = result.community.slug;
    showSuccessModal.value = true;
  } catch (err: any) {
    alert(err.message || 'Failed to create community');
  } finally {
    isCreating.value = false;
  }
};

const handleGoToCommunity = () => {
  if (createdCommunitySlug.value) {
    router.push(`/community/${createdCommunitySlug.value}`);
  }
};

const handleCreateAnother = () => {
  showSuccessModal.value = false;
  currentStep.value = 0;
  formData.value = {
    name: '',
    category: '',
    description: '',
    visibility: 'public',
    coverImage: null,
    invites: [],
    invitedUsers: [],
  };
  inviteEmail.value = '';
  friendSearchQuery.value = '';
  createdCommunitySlug.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};
</script>
