<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  to: string
  label: string
  icon?: string
  variant?: 'default' | 'ghost'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'f7--arrow-right',
  variant: 'default',
  class: '',
})
</script>

<template>
   <Button
    as-child
    :variant="variant"
    :class="
      cn(
        variant === 'default'
          ? 'w-full md:w-fit text-base px-5 py-2 hover:shadow-md transition-shadow font-semibold'
          : 'py-2 px-3.5',
        props.class
      )
    "
    > <RouterLink :to="to" class="flex items-center gap-2"
      > <span>{{ label }}</span
      > <Icon
        :class="[
          icon,
          variant === 'ghost' ? 'size-4' : 'size-6',
          variant === 'default' ? 'text-primary-foreground' : '',
        ]"
      /> </RouterLink
    > </Button
  >
</template>

