import { defineStore } from 'pinia';
import type { SafePost, CursorPostsResult } from '../types/post';
import { getPostFeed, getPostsByCategory, updatePost, deletePost, getScoredFeed } from '../api/post';
import { useSessionStore } from './session';

type UserStatus = 'Student' | 'StudySeeker' | 'Admin' | null;

interface PostFeedState {
  posts: SafePost[];
  nextCursor: string | null;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  limit: number;
  selectedCategory: string | null;
  selectedStatus: UserStatus;
}

export const usePostFeedStore = defineStore('postFeed', {
  state: (): PostFeedState => ({
    posts: [],
    nextCursor: null,
    hasMore: false,
    isLoading: false,
    isLoadingMore: false,
    error: null,
    limit: 10,
    selectedCategory: null,
    selectedStatus: null,
  }),

  getters: {
    isEmpty: (state) => state.posts.length === 0 && !state.isLoading,
    filteredPosts: (state) => {
      if (!state.selectedStatus) {
        return state.posts;
      }

      return state.posts.filter((post) => {
        if (typeof post.author === 'object' && post.author !== null) {
          return post.author.type === state.selectedStatus;
        }
        return false;
      });
    },
  },

  actions: {
    clearError() {
      this.error = null;
    },

    setCategory(categoryId: string | null) {
      this.selectedCategory = categoryId;
    },

    setStatus(status: UserStatus) {
      this.selectedStatus = status;
    },

    async loadInitialPosts(categoryId?: string | null) {
      this.isLoading = true;
      this.error = null;
      this.posts = [];
      this.nextCursor = null;
      this.hasMore = false;

      if (categoryId !== undefined) {
        this.selectedCategory = categoryId;
      }

      try {
        const sessionStore = useSessionStore();
        const userId = sessionStore.user?.id;

        if (this.selectedCategory) {
          const result = await getPostsByCategory(this.selectedCategory, undefined, this.limit);
          this.posts = result.posts;
          this.nextCursor = result.nextCursor;
          this.hasMore = result.hasMore;
        } else {
          const result = await getScoredFeed(userId, this.limit);
          this.posts = result.posts;
          this.nextCursor = result.nextCursor;
          this.hasMore = result.hasMore;
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to load posts';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async loadMorePosts() {
      if (!this.hasMore || this.isLoadingMore || this.isLoading) {
        return;
      }

      this.isLoadingMore = true;
      this.error = null;

      try {
        const sessionStore = useSessionStore();
        const userId = sessionStore.user?.id;
        let result: CursorPostsResult;

        if (this.selectedCategory) {
          result = await getPostsByCategory(this.selectedCategory, this.nextCursor || undefined, this.limit);
        } else {
          result = await getScoredFeed(userId, this.limit, undefined, this.nextCursor || undefined);
        }

        this.posts.push(...result.posts);
        this.nextCursor = result.nextCursor;
        this.hasMore = result.hasMore;
      } catch (error: any) {
        this.error = error.message || 'Failed to load more posts';
        throw error;
      } finally {
        this.isLoadingMore = false;
      }
    },

    async refreshPosts() {
      await this.loadInitialPosts();
    },

    async filterByCategory(categoryId: string | null) {
      await this.loadInitialPosts(categoryId);
    },

    async updatePostInStore(postId: string, formData: FormData) {
      try {
        const updatedPost = await updatePost(postId, formData);

        const index = this.posts.findIndex((p) => p.id === postId);
        if (index !== -1) {
          this.posts[index] = updatedPost;
        }

        return updatedPost;
      } catch (error: any) {
        throw error;
      }
    },

    async deletePostFromStore(postId: string) {
      try {
        await deletePost(postId);

        const index = this.posts.findIndex((p) => p.id === postId);
        if (index !== -1) {
          this.posts.splice(index, 1);
        }
      } catch (error: any) {
        throw error;
      }
    },

    updateLikeCount(postId: string, increment: boolean) {
      const post = this.posts.find((p) => p.id === postId);
      if (post) {
        post.likeCount += increment ? 1 : -1;
      }
    },

    updateCommentCount(postId: string, count: number) {
      const post = this.posts.find((p) => p.id === postId);
      if (post) {
        post.commentCount = count;
      }
    },
  },
});
