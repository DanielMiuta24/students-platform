<template>
  <div id="app">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md" role="banner">
      <Navbar />
    </header>
    <main id="main-content" class="pt-16" role="main" tabindex="-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { socketService } from './services/socket';
import { useSessionStore } from './store/session';
import { useNotificationStore } from './stores/notification';

const sessionStore = useSessionStore();
const notificationStore = useNotificationStore();

// Connect socket when app mounts and user is authenticated
onMounted(() => {
  if (sessionStore.isAuthenticated) {
    socketService.connect();
    notificationStore.setupRealtimeListeners();
    notificationStore.fetchUnreadCount();
  }
});

// Watch for auth state changes
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

// Disconnect socket when app unmounts
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
</style>
