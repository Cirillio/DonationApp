<script lang="ts" setup>
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-dvh flex flex-col">
    <Header />
    <main class="flex-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
