<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container mx-auto flex h-16 items-center justify-between px-4">
      <!-- Logo -->
      <RouterLink
        to="/"
        class="flex items-center gap-2 font-bold text-foreground transition-colors hover:text-primary"
      >
        <AppLogo class="size-8" />
        <span class="text-lg">Фонд Чилгази</span>
      </RouterLink>

      <!-- Desktop Navigation -->
      <nav class="hidden items-center gap-6 md:flex">
        <RouterLink
          v-for="link in mainRoutes"
          :key="link.meta?.title as string"
          :to="link.path"
          :class="[
            'text-sm font-medium transition-colors hover:text-primary',
            route.path === link.path ? 'text-primary' : 'text-muted-foreground',
          ]"
        >
          {{ link.meta?.title }}
        </RouterLink>
      </nav>

      <!-- CTA Button Desktop -->
      <div class="hidden md:block">
        <Button as-child size="sm">
          <RouterLink to="/donate">Поддержать</RouterLink>
        </Button>
      </div>

      <!-- Mobile Menu Button -->
      <button class="md:hidden" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Toggle menu">
        <X v-if="mobileMenuOpen" class="h-6 w-6 text-foreground" />
        <Menu v-else class="h-6 w-6 text-foreground" />
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="mobileMenuOpen" class="border-t border-border bg-background md:hidden">
      <nav class="container mx-auto flex flex-col gap-4 px-4 py-4">
        <RouterLink
          v-for="link in mainRoutes"
          :key="link.name"
          :to="link.path"
          @click="mobileMenuOpen = false"
          :class="[
            'text-sm font-medium transition-colors hover:text-primary',
            route.path === link.path ? 'text-primary' : 'text-muted-foreground',
          ]"
        >
          {{ link.meta?.title }}
        </RouterLink>
        <Button as-child class="w-full">
          <RouterLink to="/donate" @click="mobileMenuOpen = false"> Поддержать </RouterLink>
        </Button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { mainRoutes } from '@/router'

import AppLogo from '../app/AppLogo.vue'

const route = useRoute()
const mobileMenuOpen = ref(false)

// Закрываем мобильное меню при смене роута
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  }
)
</script>
