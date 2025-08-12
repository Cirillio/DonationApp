<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/shared/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'backdrop-blur-md shadow-sm bg-card/95 text-card-foreground flex flex-col gap-6 rounded-xl border  py-6',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
