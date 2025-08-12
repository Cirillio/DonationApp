<script lang="ts" setup>
import { PropType } from 'vue'

defineProps({
  selected: {
    type: Boolean,
    default: false,
  },
  onSelect: {
    type: Function as PropType<(...args: any[]) => void>,
    required: true,
  },

  size: {
    type: String as PropType<'sm' | 'default' | 'lg' | 'icon'>,
    default: 'default',
  },
})
</script>

<template>
  <Button :size="size" @click="onSelect" :variant="selected ? 'ring' : 'outline'" type="button">
    <slot />
  </Button>
</template>
