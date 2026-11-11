<template>
  <div class="explore-page">

    <!-- Hero -->
    <section class="explore-hero">
      <div class="hero-inner">
        <p class="hero-badge">Discover ISC</p>
        <h1>Explore what's happening</h1>
        <p class="hero-sub">Trending posts, active communities, and students to connect with.</p>
      </div>
    </section>

    <div class="explore-body">

      <!-- Left: trending posts -->
      <div class="main-col">
        <section class="card-section">
          <div class="section-head">
            <span class="section-icon">🔥</span>
            <h2>Trending Posts</h2>
          </div>

          <div v-if="postsLoading" class="loading-row">
            <div class="spinner"></div>
            <span>Loading posts...</span>
          </div>

          <div v-else-if="trendingPosts.length === 0" class="empty-msg">
            No posts yet. Be the first to share something!
          </div>

          <div v-else class="post-list">
            <div
              v-for="post in trendingPosts"
              :key="post.id"
              class="post-item"
              @click="openPost(post)"
            >
              <div class="post-author-row">
                <img
                  :src="post.author?.avatar || defaultAvatar"
                  :alt="post.author?.name"
                  class="post-avatar"
                />
                <div class="post-author-info">
                  <span class="author-name">{{ post.author?.name }}</span>
                  <span class="author-username">@{{ post.author?.username }}</span>
                </div>
                <span class="post-date">{{ formatDate(post.createdAt) }}</span>
              </div>

              <h3 class="post-title">{{ post.title }}</h3>

              <div class="post-meta-row">
                <span class="meta-chip">
                  <svg viewBox="0 0 20 20" fill="currentColor" class="meta-icon"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                  {{ post.likeCount || 0 }}
                </span>
                <span class="meta-chip">
                  <svg viewBox="0 0 20 20" fill="currentColor" class="meta-icon"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" /></svg>
                  {{ post.commentCount || 0 }}
                </span>
                <span class="meta-chip views">
                  <svg viewBox="0 0 20 20" fill="currentColor" class="meta-icon"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>
                  {{ post.viewCount || 0 }}
                </span>
                <span v-if="post.category?.name" class="category-chip">{{ post.category.name }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Right sidebar -->
      <aside class="side-col">

        <!-- Active Communities -->
        <section class="card-section">
          <div class="section-head">
            <span class="section-icon">👥</span>
            <h2>Active Communities</h2>
          </div>

          <div v-if="communitiesLoading" class="loading-row">
            <div class="spinner"></div>
          </div>

          <div v-else-if="featuredCommunities.length === 0" class="empty-msg">
            No public communities yet.
          </div>

          <div v-else class="community-list">
            <router-link
              v-for="c in featuredCommunities"
              :key="c.id"
              :to="`/community/${c.slug}`"
              class="community-item"
            >
              <div
                class="community-cover"
                :style="c.coverImage ? `background-image: url(${c.coverImage}); background-size: cover;` : ''"
              >
                <span v-if="!c.coverImage" class="community-initial">{{ c.name[0] }}</span>
              </div>
              <div class="community-info">
                <span class="community-name">{{ c.name }}</span>
                <span class="community-members">{{ c.memberCount || 0 }} member{{ (c.memberCount || 0) === 1 ? '' : 's' }}</span>
              </div>
              <svg viewBox="0 0 20 20" fill="currentColor" class="community-arrow"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
            </router-link>
          </div>

          <router-link to="/community/join" class="see-all-link">See all communities</router-link>
        </section>

        <!-- People to Follow -->
        <section class="card-section">
          <div class="section-head">
            <span class="section-icon">✨</span>
            <h2>People to Follow</h2>
          </div>

          <div v-if="peopleLoading" class="loading-row">
            <div class="spinner"></div>
          </div>

          <div v-else-if="suggestedPeople.length === 0" class="empty-msg">
            No suggestions yet.
          </div>

          <div v-else class="people-list">
            <div v-for="person in suggestedPeople" :key="person.id" class="person-item">
              <router-link :to="`/profile/${person.username}`" class="person-link">
                <div v-if="person.avatar" class="person-avatar-wrap">
                  <img :src="person.avatar" :alt="person.name" class="person-avatar" />
                </div>
                <div v-else class="person-avatar-initial">{{ person.name[0]?.toUpperCase() }}</div>
                <div class="person-info">
                  <span class="person-name">{{ person.name }}</span>
                  <span class="person-username">@{{ person.username }}</span>
                </div>
              </router-link>
              <button
                v-if="person.id !== session.user?.id"
                @click="toggleFollow(person)"
                :class="['follow-btn', followingSet.has(person.id) ? 'following' : '']"
              >
                {{ followingSet.has(person.id) ? 'Following' : 'Follow' }}
              </button>
            </div>
          </div>
        </section>

      </aside>
    </div>

    <!-- Post Modal -->
    <PostModal
      v-if="selectedPost"
      :post="selectedPost"
      @close="selectedPost = null"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../services/api';
import { useSessionStore } from '../store/session';
import PostModal from '../components/PostModal.vue';

const session = useSessionStore();

const trendingPosts = ref<any[]>([]);
const featuredCommunities = ref<any[]>([]);
const suggestedPeople = ref<any[]>([]);
const postsLoading = ref(true);
const communitiesLoading = ref(true);
const peopleLoading = ref(true);
const selectedPost = ref<any>(null);
const followingSet = ref<Set<string>>(new Set());

const defaultAvatar = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23dbeafe'/%3E%3Cpath d='M20 22a6 6 0 100-12 6 6 0 000 12zm-9 8a9 9 0 0118 0H11z' fill='%232563eb'/%3E%3C/svg%3E`;

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const openPost = (post: any) => {
  selectedPost.value = post;
};

const loadTrendingPosts = async () => {
  try {
    const res = await api.get('posts/feed/scored', { params: { limit: 10 } });
    const posts = res.data?.posts || [];
    trendingPosts.value = [...posts]
      .sort((a: any, b: any) =>
        ((b.likeCount || 0) + (b.commentCount || 0) * 2 + (b.viewCount || 0) * 0.3) -
        ((a.likeCount || 0) + (a.commentCount || 0) * 2 + (a.viewCount || 0) * 0.3)
      )
      .slice(0, 8);
  } catch {
    trendingPosts.value = [];
  } finally {
    postsLoading.value = false;
  }
};

const loadCommunities = async () => {
  try {
    const res = await api.get('communities', { params: { limit: 6 } });
    const list = res.data?.communities || res.data || [];
    featuredCommunities.value = (Array.isArray(list) ? list : [])
      .filter((c: any) => c.visibility !== 'private')
      .sort((a: any, b: any) => (b.memberCount || 0) - (a.memberCount || 0))
      .slice(0, 6);
  } catch {
    featuredCommunities.value = [];
  } finally {
    communitiesLoading.value = false;
  }
};

const loadSuggestedPeople = async () => {
  try {
    const res = await api.get('users/search', { params: { q: 'student' } });
    const all: any[] = Array.isArray(res.data) ? res.data : [];
    const myId = session.user?.id;
    suggestedPeople.value = all.filter((u) => u.id !== myId).slice(0, 6);
  } catch {
    suggestedPeople.value = [];
  } finally {
    peopleLoading.value = false;
  }
};

const toggleFollow = async (person: any) => {
  const id = person.id;
  const wasFollowing = followingSet.value.has(id);
  // optimistic update
  const next = new Set(followingSet.value);
  if (wasFollowing) next.delete(id); else next.add(id);
  followingSet.value = next;
  try {
    if (wasFollowing) {
      await api.delete(`follow/${id}`);
    } else {
      await api.post(`follow/${id}`);
    }
  } catch {
    // revert
    const revert = new Set(followingSet.value);
    if (wasFollowing) revert.add(id); else revert.delete(id);
    followingSet.value = revert;
  }
};

onMounted(() => {
  loadTrendingPosts();
  loadCommunities();
  loadSuggestedPeople();
});
</script>

<style scoped>
.explore-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 30%, #f8fbff 100%);
  padding-bottom: 80px;
}

