<script lang="ts" setup>
import MainNavigation from './MainNavigation.vue'
import AppLogo from '../AppLogo.vue'
import { APP_TITLE } from '@/app/shared/config/app-main'
import Socials from './Socials.vue'
import ThemeToggler from '@/features/app-theme/ui/ThemeToggler.vue'
import RadiusToggler from '@/features/app-radius/ui/RadiusToggler.vue'
</script>

<template>
  <aside
    class="flex flex-col gap-2 lg:gap-4 py-3 lg:py-6 lg:px-4 px-2 items-center border-r border-background dark:border-border shadow-xs bg-card duration-150"
  >
    <div class="flex gap-1 items-center">
      <AppLogo class="size-10" />
      <span class="text-3xl font-bold tracking-tight text-foreground max-lg:hidden">{{
        APP_TITLE
      }}</span>
    </div>
    <Separator />
    <MainNavigation />
    <Separator />
    <Socials />

    <Separator class="mt-auto" />

    <ThemeToggler class="mx-auto" />
    <RadiusToggler />
  </aside>
</template>
