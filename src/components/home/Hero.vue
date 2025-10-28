<template>
  <!-- Hero Section -->
  <section class="relative overflow-hidden home-page">
    <div class="w-full backdrop-blur-xs bg-secondary/25 dark:bg-background/75">
      <div class="container mx-auto px-4 py-24 sm:py-16 md:py-20 lg:py-32">
        <div
          class="flex flex-col justify-center gap-12 sm:gap-12 lg:gap-20 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]"
        >
          <!-- Верхний блок: Заголовки и кнопки - прижат влево -->
          <div class="flex flex-col gap-6 sm:gap-6 md:gap-8 max-w-2xl">
            <div
              class="space-y-2.5 sm:space-y-3 md:space-y-4 max-sm:flex max-sm:flex-col max-sm:text-center gap-2 max-sm:items-center"
            >
              <Badge
                variant="outline-primary"
                class="text-sm !shadow-lg bg-primary/50 text-white/90 sm:text-base w-fit"
              >
                <Icon class="f7--heart size-3.5 sm:size-4" />
                Вместе мы сильнее
              </Badge>
              <h1
                class="light:text-secondary-foreground text-shadow-sm text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
              >
                Поддержите развитие нашего посёлка
              </h1>
            </div>

            <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4">
              <Button
                as-child
                size="lg"
                class="shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto"
              >
                <RouterLink to="/donate">Поддержать проект</RouterLink>
              </Button>
              <Button
                as-child
                variant="secondary"
                size="lg"
                class="shadow-md opacity-90 hover:opacity-100 hover:shadow-lg transition-shadow w-full sm:w-auto"
              >
                <RouterLink to="/statistics">Статистика</RouterLink>
              </Button>
            </div>
          </div>

          <!-- Нижний блок: Описание и карточки - прижат вправо -->
          <div class="flex flex-col gap-5 sm:gap-6 lg:gap-8 lg:items-end">
            <p
              class="text-sm max-sm:text-center sm:text-base light:text-secondary-foreground/75 md:text-lg text-foreground/80 leading-relaxed max-w-2xl lg:text-right"
            >
              Ваше пожертвование помогает улучшать инфраструктуру, организовывать мероприятия и
              создавать комфортную среду для всех жителей.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full lg:max-w-3xl">
              <StatsCard value="1234" description="Активных участников" icon="f7--person" />
              <StatsCard value="2.4М ₽" description="Собрано средств" icon="f7--money-rubl" />
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
</style>
