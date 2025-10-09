<script lang="ts" setup>
import Aside from '../ui/Aside/Aside.vue'
</script>

<template>
  <div
    class="h-dvh min-h-0 duration-150 bg-background w-screen flex md:grid grid-cols-[auto_1fr] overflow-hidden"
  >
    <Aside class="max-md:hidden" />
    <main class="flex flex-col min-h-0 w-full min-w-0 overflow-hidden">
      <div class="flex-1 min-h-0 min-w-0 overflow-y-auto overscroll-contain">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>
