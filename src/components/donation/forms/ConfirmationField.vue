<script lang="ts" setup>
import { Icon } from '@/components/ui/icon'

interface Props {
  icon: string
  value: string
  iconClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconClass: 'text-primary',
})
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="rounded-md flex p-1.5 bg-input/50">
      <Icon :class="`${props.icon} size-7 ${props.iconClass}`" />
    </div>

    <p class="text-lg font-normal text-foreground">{{ props.value }}</p>
  </div>
</template>
