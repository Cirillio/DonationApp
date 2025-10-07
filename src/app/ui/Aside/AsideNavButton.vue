<script lang="ts" setup>
defineProps({
  active: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <Button
    :variant="active ? 'secondary' : 'outline'"
    size="lg"
    class="lg:w-full gap-2 justify-start max-lg:aspect-square max-lg:p-2"
  >
    <slot name="leading" />

    <slot name="label" />
  </Button>
</template>
