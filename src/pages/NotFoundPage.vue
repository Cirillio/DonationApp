<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const router = useRouter()

const goHome = () => router.push('/')
const goBack = () => router.back()
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4"
  >
    <div class="w-full max-w-2xl">
      <!-- Анимированная 404 -->
      <div class="text-center mb-8 relative">
        <div class="inline-block relative">
          <h1
            class="text-[12rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-primary/20 via-primary/40 to-primary/60 leading-none select-none animate-in fade-in zoom-in duration-500"
          >
            404
          </h1>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          </div>
        </div>
      </div>

      <!-- Контент -->
      <div
        class="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150"
      >
        <div class="space-y-2">
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight">Страница не найдена</h2>
          <p class="text-lg text-muted-foreground max-w-md mx-auto">
            Кажется, вы забрели не туда. Эта страница переехала, была удалена или никогда не
            существовала.
          </p>
        </div>

        <!-- Кнопки -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
          <Button @click="goHome" size="lg" class="gap-2 min-w-40">
            <span class="iconify f7--house size-5" />
            На главную
          </Button>
          <Button @click="goBack" variant="outline" size="lg" class="gap-2 min-w-40">
            <span class="iconify f7--arrow-turn-up-left size-5" />
            Назад
          </Button>
        </div>

        <!-- Декоративные элементы -->
        <div class="pt-8 flex justify-center gap-8 text-muted-foreground/30">
          <span
            class="iconify f7--question-circle size-12 animate-bounce delay-100"
            style="animation-delay: 0.1s"
          />
          <span
            class="iconify f7--exclamationmark-triangle size-12 animate-bounce delay-200"
            style="animation-delay: 0.2s"
          />
          <span
            class="iconify f7--search size-12 animate-bounce delay-300"
            style="animation-delay: 0.3s"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-300 {
  animation-delay: 0.3s;
}
</style>
