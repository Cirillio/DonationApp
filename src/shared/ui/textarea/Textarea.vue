<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/shared/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  defaultValue?: string | number
  modelValue?: string | number
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
  <textarea
    v-model="modelValue"
    data-slot="textarea"
    :class="
      cn(
        // базовые размеры и форма
        'flex h-fit w-full min-w-0 px-4 py-2 rounded-md text-base outline-none transition-all duration-150 shadow-xs',

        // цвета и бордер
        'bg-card text-foreground border border-border',
        'file:text-foreground placeholder:text-muted-foreground',
        'selection:bg-primary selection:text-primary-foreground',

        // ховер/фокус
        'focus-visible:border-secondary/50 focus-visible:ring-0',

        // file input
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',

        // disabled
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',

        // invalid state
        '[&[aria-invalid=true]]:border-destructive',
        '[&[aria-invalid=true]]:ring-destructive/20 [&[aria-invalid=true]]:hover:border-destructive',
        'dark:[&[aria-invalid=true]]:ring-destructive/40',

        props.class
      )
    "
  />
</template>