.explore-hero {
  background: linear-gradient(135deg, #0f2a5f 0%, #1e40af 60%, #2563eb 100%);
  padding: 56px 24px 48px;
  text-align: center;
  color: white;
}

.hero-inner {
  max-width: 640px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 6px 18px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
}

.explore-hero h1 {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 14px;
}

.hero-sub {
  font-size: 17px;
  opacity: 0.82;
  line-height: 1.6;
}

.explore-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 0;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;
}

@media (max-width: 900px) {
  .explore-body {
    grid-template-columns: 1fr;
  }
  .explore-hero h1 { font-size: 28px; }
}

.card-section {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 8px 28px rgba(15, 42, 95, 0.09);
  border: 1px solid #e5efff;
  margin-bottom: 28px;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
}
.section-icon { font-size: 22px; }
.section-head h2 {
  font-size: 20px;
  font-weight: 800;
  color: #0f2a5f;
  margin: 0;
}

.loading-row {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #64748b;
  font-size: 15px;
  padding: 16px 0;
}

.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid #dbeafe;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-msg {
  color: #94a3b8;
  font-size: 15px;
  padding: 12px 0;
}

/* Posts */
.post-list { display: flex; flex-direction: column; gap: 0; }

.post-item {
  padding: 18px 10px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  border-radius: 8px;
  margin: 0 -10px;
  transition: background 0.15s;
}
.post-item:last-child { border-bottom: none; }
.post-item:hover { background: #f8fbff; }

.post-author-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.post-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #dbeafe;
  flex-shrink: 0;
}

