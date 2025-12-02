<template>
  <nav class="hidden items-center gap-6 md:flex">
    <RouterLink
      v-for="link in mainRoutes"
      :key="link.name"
      :to="link.path"
      :class="[
        'text-base font-medium transition-colors hover:text-foreground/75',
        route.path === link.path ? 'text-foreground' : 'text-muted-foreground',
      ]"
    >
      {{ link.meta?.title }}
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { mainRoutes } from '@/router'

const route = useRoute()
</script>
