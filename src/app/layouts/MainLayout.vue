<script lang="ts" setup>
import MainHeader from '../ui/MainHeader.vue'
</script>

<template>
  <div class="h-[100dvh] w-screen grid grid-cols-[auto_1fr]">
    <MainHeader />
    <main class="grid grid-rows-[auto_1fr] h-full">
      <div class="flex px-4 py-2 gap-2 items-center bg-card border-b border-border">
        <Badge variant="outline">aS</Badge>
      </div>
      <div class="overflow-y-scroll w-full h-full bg-background/25 text-card-foreground">
        <div class="grid grid-rows-[1fr_auto] gap-2 items-center min-h-full">
          <router-view></router-view>
        </div>
      </div>
    </main>
  </div>
</template>
