<script lang="ts" setup>
import { Header } from '@/components/header'
import Footer from '@/components/common/Footer.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-dvh flex flex-col">
    <Header />
    <main class="flex">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
