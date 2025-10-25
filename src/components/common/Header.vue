<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/80"
  >
    <div class="container mx-auto flex h-16 items-center justify-between px-4">
      <RouterLink
        to="/"
        class="flex items-center gap-2 font-bold text-foreground transition-colors hover:text-primary"
      >
        <AppLogo class="size-8" />
        <span class="text-lg">Фонд Чилгази</span>
      </RouterLink>

      <nav class="hidden items-center gap-6 md:flex">
        <RouterLink
          v-for="link in mainRoutes"
          :key="link.name"
          :to="link.path"
          :class="[
            'text-sm font-medium transition-colors hover:text-primary',
            route.path === link.path ? 'text-primary' : 'text-muted-foreground',
          ]"
        >
          {{ link.meta?.title }}
        </RouterLink>
      </nav>

      <div class="hidden md:flex items-center gap-4">
        <Button variant="outline" class="w-fit border" @click="toggleTheme">
          <span
            class="iconify size-6"
            :class="[
              mode === 'light' ? 'f7--sun-min' : mode === 'dark' ? 'f7--moon' : 'f7--gear-alt',
            ]"
          ></span>
        </Button>
        <Button as-child size="sm">
          <RouterLink to="/donate">Поддержать</RouterLink>
        </Button>
      </div>
      <button class="md:hidden" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Toggle menu">
        <X v-if="mobileMenuOpen" class="h-6 w-6 text-foreground" />
        <Menu v-else class="h-6 w-6 text-foreground" />
      </button>
    </div>

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
        <div class="flex flex-col gap-2 items-center">
          <Button variant="outline" class="w-fit" @click="toggleTheme">
            <span
              class="iconify size-6"
              :class="[
                mode === 'light' ? 'f7--sun-min' : mode === 'dark' ? 'f7--moon' : 'f7--gear-alt',
              ]"
            ></span>
          </Button>
          <Button as-child class="w-full">
            <RouterLink to="/donate" @click="mobileMenuOpen = false"> Поддержать </RouterLink>
          </Button>
        </div>
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
import { useAppSettingsStore } from '@/stores/settings'

const { toggleTheme } = useAppSettingsStore()
const { mode } = storeToRefs(useAppSettingsStore())

import AppLogo from '../app/AppLogo.vue'
import { storeToRefs } from 'pinia'

const route = useRoute()
const mobileMenuOpen = ref(false)

watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  }
)
</script>
