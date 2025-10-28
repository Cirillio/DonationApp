<template>
  <Button
    :variant="selected ? 'secondary' : 'outline'"
    @click="onSelect"
    :aria-pressed="selected"
    :aria-label="ariaLabel"
    role="button"
    class="flex-1 min-w-60 gap-2 flex text-base shadow-sm min-h-16"
  >
    <slot />
  </Button>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'

defineProps<{
  selected: boolean
  onSelect: () => void
  ariaLabel?: string
}>()
</script>

<style></style>
