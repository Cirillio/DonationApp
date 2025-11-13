<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { useScrollReveal } from '@/composables/useScrollReveal'

interface Props {
  badgeText: string
  badgeIcon: string
  title: string
  background?: 'background' | 'card'
}

const props = withDefaults(defineProps<Props>(), {
  background: 'background',
})

const { createRevealRef } = useScrollReveal({
  rootMargin: '-50px',
  threshold: 0.1,
  duration: 750,
})

const { elementRef: headerRef } = createRevealRef()

const backgroundClass = props.background === 'card' ? 'bg-card' : 'bg-background'
</script>

<template>

  <section :class="['w-full py-4 md:py-8 lg:py-12', backgroundClass]">

    <div class="app-container py-24 sm:py-16 md:py-20 lg:py-32">

      <div
        class="mx-auto w-full flex flex-col items-center justify-center gap-12 md:gap-16 lg:gap-20"
      >
         <!-- Заголовок с Badge -->
        <div ref="headerRef" class="flex flex-col items-center gap-4 text-center">
           <Badge variant="outline-primary" class="text-sm md:text-base bg-primary/10"
            > <Icon :class="[badgeIcon, 'size-3.5 md:size-4']" /> {{ badgeText }} </Badge
          >
          <h2 class="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary">
             {{ title }}
          </h2>

        </div>
         <!-- Контент секции --> <slot />
      </div>

    </div>

  </section>

</template>

