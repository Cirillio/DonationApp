<script setup lang="ts">
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from './components/footer/AppFooter.vue'
import NavBar from './components/controls/NavBar.vue'
</script>

<template>
  <div
    class="h-[100dvh] w-screen form-bg grid grid-rows-[1fr_auto] bg-background text-card-foreground"
  >
    <AppHeader class="fixed w-full top-0 z-50" />
    <main
      class="overflow-y-scroll w-full h-full backdrop-blur-xs bg-background/50 dark:bg-background/90"
    >
      <div class="flex flex-col h-full">
        <router-view></router-view>

        <AppFooter />
      </div>
    </main>
    <NavBar class="md:hidden" />
  </div>
</template>
