<script setup lang="ts">
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import InfoCard from '@/components/common/InfoCard.vue'
import BaseSection from '@/components/common/BaseSection.vue'
import TextCard from './TextCard.vue'
import ImageCard from './ImageCard.vue'
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

const paragraphs = [
  'Чилгази — это место, где мы живём и работаем. Мы гордимся тем, что у нас есть все необходимые для комфортного проживания и работы инфраструктура.',
  'Мы работаем над тем, чтобы наш посёлок был ещё лучше, создавая уютную атмосферу для всех жителей.',
]

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
    >
    <div class="w-full grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">

      <div ref="imageRef">
         <ImageCard
          src="/our_country.jpg"
          alt="Наш посёлок"
          min-height="h-[300px] md:h-[400px] lg:h-[460px]"
          :gradient="true"
        />
      </div>

      <div ref="descriptionRef">
         <TextCard
          icon="f7--house-alt"
          title="Чилгази"
          :paragraphs="paragraphs"
          content-spacing="space-y-4"
          class="lg:gap-6 gap-2 h-fit md:h-[400px] lg:h-[460px]"
        />
      </div>

    </div>

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

