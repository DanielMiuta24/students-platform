<template>
  <div id="app">
    <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <Navbar />
    </div>
    <main class="pt-16">
      <router-view />
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

const sessionStore = useSessionStore();

// Connect socket when app mounts and user is authenticated
onMounted(() => {
  if (sessionStore.isAuthenticated) {
    socketService.connect();
  }
});

// Watch for auth state changes
watch(() => sessionStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    socketService.connect();
  } else {
    socketService.disconnect();
  }
});

// Disconnect socket when app unmounts
onUnmounted(() => {
  socketService.disconnect();
});
</script>

<style>
</style>
