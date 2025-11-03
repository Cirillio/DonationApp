<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { createRevealRef } = useScrollReveal({
  rootMargin: '-50px',
  threshold: 0.1,
  duration: 750,
})

const { elementRef: containerRef } = createRevealRef()
</script>

<template>
  <section class="dotted-background w-full py-16 md:py-20 lg:py-16 !bg-card">
    <div class="container mx-auto px-4">
      <div ref="containerRef" class="mx-auto max-w-6xl w-full">
        <Card
          class="mx-auto md:flex-row flex-col gap-0 border-2 border-transparent hover:border-primary/50 md:h-96 bg-background group overflow-hidden py-0 hover:shadow-primary/10 active:shadow-primary/10 transition-all shadow-xl shadow-primary/5 backdrop-blur-xs w-full"
        >
          <picture class="md:flex-2/5 flex h-full items-center justify-center overflow-hidden">
            <img
              src="/readyforhelp.jpg"
              alt="Ready for help"
              class="w-full h-full scale-105 transition-all duration-150 ease-in-out object-center object-cover"
            />
          </picture>
          <div class="md:flex-3/5   flex max-md:gap-4 flex-col items-start p-4 md:p-8 justify-between">
            <CardHeader
              class="text-center p-0 self-end flex w-full justify-between items-center gap-6"
            >
              <CardTitle class="text-2xl md:text-4xl font-semibold"> Готовы помочь? </CardTitle>
              <Icon
                class="f7--gift size-6 md:size-10 text-secondary/60 group-active:text-accent/80 group-hover:text-accent/80 transition-all"
              />
            </CardHeader>

            <CardContent class="flex flex-col items-center p-0 gap-8">
              <p class="text-sm md:text-base text-muted-foreground">
                Каждое пожертвование делает наш посёлок лучше. Вместе мы создаём пространство для
                детских игр, обустраиваем зоны отдыха, поддерживаем культурные мероприятия и
                заботимся об инфраструктуре. Ваша помощь — это вклад в наше общее будущее, где
                каждый житель чувствует себя частью дружного сообщества. Давайте сделаем наш посёлок
                ещё уютнее и привлекательнее для всех!
              </p>
            </CardContent>

            <Button
              as-child
              class="shadow-sm max-md:mx-auto w-full md:w-fit text-base px-5 py-2 hover:shadow-md transition-shadow font-semibold"
            >
              <RouterLink to="/donate" class="flex items-center gap-2">
                <span>Поддержать сейчас</span>
                <Icon class="f7--arrow-right size-6 text-primary-foreground" />
              </RouterLink>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>
