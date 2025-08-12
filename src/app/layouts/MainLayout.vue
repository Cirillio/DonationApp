<script lang="ts" setup>
import MainHeader from '../ui/MainHeader.vue'
import MainFooter from '../ui/MainFooter.vue'
</script>

<template>
  <div
    class="h-[100dvh] w-screen form-bg grid grid-rows-[1fr_auto] bg-background text-card-foreground"
  >
    <MainHeader class="fixed w-full top-0 z-50" />
    <main
      class="overflow-y-scroll w-full h-full backdrop-blur-xs bg-background/50 dark:bg-background/90"
    >
      <div class="grid grid-rows-[1fr_auto] items-center min-h-full">
        <router-view></router-view>

        <MainFooter />
      </div>
    </main>
  </div>
</template>
