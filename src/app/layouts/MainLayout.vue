<script lang="ts" setup>
import Aside from '../ui/Aside/Aside.vue'
import HeaderTimer from '../ui/HeaderTimer/HeaderTimer.vue'
</script>

<template>
  <div class="h-dvh min-h-0 w-screen flex md:grid grid-cols-[auto_1fr] overflow-hidden">
    <Aside class="max-md:hidden" />
    <main class="flex flex-col min-h-0 w-full min-w-0 overflow-hidden">
      <div
        class="flex p-2 sticky items-center justify-between bg-card shadow-xs dark:border-b border-border"
      >
        <!-- Затычки пока что -->
        <div class="flex gap-2">
          <Badge variant="default" class="text-sm max-xl:text-xs">• Собрано всего: 999</Badge>
          <Badge variant="secondary" class="text-sm max-xl:text-xs"
            >• Собрано в этом месяце: 999</Badge
          >
          <Badge variant="accent" class="text-sm max-xl:text-xs"
            >• Собрано за прошлый месяц: 999</Badge
          >
        </div>
        <HeaderTimer />
      </div>
      <div class="flex-1 min-h-0 min-w-0 overflow-y-auto overscroll-contain">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>
