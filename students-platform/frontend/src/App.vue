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
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
</script>

<style>
</style>
