<template>
  <header
    class="relative w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/80"
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
        <Button as-child>
          <RouterLink to="/donate">Поддержать</RouterLink>
        </Button>
        <Button as-child variant="outline" size="icon">
          <RouterLink to="/settings">
            <Icon class="f7--gear-alt size-6" />
          </RouterLink>
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="md:hidden rounded-none"
        @click="mobileMenuOpen = !mobileMenuOpen"
        aria-label="Toggle menu"
      >
        <Icon v-if="mobileMenuOpen" class="f7--multiply size-6" />
        <Icon v-else class="f7--ellipsis-vertical size-6" />
      </Button>
    </div>

    <div
      v-if="mobileMenuOpen"
      class="border-t border-border bg-background/25 backdrop-blur-sm py-4 space-y-4 md:hidden"
    >
      <nav class="container mx-auto items-center w-full flex flex-col gap-4 px-4">
        <RouterLink
          v-for="link in mainRoutes"
          :key="link.name"
          :to="link.path"
          @click="mobileMenuOpen = false"
          :class="[
            'text-lg font-medium flex items-center justify-center gap-2 transition-colors hover:text-primary bg-card w-full text-center py-2 rounded-md active:text-primary active:bg-primary/20',
            route.path === link.path ? 'text-primary bg-primary/10' : 'text-muted-foreground',
          ]"
        >
          <Icon :class="[link.meta?.icon]" class="size-5" />
          {{ link.meta?.title }}
        </RouterLink>
      </nav>
      <Separator />
      <div class="flex flex-col gap-4 items-center w-full px-4">
        <Button as-child size="lg" class="w-full">
          <RouterLink to="/donate" @click="mobileMenuOpen = false"> Поддержать </RouterLink>
        </Button>
        <Button as-child variant="outline" class="w-full gap-1 border" size="lg">
          <RouterLink to="/settings" class="w-full">
            <Icon class="f7--gear-alt size-5" />
            <span>Настройки</span>
          </RouterLink>
        </Button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Icon } from '../ui/icon'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { mainRoutes } from '@/router'
import AppLogo from '../app/AppLogo.vue'

const route = useRoute()
const mobileMenuOpen = ref(false)

watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  }
)
</script>
