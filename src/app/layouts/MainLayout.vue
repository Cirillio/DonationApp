<script lang="ts" setup>
import Aside from '../ui/Aside/Aside.vue'
</script>

<template>
  <div class="h-[100dvh] w-screen grid grid-cols-[auto_1fr]">
    <Aside class="max-md:hidden" />
    <main class="grid grid-rows-[auto_1fr] h-full">
      <div class="flex p-2 items-center justify-between bg-card border-b border-border">
        <div class="flex gap-2">
          <Badge variant="default" class="text-sm">• Собрано всего: 999</Badge>
          <Badge variant="secondary" class="text-sm">• Собрано в этом месяце: 999</Badge>
          <Badge variant="accent" class="text-sm">• Собрано за прошлый месяц: 999</Badge>
        </div>
        <div class="text-muted-foreground flex items-center gap-1">
          <Icon class="f7--clock size-4" />
          14.08.2025 | 21:35
        </div>
      </div>
      <div class="overflow-y-scroll w-full h-full">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>
