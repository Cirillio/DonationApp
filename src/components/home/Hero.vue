<template>
  <!-- Hero Section -->
  <section class="relative overflow-hidden home-page to-accent/10">
    <div
      class="container min-w-full backdrop-blur-md bg-background/25 relative mx-auto px-4 py-20 md:py-32"
    >
      <div class="mx-auto max-w-3xl text-center">
        <Badge
          variant="outline"
          class="!border-primary mb-6 text-primary text-sm bg-primary/10 rounded-full px-3 py-1.5"
        >
          <Heart class="!size-5 text-primary fill-primary" />
          Вместе мы сильнее
        </Badge>
        <h1 class="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl text-shadow-lg">
          Поддержите развитие нашего посёлка
        </h1>
        <p class="mb-8 text-pretty text-lg text-shadow-lg md:text-xl">
          Ваше пожертвование помогает улучшать инфраструктуру, организовывать мероприятия и
          создавать комфортную среду для всех жителей.
        </p>
        <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button as-child size="lg" class="w-full sm:w-auto shadow-md">
            <RouterLink to="/donate">
              <Heart class="mr-2 h-5 w-5" />
              Сделать пожертвование
            </RouterLink>
          </Button>
          <Button as-child variant="secondary" size="lg" class="w-full sm:w-auto shadow-md">
            <RouterLink to="/statistics">Посмотреть статистику</RouterLink>
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Heart } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import Badge from '../ui/badge/Badge.vue'
</script>

<style scoped>
.home-page {
  background-image: url('/public/img/bg-main1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: local;
}
</style>
