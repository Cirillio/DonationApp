<script lang="ts" setup>
import AppLogo from './AppLogo.vue'
</script>

<template>
  <div class="x-pad w-full mt-auto border-border border-t backdrop-blur-sm bg-background">
    <header class="flex flex-row py-2 items-center justify-between">
      <AppLogo />

      <ThemeToggler class="relative" />
    </header>
  </div>
</template>
