<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Props {
  src: string
  alt: string
  minHeight?: string
  gradient?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  minHeight: 'min-h-[300px]',
  gradient: false,
})
</script>

<template>
   <Card
    :class="
      cn(
        'group overflow-hidden hover:border-primary/50 transition-all shadow-black/10 hover:shadow-md hover:shadow-black/10 bg-transparent p-0 gap-0 h-full',
        props.minHeight
      )
    "
    > <picture class="relative h-full w-full flex items-center justify-center overflow-hidden"
      > <img
        :src="props.src"
        :alt="props.alt"
        class="w-full h-full object-center object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
      />
      <div
        v-if="props.gradient"
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-100 group-hover:opacity-20 transition-all duration-300"
      ></div>
       </picture
    > </Card
  >
</template>