.post-author-info { flex: 1; min-width: 0; }
.author-name { font-weight: 700; color: #0f2a5f; font-size: 14px; display: block; }
.author-username { font-size: 12px; color: #94a3b8; }
.post-date { font-size: 12px; color: #94a3b8; flex-shrink: 0; }

.post-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  line-height: 1.4;
}

.post-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #64748b;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 3px 10px;
}
.meta-chip.views { color: #94a3b8; }
.meta-icon { width: 13px; height: 13px; }

.category-chip {
  font-size: 12px;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  padding: 3px 10px;
  margin-left: auto;
}

/* Communities */
.community-list { display: flex; flex-direction: column; gap: 4px; }

.community-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.15s;
}
.community-item:hover { background: #f0f7ff; }

.community-cover {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.community-initial { font-size: 18px; font-weight: 800; color: #2563eb; }
.community-info { flex: 1; min-width: 0; }
.community-name {
  display: block;
  font-weight: 700;
  color: #0f2a5f;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.community-members { font-size: 12px; color: #94a3b8; }
.community-arrow { width: 16px; height: 16px; color: #cbd5e1; flex-shrink: 0; }

.see-all-link {
  display: block;
  text-align: center;
  margin-top: 16px;
  color: #2563eb;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
}
.see-all-link:hover { text-decoration: underline; }

/* People */
.people-list { display: flex; flex-direction: column; gap: 4px; }

.person-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.person-link {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  text-decoration: none;
}

.person-avatar-wrap { flex-shrink: 0; }
.person-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #dbeafe;
}

.person-avatar-initial {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #2563eb;
  font-weight: 800;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.person-info { flex: 1; min-width: 0; }
.person-name {
  display: block;
  font-weight: 700;
  color: #0f2a5f;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.person-username { font-size: 12px; color: #94a3b8; }

.follow-btn {
  font-size: 13px;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 999px;
  border: 2px solid #2563eb;
  background: #2563eb;
  color: white;
  cursor: pointer;
  transition: 0.2s;
  flex-shrink: 0;
}
.follow-btn.following {
  background: white;
  color: #2563eb;
}
.follow-btn:hover { opacity: 0.85; }
</style>
