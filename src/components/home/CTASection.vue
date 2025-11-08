<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import BaseSection from '@/components/common/BaseSection.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { createRevealRef } = useScrollReveal({
  rootMargin: '-50px',
  threshold: 0.1,
  duration: 750,
})

const { elementRef: contentRef } = createRevealRef()
</script>

<template>
   <BaseSection
    badge-text="Готовы помочь?"
    badge-icon="f7--gift"
    title="Поддержите развитие нашего посёлка"
    background="background"
    > <!-- Основной контент: карточка и изображение -->
    <div ref="contentRef" class="w-full grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
       <!-- Карточка с описанием --> <Card
        class="flex flex-col justify-center gap-6 p-6 md:p-8 border-2 border-transparent hover:border-primary/50 transition-all shadow-sm shadow-black/10 hover:shadow-md hover:shadow-black/10 bg-card/80 backdrop-blur-xs"
        > <CardHeader class="p-0"
          >
          <div class="flex items-center gap-3 mb-2">
             <Icon class="f7--heart size-6 md:size-8 text-primary" /> <CardTitle
              class="text-2xl md:text-3xl font-semibold text-foreground"
              > Ваша помощь важна </CardTitle
            >
          </div>
           </CardHeader
        > <CardContent class="p-0 space-y-6"
          >
          <p class="text-base md:text-lg text-foreground/80 leading-relaxed">
             Каждое пожертвование делает наш посёлок лучше. Вместе мы создаём пространство для
            детских игр, обустраиваем зоны отдыха, поддерживаем культурные мероприятия и заботимся
            об инфраструктуре.
          </p>

          <p class="text-base md:text-lg text-foreground/80 leading-relaxed">
             Ваша помощь — это вклад в наше общее будущее, где каждый житель чувствует себя частью
            дружного сообщества. Давайте сделаем наш посёлок ещё уютнее и привлекательнее для всех!
          </p>
           <Button
            as-child
            class="shadow-sm w-full md:w-fit text-base px-5 py-2 hover:shadow-md transition-shadow font-semibold"
            > <RouterLink to="/donate" class="flex items-center gap-2"
              > <span>Поддержать сейчас</span> <Icon
                class="f7--arrow-right size-6 text-primary-foreground"
              /> </RouterLink
            > </Button
          > </CardContent
        > </Card
      > <!-- Изображение --> <Card
        class="group overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all shadow-sm shadow-black/10 hover:shadow-md hover:shadow-black/10 bg-transparent p-0 gap-0 h-[300px] md:h-[400px] lg:h-[460px]"
        > <picture class="relative h-full w-full flex items-center justify-center overflow-hidden"
          > <img
            src="/readyforhelp.jpg"
            alt="Ready for help"
            class="w-full h-full object-center object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
          /> </picture
        > </Card
      >
    </div>
     </BaseSection
  >
</template>

