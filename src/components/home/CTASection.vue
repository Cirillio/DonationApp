<script setup lang="ts">
import BaseSection from '@/components/common/BaseSection.vue'
import TextCard from './TextCard.vue'
import ImageCard from './ImageCard.vue'
import ActionButton from './ActionButton.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { createRevealRef } = useScrollReveal({
  rootMargin: '-50px',
  threshold: 0.1,
  duration: 750,
})

const { elementRef: contentRef } = createRevealRef()

const paragraphs = [
  'Каждое пожертвование делает наш посёлок лучше. Вместе мы создаём пространство для детских игр, обустраиваем зоны отдыха, поддерживаем культурные мероприятия и заботимся об инфраструктуре.',
  'Ваша помощь — это вклад в наше общее будущее, где каждый житель чувствует себя частью дружного сообщества. Давайте сделаем наш посёлок ещё уютнее и привлекательнее для всех!',
]
</script>

<template>
   <BaseSection
    badge-text="Готовы помочь?"
    badge-icon="f7--gift"
    title="Поддержите развитие нашего посёлка"
    background="background"
    >
    <div ref="contentRef" class="w-full grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-stretch">
       <TextCard icon="f7--heart" title="Ваша помощь важна" :paragraphs="paragraphs"
        > <template #action
          > <ActionButton class="mt-auto" to="/donate" label="Поддержать сейчас" /> </template
        > </TextCard
      > <ImageCard src="/readyforhelp.jpg" alt="Ready for help" />
    </div>
     </BaseSection
  >
</template>

