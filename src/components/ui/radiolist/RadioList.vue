<script lang="ts" setup generic="T">
import { ref, computed } from 'vue'

defineProps<{
  orientation?: 'horizontal' | 'vertical' | 'wrap'
}>()

const internalSelectedValue = ref<T | undefined>(undefined)

const selected = computed<T | undefined>(() => internalSelectedValue.value)

const select = (value: T): T | null => {
  const isCurrentlySelected =
    internalSelectedValue.value !== undefined && internalSelectedValue.value === value

  const newValue = isCurrentlySelected ? null : value

  internalSelectedValue.value = newValue

  return newValue
}

defineExpose({ select: (s: T) => select(s), selected: internalSelectedValue })
</script>

<template>
  <div class="grid h-fit no-scrollbar p-1 min-w-0">
    <div
      class="flex gap-2 w-full min-w-0"
      :class="{
        'flex-col': orientation === 'vertical',
        'flex-row': orientation === 'horizontal',
        'flex-wrap': orientation === 'wrap',
      }"
    >
      <slot name="item" :select="select" :selected="selected" />
    </div>
  </div>
</template>
