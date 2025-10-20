<script lang="ts" setup>
import Separator from '../separator/Separator.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: String,
})
</script>

<template>
  <div class="flex flex-col gap-4 md:gap-8 flex-1">
    <div class="flex flex-col gap-2">
      <div class="flex flex-col max-md:items-center gap-4">
        <div class="flex max-md:flex-col items-center gap-2">
          <span class="iconify border my-auto size-9 dark:text-primary" :class="[icon]"></span>
          <Label class="!text-3xl md:!text-4xl !font-semibold">{{ title }}</Label>
        </div>
        <div class="flex w-full px-4">
          <Separator />
        </div>
        <slot name="desc" />
      </div>
    </div>
    <div class="flex h-full">
      <slot />
    </div>
  </div>
</template>
