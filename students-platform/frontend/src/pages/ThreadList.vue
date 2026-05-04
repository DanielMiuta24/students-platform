<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">

    <div class="max-w-6xl mx-auto px-4 py-12 text-center">
  <p class="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full mb-5">
    Student Feed
  </p>

  <h1 class="text-5xl font-bold text-blue-900 mb-4">
    See what students are talking about
  </h1>

  <p class="text-xl text-gray-700 max-w-2xl mx-auto">
    Discover questions, experiences, tips, and updates from students around the world.
  </p>
</div>

    <!-- Search + Category Filter -->
    <div class="max-w-6xl mx-auto px-4 mb-8">
      <div class="bg-white rounded-xl shadow-lg p-6">
        <input
          v-model="searchQuery"
          @input="filterThreads"
          placeholder="Search threads (e.g., scholarships, universities)"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <div class="flex flex-wrap gap-3">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectCategory(category)"
            :class="[
              'px-4 py-2 rounded-full font-semibold transition',
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </div>

    <!-- Create Post -->
    <div class="max-w-6xl mx-auto px-4 mb-10">
      <div v-if="redirecting" class="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded">
        <p class="font-semibold">Redirecting to your profile...</p>
      </div>
      <CreatePostForm @success="handlePostSuccess" @error="handlePostError" />
    </div>

    <!-- Threads -->
    <div class="max-w-6xl mx-auto px-4 pb-16">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div
          v-if="filteredThreads.length === 0"
          class="text-center text-gray-600 py-10"
        >
          No threads found.
        </div>

        <ul v-else class="space-y-6">
          <li
            v-for="thread in filteredThreads"
            :key="thread.id"
            class="p-6 border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition duration-200 bg-white"
          >
            <div class="flex items-center mb-4">
              <img
                :src="thread.user.profilePicture"
                alt="Profile Picture"
                class="w-12 h-12 rounded-full mr-4 cursor-pointer object-cover"
                @click="goToProfile(thread.user.id)"
              />

              <div>
                <h3
                  class="text-lg font-bold text-blue-900 cursor-pointer"
                  @click="goToProfile(thread.user.id)"
                >
                  {{ thread.user.name }}
                </h3>
                <p class="text-sm text-gray-500">{{ thread.user.title }}</p>
              </div>
            </div>

            <div class="mb-2">
              <span class="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                {{ thread.category || 'General' }}
              </span>
            </div>

            <h4 class="text-2xl font-bold text-blue-800 mb-2">
              {{ thread.title }}
            </h4>

            <p class="text-gray-600 mb-4">
              {{ thread.description }}
            </p>

            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in thread.tags"
                :key="tag"
                class="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full"
              >
                #{{ tag }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <div class="flex space-x-4">
                <button
                  @click="likeThread(thread)"
                  class="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-lg transition duration-200"
                >
                  Like ({{ thread.likes }})
                </button>

                <button
                  @click="toggleComments(thread)"
                  class="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-lg transition duration-200"
                >
                  Comment ({{ thread.comments.length }})
                </button>
              </div>

              <button
                @click="startChat(thread.user)"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition duration-200"
              >
                Chat
              </button>
            </div>

            <div v-if="thread.showComments" class="mt-5">
              <ul class="space-y-2">
                <li
                  v-for="comment in thread.comments"
                  :key="comment.id"
                  class="bg-gray-50 border border-gray-100 rounded-lg p-4"
                >
                  <p class="text-gray-700">{{ comment.text }}</p>
                </li>
              </ul>

              <div class="mt-4">
                <input
                  v-model="newComment"
                  placeholder="Add a comment..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  @click="addComment(thread)"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg mt-2"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CreatePostForm from '../components/CreatePostForm.vue';
import { useSessionStore } from '../store/session';

interface Thread {
  id: number;
  communityId: number;
  title: string;
  description: string;
  category?: string;
  user: {
    id: number;
    name: string;
    profilePicture: string;
    title: string;
  };
  tags: string[];
  likes: number;
  comments: { id: number; text: string }[];
  showComments: boolean;
}

