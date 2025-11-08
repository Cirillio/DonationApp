<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import InfoCard from '@/components/common/InfoCard.vue'
import BaseSection from '@/components/common/BaseSection.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { createRevealRef, createStaggerRevealRef } = useScrollReveal({
  rootMargin: '-50px',
  threshold: 0.1,
  duration: 750,
  staggerDelay: 100,
})

const { containerRef: cardsContainerRef } = createStaggerRevealRef()
const { elementRef: imageRef } = createRevealRef()
const { elementRef: descriptionRef } = createRevealRef()

const features = [
  {
    icon: 'f7--building-2',
    title: 'Инфраструктура',
    description: 'Все необходимые объекты для комфортной жизни и работы',
  },
  {
    icon: 'f7--calendar',
    title: 'Мероприятия',
    description: 'Регулярные культурные и общественные события',
  },
  {
    icon: 'f7--heart',
    title: 'Сообщество',
    description: 'Дружная атмосфера и взаимопомощь жителей',
  },
  {
    icon: 'f7--sparkles',
    title: 'Развитие',
    description: 'Постоянная работа над улучшением посёлка',
  },
]
</script>

<template>
   <BaseSection
    badge-text="О нашем посёлке"
    badge-icon="f7--location"
    title="Место, где мы живём и развиваемся"
    background="background"
    > <!-- Основной контент: изображение и описание -->
    <div class="w-full grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
       <!-- Изображение в Card --> <Card
        class="group overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all shadow-sm shadow-black/10 hover:shadow-md hover:shadow-black/10 bg-transparent p-0 gap-0 h-[300px] md:h-[400px] lg:h-[460px]"
        > <picture
          ref="imageRef"
          class="relative h-full w-full flex items-center justify-center overflow-hidden"
          > <img
            src="/our_country.jpg"
            alt="Наш посёлок"
            class="w-full h-full object-center object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-100 group-hover:opacity-20 transition-all duration-300"
          ></div>
           </picture
        > </Card
      > <!-- Описание в Card --> <Card
        class="flex flex-col justify-center gap-6 p-6 md:p-8 border-2 border-transparent hover:border-primary/50 transition-all shadow-sm shadow-black/10 hover:shadow-md hover:shadow-black/10 bg-card/80 backdrop-blur-xs h-[300px] md:h-[400px] lg:h-[460px]"
        >
        <div ref="descriptionRef" class="flex flex-col gap-6">
           <CardHeader class="p-0"
            >
            <div class="flex items-center gap-3 mb-2">
               <Icon class="f7--house-alt size-6 md:size-8 text-primary" /> <CardTitle
                class="text-2xl md:text-3xl font-semibold text-foreground"
                > Чилгази </CardTitle
              >
            </div>
             </CardHeader
          > <CardContent class="p-0 space-y-4"
            >
            <p class="text-base md:text-lg text-foreground/80 leading-relaxed">
               Чилгази — это место, где мы живём и работаем. Мы гордимся тем, что у нас есть все
              необходимые для комфортного проживания и работы инфраструктура.
            </p>

            <p class="text-base md:text-lg text-foreground/80 leading-relaxed">
               Мы работаем над тем, чтобы наш посёлок был ещё лучше, создавая уютную атмосферу для
              всех жителей.
            </p>
             </CardContent
          >
        </div>
         </Card
      >
    </div>
     <!-- Карточки с преимуществами -->
    <div
      ref="cardsContainerRef"
      class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
    >
       <InfoCard
        v-for="(feature, index) in features"
        :key="index"
        class="group p-4 md:p-5 xl:px-6 xl:py-5 gap-2 xl:gap-4 md:gap-3"
        > <CardHeader class="p-0"
          >
          <div class="flex items-center gap-3 mb-2">

            <div class="p-2.5 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
               <Icon
                :class="[
                  feature.icon,
                  'size-5 md:size-6 text-primary group-hover:text-accent transition-colors',
                ]"
              />
            </div>
             <CardTitle class="md:text-base text-lg xl:text-xl font-semibold text-foreground"
              > {{ feature.title }} </CardTitle
            >
          </div>
           </CardHeader
        > <CardContent class="p-0"
          >
          <p class="text-sm md:text-base text-muted-foreground leading-relaxed">
             {{ feature.description }}
          </p>
           </CardContent
        > </InfoCard
      >
    </div>
     </BaseSection
  >
</template>

