<template>
  <div class="flex flex-col gap-2">
    <span class="flex gap-2 items-center">
      <slot name="icon" />
      <h2 class="text-lg font-medium">{{ title }}</h2>
    </span>
    <p class="text-base text-muted-foreground mb-2">
      {{ description }}
    </p>
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  description: string
}>()
</script>

<style></style>
