<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    required: false,
  },
  valid: {
    type: Boolean,
    required: false,
  },
})
</script>

<template>
  <Icon
    :variant="valid ? 'secondary' : 'outline'"
    class="md:size-6 size-7"
    :class="[valid ? 'f7--checkmark-alt' : icon]"
  />

  <div class="max-md:text-center">
    <CardTitle class="text-2xl md:text-xl md:w-full">{{ title }}</CardTitle>
    <CardDescription v-if="description" class="md:text-xs">{{ description }}</CardDescription>
  </div>
</template>
