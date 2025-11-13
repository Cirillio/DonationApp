<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import CardTitleWithIcon from './CardTitleWithIcon.vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  icon: string
  title: string
  paragraphs: string[]
  showButton?: boolean
  contentSpacing?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  showButton: false,
  contentSpacing: 'space-y-6',
  class: '',
})
</script>

<template>
   <Card
    :class="
      cn(
        'flex flex-col justify-center group gap-6 p-6 md:p-8 hover:border-primary/50 transition-all hover:shadow-md hover:shadow-black/10 bg-card/80 backdrop-blur-xs h-full',
        props.class
      )
    "
    > <CardTitleWithIcon :icon="icon" :title="title" /> <CardContent
      :class="cn('p-0', props.contentSpacing)"
      >
      <p
        v-for="(paragraph, index) in paragraphs"
        :key="index"
        class="text-base md:text-lg text-foreground/80 leading-relaxed"
      >
         {{ paragraph }}
      </p>
       <slot name="action" /> </CardContent
    > </Card
  >
</template>

