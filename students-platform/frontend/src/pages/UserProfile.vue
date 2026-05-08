<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
    <div class="max-w-6xl mx-auto px-4">
      <div v-if="loading && !isOwnProfile" class="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading profile...</p>
      </div>

      <div v-else-if="error && !isOwnProfile" class="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-red-600 mb-4 font-medium">{{ error }}</p>
        <button
          @click="fetchUserProfile"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition"
        >
          Try Again
        </button>
      </div>

      <template v-else>
        <div class="sticky top-16 z-40 bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div class="flex items-center gap-6">
              <img
                :src="user.profilePicture"
                :alt="user.name"
                class="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              />

              <div>
                <div class="flex items-center gap-3">
                  <h1 class="text-3xl font-bold text-blue-900">{{ user.name }}</h1>
                  <span :class="userTypeClass">
                    <svg class="w-3.5 h-3.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" preserveAspectRatio="xMidYMid meet">
                      <path v-if="userTypeIcon === 'student'" d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      <path v-else-if="userTypeIcon === 'seeker'" d="M9 9a2 2 0 114 0 2 2 0 01-4 0z M9 9a2 2 0 114 0 2 2 0 01-4 0zM9 9a2 2 0 114 0 2 2 0 01-4 0z M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
                      <path v-else-if="userTypeIcon === 'admin'" d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      <path v-else d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                    {{ user.study }}
                  </span>
                </div>
                <p class="text-gray-600 mt-2">{{ user.bio }}</p>

                <div class="flex gap-5 mt-4 text-sm text-gray-600">
                  <span><strong class="text-blue-900">{{ followersCount }}</strong> followers</span>
                  <span><strong class="text-blue-900">{{ followingCount }}</strong> following</span>
                  <span><strong class="text-blue-900">{{ friendsCount }}</strong> friends</span>
                </div>
              </div>
            </div>

            <div v-if="isOwnProfile" class="flex gap-3">
              <button
                @click="editProfile"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition"
              >
                Edit Profile
              </button>
            </div>

            <div v-else class="flex gap-3">
              <button
                @click="handleFollowToggle"
                @mouseenter="followButtonHovered = true"
                @mouseleave="followButtonHovered = false"
                :disabled="isFollowLoading"
                :class="followButtonClass"
              >
                {{ isFollowLoading ? 'Loading...' : followButtonText }}
              </button>

              <button
                @click="sendMessage"
                class="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-6 py-2 rounded-lg transition"
              >
                Chat
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <main class="space-y-8">
            <CreatePostForm
              v-if="isOwnProfile"
              ref="createPostFormRef"
              @success="handlePostSuccess"
              @error="handlePostError"
            />

            <section class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold text-blue-900 mb-4">Filter by Category</h2>
              <CategoryFilter @change="handleCategoryChange" />
            </section>

            <section v-if="isOwnProfile" class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold text-blue-900 mb-4">Filter by Visibility</h2>
              <VisibilityFilter @change="handleVisibilityChange" />
            </section>

            <section v-if="profileUserId">
              <ProfilePosts
                :key="postsRefreshKey"
                :user-id="profileUserId"
                :category-id="selectedCategoryId"
                :visibility-filter="selectedVisibility"
                :is-friend="isFollowing && followsBack"
                @focus-create-post="handleFocusCreatePost"
              />
            </section>
            <section v-else class="bg-white rounded-2xl shadow-lg p-8">
              <p class="text-gray-600">Please log in to view posts.</p>
            </section>
          </main>

          <aside class="space-y-8 lg:sticky lg:self-start" style="top: calc(4rem + 200px);">
            <section class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold text-blue-900 mb-4">
                {{ isOwnProfile ? 'My Communities' : 'Communities' }}
              </h2>

              <ul v-if="user.communities.length" class="space-y-3">
                <li
                  v-for="community in user.communities"
                  :key="community"
                  class="bg-blue-50 text-blue-700 font-semibold px-4 py-3 rounded-lg"
                >
                  {{ community }}
                </li>
              </ul>
              <p v-else class="text-gray-500 text-sm">
                {{ isOwnProfile ? 'No communities joined yet' : 'Not part of any communities' }}
              </p>
            </section>

            <FriendsList
              :friends="friends"
              :loading="friendsLoading"
              :title="isOwnProfile ? 'My Friends' : 'Friends'"
              empty-message="No friends yet"
              :show-follow-button="true"
              :current-user-id="currentUserId"
              :current-user-following="followingIds"
              :current-user-friends="friendIds"
              :profile-owner-following="profileOwnerFollowingIds"
              @refresh="handleListsRefresh"
            />

            <FollowingList
              :following="following"
              :loading="followingLoading"
              title="Following"
              empty-message="Not following anyone yet"
              :show-follow-button="true"
              :friends="friendIds"
              :current-user-id="currentUserId"
              :current-user-following="followingIds"
              :profile-owner-following="profileOwnerFollowingIds"
              @refresh="handleListsRefresh"
            />

            <FollowersList
              :followers="followers"
              :loading="followersLoading"
              title="Followers"
              empty-message="No followers yet"
              :show-follow-button="true"
              :current-user-id="currentUserId"
              :current-user-following="followingIds"
              :friends="friendIds"
              :profile-owner-following="profileOwnerFollowingIds"
              :is-own-profile="isOwnProfile"
              @refresh="handleListsRefresh"
            />
          </aside>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProfilePosts from '../components/ProfilePosts.vue';
