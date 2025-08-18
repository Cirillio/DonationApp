<script lang="ts" setup>
import { useAppRadiusStore } from '../model/app-radius-store'
const appRadiusStore = useAppRadiusStore()
</script>

<template>
  <div class="flex shadow-xs rounded-md">
    <Button
      :disabled="!appRadiusStore.canGoPrev"
      @click="appRadiusStore.setLessRadius"
      size="sm"
      variant="outline"
      class="rounded-r-none !shadow-none px-1.5"
    >
      <Icon class="size-5 f7--chevron-left" />
    </Button>
    <span
      class="flex-1 flex gap-1 border-y border-border text-sm text-foreground px-2 items-center justify-center"
    >
      <Icon class="size-4 f7--square" />
      {{ appRadiusStore.currentRadius }}
    </span>
    <Button
      :disabled="!appRadiusStore.canGoNext"
      @click="appRadiusStore.setMoreRadius"
      size="sm"
      variant="outline"
      class="rounded-l-none !shadow-none px-1.5"
    >
      <Icon class="size-5 f7--chevron-right" />
    </Button>
  </div>
</template>
