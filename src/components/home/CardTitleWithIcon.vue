<script setup lang="ts">
import { CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'

interface Props {
  icon: string
  title: string
  iconSize?: string
  titleSize?: string
}

withDefaults(defineProps<Props>(), {
  iconSize: 'size-6 md:size-8',
  titleSize: 'text-2xl md:text-3xl',
})
</script>

<template>
   <CardHeader class="p-0"
    >
    <div class="flex items-center gap-3 mb-2">
       <Icon
        :class="[icon, iconSize, 'text-primary group-hover:text-accent/80 transition-colors']"
      /> <CardTitle :class="[titleSize, 'font-semibold text-foreground']"> {{ title }} </CardTitle>
    </div>
     </CardHeader
  >
</template>