export default defineComponent({
  name: 'ThreadList',

  components: {
    CreatePostForm,
  },

  data() {
    return {
      threads: [
        {
          id: 1,
          communityId: 2,
          title: 'How to apply for scholarships?',
          description: 'Let’s discuss the best ways to apply for scholarships.',
          category: 'Scholarships',
          user: {
            id: 101,
            name: 'John Doe',
            profilePicture: 'https://via.placeholder.com/150',
            title: 'Student at XYZ University',
          },
          tags: ['Education', 'Funding'],
          likes: 5,
          comments: [{ id: 1, text: 'Great post!' }],
          showComments: false,
        },
        {
          id: 2,
          communityId: 2,
          title: 'Best universities for computer science',
          description: 'Share your thoughts on the top universities for CS.',
          category: 'Universities',
          user: {
            id: 102,
            name: 'Jane Smith',
            profilePicture: 'https://via.placeholder.com/150',
            title: 'Software Engineer',
          },
          tags: ['Computer Science', 'Rankings'],
          likes: 3,
          comments: [],
          showComments: false,
        },
        {
          id: 3,
          communityId: 1,
          title: 'Tips for studying abroad',
          description: 'What are the best tips for students planning to study abroad?',
          category: 'Study Abroad',
          user: {
            id: 103,
            name: 'Alice Johnson',
            profilePicture: 'https://via.placeholder.com/150',
            title: 'International Student',
          },
          tags: ['Tips', 'Preparation'],
          likes: 8,
          comments: [{ id: 2, text: 'Very helpful!' }],
          showComments: false,
        },
      ] as Thread[],

      filteredThreads: [] as Thread[],

      categories: [
        'All',
        'Scholarships',
        'Universities',
        'Study Abroad',
        'Visa',
        'Student Life',
        'Applications',
      ],

      selectedCategory: 'All',
      searchQuery: '',

      newComment: '',
      redirecting: false,
    };
  },

  methods: {
    handlePostSuccess(post: any) {
      console.log('[ThreadList] Post created successfully:', post);

      const sessionStore = useSessionStore();
      const userId = sessionStore.user?.id;

      if (userId) {
        this.redirecting = true;
        setTimeout(() => {
          this.$router.push({
            name: 'UserProfile',
            params: { id: userId }
          });
        }, 2000);
      }
    },

    handlePostError(error: any) {
      console.error('[ThreadList] Post creation failed:', error);
    },

    filterThreads() {
      const query = this.searchQuery.toLowerCase();

      this.filteredThreads = this.threads.filter((thread) => {
        const matchesSearch =
          thread.title.toLowerCase().includes(query) ||
          thread.description.toLowerCase().includes(query) ||
          (thread.category || '').toLowerCase().includes(query) ||
          thread.tags.some((tag) => tag.toLowerCase().includes(query));

        const matchesCategory =
          this.selectedCategory === 'All' ||
          thread.category === this.selectedCategory;

        return matchesSearch && matchesCategory;
      });
    },

    selectCategory(category: string) {
      this.selectedCategory = category;
      this.filterThreads();
    },

    likeThread(thread: Thread) {
      thread.likes++;
    },

    toggleComments(thread: Thread) {
      thread.showComments = !thread.showComments;
    },

    addComment(thread: Thread) {
      if (this.newComment.trim() === '') return;

      thread.comments.push({
        id: Date.now(),
        text: this.newComment,
      });

      this.newComment = '';
    },

    goToProfile(userId: number) {
      this.$router.push({
        name: 'UserProfile',
        params: { id: userId },
      });
    },

    startChat(user: { id: number; name: string }) {
      this.$router.push(`/messages/${user.id}`);
    },
  },

  mounted() {
  const communityId = Number(this.$route.params.id);

  if (communityId) {
    this.filteredThreads = this.threads.filter(
      (thread) => thread.communityId === communityId
    );
  } else {
    this.filterThreads();
  }
}
});
</script>