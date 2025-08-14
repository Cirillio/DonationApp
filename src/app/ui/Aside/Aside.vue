<script lang="ts" setup>
import AsideNav from './/AsideNav.vue'
import AppLogo from '../AppLogo.vue'
</script>

<template>
  <aside class="flex flex-col gap-4 py-6 px-4 items-center border-r border-border bg-card">
    <AppLogo />
    <Separator />
    <AsideNav />
    <Separator class="mt-auto" />
    <ThemeToggler class="mx-auto" />
  </aside>
</template>