import CreatePostForm from '../components/CreatePostForm.vue';
import CategoryFilter from '../components/CategoryFilter.vue';
import VisibilityFilter from '../components/VisibilityFilter.vue';
import FriendsList from '../components/FriendsList.vue';
import FollowersList from '../components/FollowersList.vue';
import FollowingList from '../components/FollowingList.vue';
import { useSessionStore } from '../store/session';
import { getUserByUsername, type SafeUser } from '../api/user';
import { getAvatarUrl } from '../utils/avatar';
import { useFollow } from '../composables/useFollow';
import { getFriends, getFollowers, getFollowing, type SafeFollow } from '../api/follow';

interface Friend {
  id: number;
  name: string;
  profilePicture: string;
}

interface User {
  id: string;
  name: string;
  profilePicture: string;
  bio: string;
  study: string;
  country: string;
  communities: string[];
  friends: Friend[];
}

const DEFAULT_AVATAR = 'https://via.placeholder.com/150';

const route = useRoute();
const router = useRouter();
const session = useSessionStore();

const createPostFormRef = ref<any>(null);
const userProfile = ref<SafeUser | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const selectedCategoryId = ref<string | null>(null);
const selectedVisibility = ref<'all' | 'public' | 'private' | 'friends'>('all');
const postsRefreshKey = ref(0);
const followButtonHovered = ref(false);
const friends = ref<SafeFollow[]>([]);
const friendsLoading = ref(false);
const followers = ref<SafeFollow[]>([]);
const followersLoading = ref(false);
const following = ref<SafeFollow[]>([]);
const followingLoading = ref(false);

const currentUserFollowing = ref<SafeFollow[]>([]);
const currentUserFriends = ref<SafeFollow[]>([]);
const currentUserFollowers = ref<SafeFollow[]>([]);

const routeUsername = computed(() => route.params.username as string);
const currentUserId = computed(() => session.user?.id || null);

const isOwnProfile = computed(() => {
  return routeUsername.value === session.user?.username;
});

const profileUserId = computed(() => {
  if (isOwnProfile.value) return currentUserId.value;
  return userProfile.value?.id || null;
});

const {
  isFollowing,
  followsBack,
  followersCount,
  followingCount,
  isLoading: isFollowLoading,
  error: followError,
  toggleFollow,
  fetchFollowStatus,
  fetchFollowStats,
  followText,
  setUserId,
} = useFollow(profileUserId.value || '');

const friendsCount = computed(() => friends.value.length);

const friendIds = computed(() => {
  if (isOwnProfile.value) {
    return friends.value.map(friend => friend.id);
  }
  return currentUserFriends.value.map(friend => friend.id);
});

const followingIds = computed(() => {
  if (isOwnProfile.value) {
    return following.value.map(user => user.id);
  }
  return currentUserFollowing.value.map(user => user.id);
});

