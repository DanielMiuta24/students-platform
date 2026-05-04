import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Auth/Login.vue';
import Register from '../pages/Auth/Register.vue';
import Dashboard from '../pages/Dashboard.vue';
import Community from '../pages/Community.vue';
import Universities from '../pages/Universities.vue';
import Scholarships from '../pages/Scholarships.vue';
import ThreadList from '../pages/ThreadList.vue';
import UserProfile from '../pages/UserProfile.vue';
import Messages from '../pages/Messages.vue';
import EditProfile from '../pages/EditProfile.vue';
import ViewPost from '../pages/ViewPost.vue';
import CommunityFeed from '../pages/CommunityFeed.vue';
import EditPost from '../pages/EditPost.vue';
import { useSessionStore } from '../store/session';

const routes = [
  { path: '/', component: Home },

  { path: '/login', component: Login, meta: { guestOnly: true } },
  { path: '/register', component: Register, meta: { guestOnly: true } },
  { path: '/community/:id', component: CommunityFeed, name: 'CommunityFeed' },
  { path: '/edit-profile', component: EditProfile, name: 'EditProfile', meta: { requiresAuth: true } },
  { path: '/community/:id', component: ThreadList, name: 'CommunityThreads',meta: { requiresAuth: true } },
  { path: '/posts/:id', component: ViewPost, name: 'ViewPost' },
  { path: '/posts/:id/edit', component: EditPost, name: 'EditPost', meta: { requiresAuth: true } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/community', component: Community, meta: { requiresAuth: true }},
  { path: '/universities', component: Universities },
  { path: '/scholarships', component: Scholarships },
  { path: '/threads', component: ThreadList, name: 'Threads',meta: { requiresAuth: true } },
  { path: '/profile/:id', component: UserProfile, name: 'UserProfile', meta: { requiresAuth: true } },
  { 
    path: '/messages/:id?', 
    component: Messages, 
    name: 'Messages', 
    meta: { requiresAuth: true } 
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const session = useSessionStore();

  if (!session.isAuthenticated) {
    try {
      await session.restoreSession();
    } catch {}
  }

  if (to.meta.requiresAuth && !session.isAuthenticated) {
    return next('/login');
  }

  if (to.meta.guestOnly && session.isAuthenticated) {
    return next('/dashboard');
  }

  return next();
});
