<script setup lang="ts">
import {  CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { useScrollReveal } from '@/composables/useScrollReveal'
import InfoCard from '../common/InfoCard.vue'

interface SupportReason {
  icon: string
  title: string
  description: string
}

const reasons: SupportReason[] = [
  {
    icon: 'f7--alt',
    title: 'Прозрачность',
    description:
      'Полная отчётность по использованию средств. Вы всегда знаете, куда идут ваши деньги.',
  },
  {
    icon: 'f7--person-2-alt',
    title: 'Сообщество',
    description: 'Решения принимаются совместно с жителями. Ваше мнение важно для нас.',
  },
  {
    icon: 'f7--star-fill',
    title: 'Результаты',
    description: 'Реальные улучшения, которые видны каждому жителю посёлка.',
  },
]

const { createRevealRef, createStaggerRevealRef } = useScrollReveal({
  rootMargin: '-50px',
  threshold: 0.1,
  duration: 750,
  staggerDelay: 100,
})

const { elementRef: headerRef } = createRevealRef()
const { containerRef: cardsContainerRef } = createStaggerRevealRef()
</script>

<template>
  <section class="w-full py-16 md:py-20 lg:py-24 bg-background/25">
    <div class="container mx-auto px-4">
      <!-- Header Section -->
      <div ref="headerRef" class="text-center mb-12 md:mb-16 space-y-4">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
          Почему стоит поддержать нас?
        </h2>
        <p class="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Мы работаем открыто и прозрачно для блага всего сообщества
        </p>
      </div>

      <!-- Cards Grid -->
      <div ref="cardsContainerRef" class="flex max-w-6xl mx-auto max-md:flex-col flex-wrap gap-6 md:gap-8">
        <InfoCard v-for="(reason, index) in reasons" :key="index">
          <CardHeader class="gap-4">
            <Icon :class="[
              reason.icon,
              'size-7 text-primary opacity-90 group-hover:opacity-100 group-hover:text-accent/80 group-active:text-accent/80 transition-all duration-200',
            ]" />
            <CardTitle class="text-xl md:text-2xl font-bold text-foreground">
              {{ reason.title }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm md:text-base text-muted-foreground leading-relaxed">
              {{ reason.description }}
            </p>
          </CardContent>

        </InfoCard>
      </div>
    </div>
  </section>
</template>
