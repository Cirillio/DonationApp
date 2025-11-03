<!-- components/skeletons/HomePageSkeleton.vue -->
<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
</script>

<template>
  <div class="min-h-full w-full">
    <!-- Hero Section Skeleton -->
    <section class="relative overflow-hidden home-page-skeleton">
      <div class="w-full backdrop-blur-xs bg-secondary/50 dark:bg-background/75">
        <div class="container mx-auto px-4 py-24 sm:py-16 md:py-20 lg:py-32 h-full">
          <div
            class="flex flex-col justify-center md:justify-between gap-12 sm:gap-12 lg:gap-20 min-h-[500px] sm:min-h-[600px] lg:min-h-full"
          >
            <!-- Верхний блок: Заголовки и кнопки -->
            <div class="flex flex-col max-md:items-center gap-6 sm:gap-6 md:gap-8 max-w-4xl">
              <div class="space-y-2.5 sm:space-y-3 md:space-y-4 max-md:flex max-md:flex-col max-md:items-center">
                <Skeleton class="h-7 w-48 sm:w-56 rounded-full" />
                <Skeleton class="h-12 sm:h-16 md:h-20 lg:h-24 2xl:h-64 w-full max-w-4xl" />
              </div>

              <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4">
                <Skeleton class="h-12 w-full sm:w-48 rounded-md" />
                <Skeleton class="h-12 w-full sm:w-40 rounded-md" />
              </div>
            </div>

            <!-- Нижний блок: Описание и карточки -->
            <div class="flex flex-col gap-5 sm:gap-6 lg:gap-8 lg:items-end">
              <div class="space-y-2 lg:items-end lg:flex lg:flex-col">
                <Skeleton class="h-5 w-full max-w-2xl" />
                <Skeleton class="h-5 w-3/4 max-w-xl lg:ml-auto" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full lg:max-w-3xl">
                <Card v-for="i in 3" :key="i" class="group dark:bg-secondary-foreground/10 bg-card/10 shadow-lg backdrop-blur-xl border-2 border-border/5">
                  <CardHeader class="pb-3">
                    <div class="flex items-center justify-between">
                      <Skeleton class="h-8 w-24" />
                      <Skeleton class="size-6 md:size-7 rounded-md" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton class="h-4 w-32" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Support Section Skeleton -->
    <section class="w-full py-16 md:py-20 lg:py-24 bg-background/25">
      <div class="container mx-auto px-4">
        <!-- Header Section -->
        <div class="text-center mb-12 md:mb-16 space-y-4">
          <Skeleton class="h-10 md:h-12 w-64 md:w-96 mx-auto" />
          <Skeleton class="h-5 md:h-6 w-full max-w-2xl mx-auto" />
        </div>

        <!-- Cards Grid -->
        <div class="flex max-w-6xl mx-auto max-md:flex-col flex-wrap gap-6 md:gap-8">
          <Card v-for="i in 3" :key="i" class="shadow-sm border-2 border-transparent hover:border-primary/50 bg-card md:flex-1">
            <CardHeader class="space-y-4 pb-4">
              <Skeleton class="size-7 rounded-md" />
              <Skeleton class="h-8 w-48" />
            </CardHeader>
            <CardContent class="space-y-2">
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- CTA Section Skeleton -->
    <section class="dotted-background w-full py-16 md:py-20 lg:py-16 !bg-card">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-6xl w-full">
          <Card class="mx-auto md:flex-row flex-col gap-0 border-2 border-transparent md:h-96 bg-background overflow-hidden py-0 shadow-xl shadow-primary/5 backdrop-blur-xs">
            <Skeleton class="md:flex-2/5 h-64 md:h-96 w-full rounded-none" />
            <div class="md:flex-3/5 flex max-md:gap-4 flex-col items-start p-4 md:p-8 justify-between">
              <CardHeader class="text-center p-0 self-end flex w-full justify-between items-center gap-6">
                <Skeleton class="h-8 md:h-12 w-48 md:w-64" />
                <Skeleton class="size-6 md:size-10 rounded-md" />
              </CardHeader>

              <CardContent class="flex flex-col items-center p-0 gap-8">
                <div class="space-y-2 w-full">
                  <Skeleton class="h-4 w-full mx-auto" />
                  <Skeleton class="h-4 w-full mx-auto" />
                  <Skeleton class="h-4 w-full mx-auto" />
                  <Skeleton class="h-4 w-full mx-auto" />
                  <Skeleton class="h-4 w-4/5 mx-auto" />
                </div>
              </CardContent>

              <Skeleton class="h-11 w-full md:w-fit rounded-md max-md:mx-auto" />
            </div>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page-skeleton {
  background: linear-gradient(135deg, hsl(var(--secondary) / 0.3) 0%, hsl(var(--background)) 100%);
  min-height: 100vh;
  display: flex;
}

@media (max-width: 1024px) {
  .home-page-skeleton {
    min-height: auto;
  }
}

.dotted-background {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      circle,
      color-mix(in oklch, var(--color-primary) 15%, transparent) 1px,
      transparent 1px
    );
    background-size: 64px 64px;
    pointer-events: none;
    opacity: 0.4;
  }
}
</style>
