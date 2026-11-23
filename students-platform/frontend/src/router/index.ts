import { createRouter, createWebHistory } from 'vue-router';
import { useSessionStore } from '../store/session';

// Eager load critical pages
import Home from '../pages/Home.vue';
import Login from '../pages/Auth/Login.vue';

// Lazy load non-critical pages
const Register = () => import('../pages/Auth/Register.vue');
const ForgotPassword = () => import('../pages/Auth/ForgotPassword.vue');
const VerifyOtp = () => import('../pages/Auth/VerifyOtp.vue');
const ResetPassword = () => import('../pages/Auth/ResetPassword.vue');
const Dashboard = () => import('../pages/Dashboard.vue');
const Community = () => import('../pages/Community.vue');
const JoinCommunity = () => import('../pages/JoinCommunity.vue');
const CreateCommunity = () => import('../pages/CreateCommunity.vue');
const Universities = () => import('../pages/Universities.vue');
const Scholarships = () => import('../pages/Scholarships.vue');
const Tracker = () => import('../pages/Tracker.vue');
const PeopleSearch = () => import('../pages/PeopleSearch.vue');
const Videos = () => import('../pages/Videos.vue');
const Feed = () => import('../pages/Feed.vue');
const Explore = () => import('../pages/Explore.vue');
const UserProfile = () => import('../pages/UserProfile.vue');
const Messages = () => import('../pages/Messages.vue');
const EditProfile = () => import('../pages/EditProfile.vue');
const ViewCommunity = () => import('../pages/ViewCommunity.vue');
const EditPost = () => import('../pages/EditPost.vue');
const ReportProblem = () => import('../pages/ReportProblem.vue');
const VerifyEmail = () => import('../pages/VerifyEmail.vue');
const VerifyStudentEmail = () => import('../pages/VerifyStudentEmail.vue');
const NotFound = () => import('../pages/NotFound.vue');
const Events = () => import('../pages/Events.vue');
const Jobs = () => import('../pages/Jobs.vue');
const Housing = () => import('../pages/Housing.vue');
const VisaGuides = () => import('../pages/VisaGuides.vue');
const Skills = () => import('../pages/Skills.vue');

const routes = [
  { path: '/', component: Home },

  { path: '/login', component: Login, meta: { guestOnly: true } },
  { path: '/register', component: Register, meta: { guestOnly: true } },
  { path: '/forgot-password', component: ForgotPassword, meta: { guestOnly: true } },
  { path: '/forgot-password/verify', component: VerifyOtp, meta: { guestOnly: true } },
  { path: '/forgot-password/reset', component: ResetPassword, meta: { guestOnly: true } },
  { path: '/edit-profile', component: EditProfile, name: 'EditProfile', meta: { requiresAuth: true } },
  { path: '/posts/:id/edit', component: EditPost, name: 'EditPost', meta: { requiresAuth: true } },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard/general' },
      { path: 'general', name: 'DashboardGeneral', component: Dashboard },
      { path: 'change-password', name: 'DashboardChangePassword', component: Dashboard },
      { path: 'student-status', name: 'DashboardStudentStatus', component: Dashboard },
      { path: 'saved-universities', name: 'DashboardSavedUniversities', component: Dashboard },
      { path: 'saved-scholarships', name: 'DashboardSavedScholarships', component: Dashboard },
      { path: 'drafts', name: 'DashboardDrafts', component: Dashboard },
      { path: 'notifications', name: 'DashboardNotifications', component: Dashboard },
      { path: 'requests', redirect: '/dashboard/requests/incoming' },
      { path: 'requests/incoming', name: 'DashboardRequestsIncoming', component: Dashboard },
      { path: 'requests/outgoing', name: 'DashboardRequestsOutgoing', component: Dashboard },
    ]
  },
  { path: '/community', component: Community, meta: { requiresAuth: true }},
  { path: '/community/join', component: JoinCommunity, name: 'JoinCommunity', meta: { requiresAuth: true }},
  { path: '/community/create', component: CreateCommunity, name: 'CreateCommunity', meta: { requiresAuth: true }},
  { path: '/community/:slug', component: ViewCommunity, name: 'ViewCommunity' },
  { path: '/community/:slug/posts/:postSlug', component: ViewCommunity, name: 'CommunityPost' },
  { path: '/universities', component: Universities },
  { path: '/scholarships', component: Scholarships },
  { path: '/tracker', component: Tracker, name: 'Tracker', meta: { requiresAuth: true } },
  { path: '/people', component: PeopleSearch, name: 'PeopleSearch', meta: { requiresAuth: true } },
  { path: '/videos', component: Videos, name: 'Videos', meta: { requiresAuth: true } },
  { path: '/events', component: Events, name: 'Events' },
  { path: '/jobs', component: Jobs, name: 'Jobs' },
  { path: '/housing', component: Housing, name: 'Housing' },
  { path: '/visa', component: VisaGuides, name: 'VisaGuides' },
  { path: '/skills', component: Skills, name: 'Skills' },
  { path: '/support', component: ReportProblem, name: 'ReportProblem' },
  { path: '/verify-email/:token', component: VerifyEmail, name: 'VerifyEmail' },
  { path: '/verify-student-email/:token', component: VerifyStudentEmail, name: 'VerifyStudentEmail' },
  { path: '/feed', component: Feed, name: 'Feed', meta: { requiresAuth: true } },
  { path: '/explore', component: Explore, name: 'Explore', meta: { requiresAuth: true } },
  { path: '/profile/:username', component: UserProfile, name: 'UserProfile', meta: { requiresAuth: true } },
  { path: '/profile/:username/posts/:slug', component: UserProfile, name: 'ProfilePost', meta: { requiresAuth: true } },
  {
    path: '/messages/:id?',
    component: Messages,
    name: 'Messages',
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    name: 'NotFound'
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes: routes as any,
});

router.beforeEach(async (to, _from, next) => {
  document.body.style.overflow = '';

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
