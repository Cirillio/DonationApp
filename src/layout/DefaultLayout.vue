<script lang="ts" setup>
import Header from '@/components/common/Header.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <Header />
  <main class="overflow-y-scroll w-full h-dvh flex">
    <RouterView />
  </main>
</template>
