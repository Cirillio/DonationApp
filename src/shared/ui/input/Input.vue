<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/shared/lib/utils'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>
<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="
      cn(
        'flex h-12 bg-card w-full text-foreground min-w-0 rounded-md border px-3 md:py-1 md:text-lg text-base transition-all duration-150 dark:shadow-xs outline-none',
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',

        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',

        'border-border',
        'focus-visible:border-ring focus-visible:hover:border-ring focus-visible:ring-ring/25 focus-visible:ring-[2px] focus-visible:bg-card',

        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',

        '[&[aria-invalid=true]]:border-destructive',
        '[&[aria-invalid=true]]:ring-destructive/20 [&[aria-invalid=true]]:hover:border-destructive',
        'dark:[&[aria-invalid=true]]:ring-destructive/40',

        props.class
      )
    "
  />
</template>
