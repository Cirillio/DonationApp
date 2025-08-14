<script lang="ts" setup>
import MainHeader from '../ui/MainHeader.vue'
</script>

<template>
  <div class="h-[100dvh] w-screen grid grid-cols-[auto_1fr]">
    <MainHeader />
    <main class="grid grid-rows-[auto_1fr] h-full">
      <div class="flex p-2 gap-2 items-center bg-card border-b border-border">
        <Badge variant="default" class="text-sm">• Собрано всего: 999</Badge>
        <Badge variant="secondary" class="text-sm">• Собрано в этом месяце: 999</Badge>
        <Badge variant="accent" class="text-sm">• Собрано за прошлый месяц: 999</Badge>
      </div>
      <div class="overflow-y-scroll w-full h-full">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>
