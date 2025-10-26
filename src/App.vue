<script setup>
import LandingPage from "./views/LandingPage.vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const handleNavigation = (page) => router.push(`/${page}`);
</script>

<template>
  <router-view />
</template>

<style scoped></style>