const profileOwnerFollowingIds = computed(() => {
  if (isOwnProfile.value) {
    return following.value.map(user => user.id);
  }
  return currentUserFollowers.value.map(follower => follower.id);
});

const mapUserData = (userData: SafeUser | typeof session.user): User => {
  if (!userData) {
    return {
      id: '',
      name: 'Loading...',
      profilePicture: DEFAULT_AVATAR,
      bio: '',
      study: '',
      country: '',
      communities: [],
      friends: [],
    };
  }

  const baseData = {
    id: userData.id || '',
    name: userData.name || 'Unknown User',
    profilePicture: getAvatarUrl(userData.name || 'User', userData.avatar),
    bio: userData.bio || 'No bio yet',
    communities: [],
    friends: [],
  };

  if ('type' in userData) {
    return {
      ...baseData,
      study: userData.type || 'Student',
      country: userData.location || 'Unknown',
    };
  }

  return {
    ...baseData,
    study: 'Student',
    country: 'Unknown',
  };
};

const user = computed<User>(() => {
  if (isOwnProfile.value && session.user) {
    return mapUserData(session.user);
  }

  if (userProfile.value) {
    return mapUserData(userProfile.value);
  }

  return mapUserData(null as any);
});

const followButtonClass = computed(() => {
  const baseClasses = 'font-bold px-6 py-2 rounded-lg transition';

  if (isFollowing.value) {
    // When hovering, always show red "Unfollow" style
    if (followButtonHovered.value) {
      return `${baseClasses} bg-red-600 text-white hover:bg-red-700`;
    }
    // When not hovering, show gray style for both Following and Friends
    return `${baseClasses} bg-gray-200 text-gray-700 hover:bg-red-600 hover:text-white`;
  }

  // Not following - show blue Follow button
  return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
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


const userTypeClass = computed(() => {
  const baseClass = 'inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold shadow-sm';
  const userType = user.value.study.toLowerCase();

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
  const userType = user.value.study.toLowerCase();

  if (userType.includes('student')) {
    return 'student';
  } else if (userType.includes('studyseeker')) {
    return 'seeker';
  } else if (userType.includes('admin')) {
    return 'admin';
  }

  return 'default';
});

watch(routeUsername, () => {
  if (!isOwnProfile.value) {
    fetchUserProfile();
  } else {
    userProfile.value = null;
    if (profileUserId.value) {
      fetchFollowStats();
      fetchFriends();
      fetchFollowers();
      fetchFollowing();
    }
  }
});

watch(profileUserId, (newUserId) => {
  if (newUserId) {
    setUserId(newUserId);
    if (!isOwnProfile.value && session.isAuthenticated) {
      fetchFollowStatus();
      fetchFollowStats();
      fetchCurrentUserFollowing();
      fetchCurrentUserFriends();
      fetchCurrentUserFollowers();
    } else if (isOwnProfile.value) {
      fetchFollowStats();
    }
    fetchFriends();
    fetchFollowers();
    fetchFollowing();
  }
});

onMounted(() => {
  if (!isOwnProfile.value) {
    fetchUserProfile();
  } else if (profileUserId.value) {
    fetchFollowStats();
    fetchFriends();
    fetchFollowers();
    fetchFollowing();
  }

  const handleVisibilityChange = () => {
    if (!document.hidden && !isOwnProfile.value && profileUserId.value && session.isAuthenticated) {
      fetchFollowStatus();
      fetchFollowStats();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  const intervalId = setInterval(() => {
    if (!isOwnProfile.value && profileUserId.value && session.isAuthenticated) {
      fetchFollowStatus(true);
      fetchFollowStats();
    }
  }, 1000);

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    clearInterval(intervalId);
  });

  const postSlug = route.params.slug as string | undefined;
  if (postSlug) {
    setTimeout(() => {
      const postElement = document.querySelector(`[data-post-slug="${postSlug}"]`);
      if (postElement) {
        postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        postElement.classList.add('highlight-post');
        setTimeout(() => {
          postElement.classList.remove('highlight-post');
        }, 3000);
      }
    }, 1000);
  }
});

const fetchUserProfile = async () => {
  if (isOwnProfile.value) return;

  try {
    loading.value = true;
    error.value = null;
    userProfile.value = await getUserByUsername(routeUsername.value);

    if (userProfile.value?.id && session.isAuthenticated) {
      await fetchFollowStatus();
      await fetchFollowStats();
      await fetchCurrentUserFollowing();
      await fetchCurrentUserFriends();
      await fetchCurrentUserFollowers();
    }
    if (userProfile.value?.id) {
      await fetchFriends();
      await fetchFollowers();
      await fetchFollowing();
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load user profile';
  } finally {
    loading.value = false;
  }
};

const editProfile = () => {
  router.push("/edit-profile");
};

const handleFollowToggle = async () => {
  await toggleFollow();
  if (followError.value) {
    alert(followError.value);
  }
  postsRefreshKey.value++;
  await fetchFriends();
  await fetchFollowers();
  await fetchFollowing();
  await fetchCurrentUserFollowing();
  await fetchCurrentUserFriends();
  await fetchCurrentUserFollowers();
};

const sendMessage = () => {
  router.push(`/messages/${user.value.id}`);
};

const fetchFriends = async () => {
  if (!profileUserId.value) return;

  try {
    friendsLoading.value = true;
    const result = await getFriends(profileUserId.value, 1, 20);
    friends.value = result.users;
  } catch (err) {
    friends.value = [];
  } finally {
    friendsLoading.value = false;
  }
};

const fetchFollowers = async () => {
  if (!profileUserId.value) return;

  try {
    followersLoading.value = true;
    const result = await getFollowers(profileUserId.value, 1, 20);
    followers.value = result.users;
  } catch (err) {
    followers.value = [];
  } finally {
    followersLoading.value = false;
  }
};

const fetchFollowing = async () => {
  if (!profileUserId.value) return;

  try {
    followingLoading.value = true;
    const result = await getFollowing(profileUserId.value, 1, 20);
    following.value = result.users;
  } catch (err) {
    following.value = [];
  } finally {
    followingLoading.value = false;
  }
};

const fetchCurrentUserFollowing = async () => {
  if (!currentUserId.value || isOwnProfile.value) return;

  try {
    const result = await getFollowing(currentUserId.value, 1, 100);
    currentUserFollowing.value = result.users;
  } catch (err) {
    currentUserFollowing.value = [];
  }
};

const fetchCurrentUserFriends = async () => {
  if (!currentUserId.value || isOwnProfile.value) return;

  try {
    const result = await getFriends(currentUserId.value, 1, 100);
    currentUserFriends.value = result.users;
  } catch (err) {
    currentUserFriends.value = [];
  }
};

const fetchCurrentUserFollowers = async () => {
  if (!currentUserId.value || isOwnProfile.value) return;

  try {
    const result = await getFollowers(currentUserId.value, 1, 100);
    currentUserFollowers.value = result.users;
  } catch (err) {
    currentUserFollowers.value = [];
  }
};

const handlePostSuccess = (post: any) => {
  postsRefreshKey.value++;
};

const handlePostError = (error: any) => {
};

const handleListsRefresh = async () => {
  await Promise.all([
    fetchFriends(),
    fetchFollowers(),
    fetchFollowing(),
    fetchFollowStats(),
    fetchCurrentUserFollowing(),
    fetchCurrentUserFriends(),
    fetchCurrentUserFollowers(),
  ]);
  postsRefreshKey.value++;
};

const handleCategoryChange = (categoryId: string | null) => {
  selectedCategoryId.value = categoryId;
};

const handleVisibilityChange = (visibility: 'all' | 'public' | 'private' | 'friends') => {
  selectedVisibility.value = visibility;
};

const handleFocusCreatePost = () => {
  if (createPostFormRef.value && typeof createPostFormRef.value.focusForm === 'function') {
    createPostFormRef.value.focusForm();
    setTimeout(() => {
      createPostFormRef.value.$el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }
};
</script>

<style>
.highlight-post {
  animation: highlight-pulse 3s ease-in-out;
}

@keyframes highlight-pulse {
  0%, 100% {
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
    transform: scale(1.02);
  }
}
</style>

