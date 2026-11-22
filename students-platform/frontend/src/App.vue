<template>
  <div id="app">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md" role="banner">
      <Navbar />
    </header>
    <main id="main-content" class="pt-16" role="main" tabindex="-1">
      <router-view />
    </main>
    <Footer />
    <OnboardingModal :show="showOnboarding" @done="showOnboarding = false" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, ref, computed } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import OnboardingModal from './components/OnboardingModal.vue';
import { socketService } from './services/socket';
import { useSessionStore } from './store/session';
import { useNotificationStore } from './stores/notification';

const sessionStore = useSessionStore();
const notificationStore = useNotificationStore();

const showOnboarding = computed(() =>
  sessionStore.isAuthenticated &&
  sessionStore.user &&
  sessionStore.user.hasOnboarded === false
);

onMounted(() => {
  if (sessionStore.isAuthenticated) {
    socketService.connect();
    notificationStore.setupRealtimeListeners();
    notificationStore.fetchUnreadCount();
  }
});

watch(() => sessionStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    socketService.connect();
    notificationStore.setupRealtimeListeners();
    notificationStore.fetchUnreadCount();
  } else {
    socketService.disconnect();
    notificationStore.clearRealtimeListeners();
  }
});

onUnmounted(() => {
  socketService.disconnect();
  notificationStore.clearRealtimeListeners();
});
</script>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile responsive padding for main content */
@media (max-width: 768px) {
  main#main-content {
    padding-top: 5.5rem !important; /* 88px for mobile navbar */
  }
}

@media (max-width: 480px) {
  main#main-content {
    padding-top: 6rem !important; /* 96px for very small screens */
  }
}
</style>
