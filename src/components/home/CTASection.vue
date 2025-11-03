<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  <section class="dotted-background w-full py-16 md:py-20 lg:py-24 !bg-card">
    <div class="container mx-auto px-4">
      <div ref="containerRef" class="mx-auto max-w-3xl w-full">
        <Card  class="mx-auto border-0 ring-2 ring-primary/50 group py-12 hover:shadow-primary/10 active:shadow-primary/10 transition-all hover:-translate-y-1 shadow-xl shadow-primary/5 backdrop-blur-xs  w-full">
        <CardHeader class="text-center flex flex-col items-center gap-6">
          <Icon variant="ghost" class="m-1 f7--gift size-12 text-accent/60 group-active:text-accent/80 group-hover:text-accent/80 transition-all" />

          <CardTitle class="text-2xl md:text-4xl font-semibold">
            Готовы помочь?
          </CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col items-center gap-8">
          <p class="text-base md:text-xl text-center text-muted-foreground">
            Каждое пожертвование делает наш посёлок лучше
          </p>
          <Button
            as-child
            class="shadow-lg text-base px-6 py-3 rounded-full hover:shadow-xl transition-shadow font-semibold"
          >
            <RouterLink to="/donate" class="flex items-center gap-2">
              <span>Поддержать сейчас</span>
              <Icon class="f7--arrow-right size-6 text-primary-foreground" />
            </RouterLink>
          </Button>
        </CardContent>
      </Card>

      </div>

    </div>
  </section>
</template>
