<template>
  <!-- Hero Section -->
  <section class="relative overflow-hidden home-page">
    <!-- Оптимизированное фоновое изображение -->
    <picture class="hero-background">
      <source
        srcset="
          /img/optimized/hero-800.avif   800w,
          /img/optimized/hero-1280.avif 1280w,
          /img/optimized/hero-1920.avif 1920w
        "
        type="image/avif"
        sizes="100vw"
      />
      <source
        srcset="
          /img/optimized/hero-800.webp   800w,
          /img/optimized/hero-1280.webp 1280w,
          /img/optimized/hero-1920.webp 1920w
        "
        type="image/webp"
        sizes="100vw"
      />
      <img
        src="/img/optimized/hero-1920.jpg"
        srcset="
          /img/optimized/hero-800.jpg   800w,
          /img/optimized/hero-1280.jpg 1280w,
          /img/optimized/hero-1920.jpg 1920w
        "
        sizes="100vw"
        alt="Поддержите развитие нашего посёлка"
        fetchpriority="high"
        class="hero-image"
        :class="{ 'hero-image-loaded': imageLoaded }"
        @load="imageLoaded = true"
      />
    </picture>

    <div class="w-full backdrop-blur-xs bg-secondary/50 dark:bg-background/75 relative z-10">
      <div class="container mx-auto px-4 py-24 sm:py-16 md:py-20 lg:py-32 h-full">
        <div
          class="flex flex-col justify-center md:justify-between gap-12 sm:gap-12 lg:gap-20 min-h-[500px] sm:min-h-[600px] lg:min-h-full"
        >
          <!-- Верхний блок: Заголовки и кнопки - прижат влево -->
          <div class="flex flex-col max-md:items-center gap-6 sm:gap-6 md:gap-8 max-w-4xl">
            <div
              ref="headerRef"
              class="space-y-2.5 sm:space-y-3 md:space-y-4 max-md:flex max-md:flex-col max-md:text-center gap-2 max-md:items-center"
            >
              <Badge
                variant="outline-primary"
                class="text-sm !shadow-lg bg-primary/50 text-white/90 sm:text-base w-fit"
              >
                <Icon class="f7--heart size-3.5 sm:size-4" />
                Вместе мы сильнее
              </Badge>
              <h1
                class="light:text-secondary-foreground text-shadow-sm text-4xl sm:text-3xl md:text-4xl lg:text-6xl 2xl:text-8xl font-bold leading-none"
              >
                Поддержите развитие нашего посёлка
              </h1>
            </div>

            <div ref="buttonsRef" class="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4">
              <Button
                as-child
                size="lg"
                class="shadow-md text-xl py-2.5 px-6  transition-shadow w-full sm:w-auto"
              >
                <RouterLink to="/donate">Поддержать проект</RouterLink>
              </Button>
              <button
                as-child
                class="shadow-md active:opacity-90 hover:opacity-90 text-xl bg-white/20 rounded-md  transition-all duration-50 text-white py-2.5 px-6 w-full sm:w-auto"
              >
                <RouterLink to="/statistic">Статистика</RouterLink>
              </button>
            </div>
          </div>

          <!-- Нижний блок: Описание и карточки - прижат вправо -->
          <div ref="descriptionRef" class="flex flex-col gap-5 sm:gap-6 lg:gap-8 lg:items-end">
            <p
              class="text-sm max-sm:text-center sm:text-base light:text-secondary-foreground/75 md:text-lg text-foreground/80 leading-relaxed max-w-2xl lg:text-right"
            >
              Ваше пожертвование помогает улучшать инфраструктуру, организовывать мероприятия и
              создавать комфортную среду для всех жителей.
            </p>

            <div
              ref="statsRef"
              class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full lg:max-w-3xl"
            >
              <div>
                <StatsCard value="1234" description="Активных участников" icon="f7--person" />
              </div>
              <div>
                <StatsCard value="780 000" description="Собрано средств" icon="f7--money-rubl" />
              </div>
              <div>
                <StatsCard value="18" description="Завершённых проектов" icon="f7--doc-checkmark" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import StatsCard from './StatsCard.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const imageLoaded = ref(false)

const { createStaggerRevealRef, createRevealRef } = useScrollReveal({
  threshold: 0.025,
  duration: 500,
  rootMargin: '-70px',
})

const { elementRef: headerRef } = createRevealRef()
const { elementRef: buttonsRef } = createRevealRef()
const { elementRef: descriptionRef } = createRevealRef()
const { containerRef: statsRef } = createStaggerRevealRef()
</script>

<style scoped>
.home-page {
  position: relative;
  min-height: 100vh;
  display: flex;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.hero-image-loaded {
  opacity: 1;
}

@media (max-width: 1024px) {
  .home-page {
    min-height: auto;
  }
}

</style>
