<script lang="ts" setup>
import HeaderNav from './HeaderNav.vue'
import AppLogo from './AppLogo.vue'
</script>

<template>
  <div class="x-pad backdrop-blur-xs">
    <header class="flex flex-col md:flex-row py-2 items-center justify-between">
      <AppLogo />
      <HeaderNav class="max-md:hidden" />
    </header>
  </div>
</template>
