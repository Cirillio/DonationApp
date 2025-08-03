<script lang="ts" setup>
import NavBar from '../controls/NavBar.vue'
import AppLogo from '../app/AppLogo.vue'
</script>

<template>
  <div class="x-pad backdrop-blur-xs">
    <header class="flex flex-col md:flex-row py-2 items-center justify-between">
      <AppLogo />

      <NavBar class="max-md:hidden" />
    </header>
  </div>
</template>
