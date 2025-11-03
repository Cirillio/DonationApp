<template>
  <!-- Hero Section -->
  <section class="relative overflow-hidden home-page">
    <div class="w-full backdrop-blur-xs bg-secondary/50 dark:bg-background/75">
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
              <StatsCard value="1234" description="Активных участников" icon="f7--person" />
              <StatsCard value="780 000" description="Собрано средств" icon="f7--money-rubl" />
              <StatsCard value="18" description="Завершённых проектов" icon="f7--doc-checkmark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import StatsCard from './StatsCard.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'


const { createStaggerRevealRef, createRevealRef } = useScrollReveal({
  threshold: 0.1,
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
  background-image: url('/img/hero.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  display: flex;
}

@media (max-width: 1024px) {
  .home-page {
    min-height: auto;
  }
}

.stats-button {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  opacity: 0.9;
  transition: all 0.2s ease-in-out;
}

.stats-button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  opacity: 1;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
}

.stats-button:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.98);
}

.stats-button:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.dark .stats-button {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.dark .stats-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}
</style>
