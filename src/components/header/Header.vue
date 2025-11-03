<template>
  <header
    class="relative z-10 w-full border-b border-border   bg-background/80 supports-[backdrop-filter]:bg-background/80"
  >
    <div class="container mx-auto flex h-[56px] items-center justify-between px-4">
      <RouterLink
        to="/"
        class="flex items-center gap-2 font-bold text-foreground transition-colors hover:text-primary"
      >
        <AppLogo class="size-8" />
        <span class="text-lg">Фонд Чилгази</span>
      </RouterLink>

      <DesktopMenu />

      <HeaderActions />

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

    <MobileMenu :is-open="mobileMenuOpen" @close="mobileMenuOpen = false" />
  </header>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import AppLogo from '@/components/app/AppLogo.vue'
import MobileMenu from './MobileMenu.vue'
import DesktopMenu from './DesktopMenu.vue'
import HeaderActions from './HeaderActions.vue'

const route = useRoute()
const mobileMenuOpen = ref(false)

watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  }
)
</script>
