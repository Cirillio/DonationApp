<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { createRevealRef } = useScrollReveal({
  rootMargin: '-50px',
  threshold: 0.1,
  duration: 600,
})

const { elementRef: containerRef } = createRevealRef()
</script>

<template>
  <section class="w-full py-16 md:py-20 lg:py-24 bg-card">
    <div class="container mx-auto px-4">
      <div
        ref="containerRef"
        class="flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto"
      >
        <!-- Heading -->
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">Готовы помочь?</h2>

        <!-- Subheading -->
        <p class="text-base md:text-lg text-muted-foreground">
          Каждое пожертвование делает наш посёлок лучше
        </p>

        <!-- CTA Button -->
        <Button
          as-child
          class="shadow-lg text-lg px-6 py-4 rounded-full hover:shadow-xl transition-shadow"
        >
          <RouterLink to="/donate" class="flex items-center gap-2">
            <Icon class="f7--heart size-5" />
            Поддержать сейчас
          </RouterLink>
        </Button>
      </div>
    </div>
  </section>
</template>
