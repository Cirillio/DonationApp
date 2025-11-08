<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import BaseSection from '@/components/common/BaseSection.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { createRevealRef, createStaggerRevealRef } = useScrollReveal({
  rootMargin: '-50px',
  threshold: 0.1,
  duration: 750,
  staggerDelay: 100,
})

const { elementRef: buttonRef } = createRevealRef()
const { containerRef: cardsContainerRef } = createStaggerRevealRef()

// Заглушка для новостей (в разработке)
const placeholderNews = [
  {
    id: 1,
    title: 'Новость скоро появится',
    description:
      'Мы работаем над разделом новостей. Скоро здесь будут актуальные события и обновления.',
    date: 'Скоро',
  },
  {
    id: 2,
    title: 'Раздел в разработке',
    description: 'Наша команда активно работает над созданием интересного контента для вас.',
    date: 'Скоро',
  },
  {
    id: 3,
    title: 'Следите за обновлениями',
    description: 'Подпишитесь на наши обновления, чтобы быть в курсе всех новостей и событий.',
    date: 'Скоро',
  },
]
</script>

<template>
   <BaseSection
    badge-text="Последние новости"
    badge-icon="f7--book"
    title="Актуальные события"
    background="card"
    > <!-- Карточки новостей -->
    <div
      ref="cardsContainerRef"
      class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
    >
       <Card
        v-for="news in placeholderNews"
        :key="news.id"
        class="group flex flex-col border-2 border-transparent hover:border-primary/50 transition-all shadow-sm shadow-black/10 hover:shadow-md hover:shadow-black/10 bg-background/80 backdrop-blur-xs"
        > <CardHeader class="pb-3"
          >
          <div class="flex items-start justify-between gap-4 mb-2">

            <div class="flex-1">

              <div class="flex items-center gap-2 mb-2">
                 <Icon class="f7--clock size-4 text-muted-foreground" /> <span
                  class="text-xs text-muted-foreground"
                  >{{ news.date }}</span
                >
              </div>
               <CardTitle class="text-lg md:text-xl font-semibold text-foreground line-clamp-2"
                > {{ news.title }} </CardTitle
              >
            </div>
             <Badge variant="outline" class="text-xs bg-muted/50 text-muted-foreground shrink-0"
              > <Icon class="f7--hammer size-3" /> В разработке </Badge
            >
          </div>
           </CardHeader
        > <CardContent class="flex-1 flex flex-col gap-4"
          >
          <p class="text-sm md:text-base text-muted-foreground leading-relaxed flex-1">
             {{ news.description }}
          </p>

          <div class="flex items-center gap-2 text-xs text-muted-foreground/70">
             <Icon class="f7--info-circle size-3" /> <span>Раздел находится в разработке</span>
          </div>
           </CardContent
        > </Card
      >
    </div>
     <!-- Кнопка перехода к новостям -->
    <div ref="buttonRef" class="flex justify-center">
       <Button as-child variant="outline" class="shadow-sm"
        > <RouterLink to="/news" class="flex items-center gap-2"
          > <span>Все новости</span> <Icon class="f7--arrow-right size-4" /> </RouterLink
        > </Button
      >
    </div>
     </BaseSection
  >
</template>

