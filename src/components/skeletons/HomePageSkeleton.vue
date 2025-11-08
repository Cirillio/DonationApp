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

              <div
                class="space-y-2.5 sm:space-y-3 md:space-y-4 max-md:flex max-md:flex-col max-md:items-center"
              >
                 <Skeleton class="h-7 w-48 sm:w-56 rounded-full" /> <Skeleton
                  class="h-12 sm:h-16 md:h-20 lg:h-24 2xl:h-64 w-full max-w-4xl"
                />
              </div>

              <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4">
                 <Skeleton class="h-12 w-full sm:w-48 rounded-md" /> <Skeleton
                  class="h-12 w-full sm:w-40 rounded-md"
                />
              </div>

            </div>
             <!-- Нижний блок: Описание и карточки -->
            <div class="flex flex-col gap-5 sm:gap-6 lg:gap-8 lg:items-end">

              <div class="space-y-2 lg:items-end lg:flex lg:flex-col">
                 <Skeleton class="h-5 w-full max-w-2xl" /> <Skeleton
                  class="h-5 w-3/4 max-w-xl lg:ml-auto"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full lg:max-w-3xl">
                 <Card
                  v-for="i in 3"
                  :key="i"
                  class="group dark:bg-secondary-foreground/10 bg-card/10 shadow-lg backdrop-blur-xl border-2 border-border/5"
                  > <CardHeader class="pb-3"
                    >
                    <div class="flex items-center justify-between">
                       <Skeleton class="h-8 w-24" /> <Skeleton
                        class="size-6 md:size-7 rounded-md"
                      />
                    </div>
                     </CardHeader
                  > <CardContent> <Skeleton class="h-4 w-32" /> </CardContent> </Card
                >
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
     <!-- Our Country Section Skeleton -->
    <section class="w-full py-4 md:py-8 lg:py-12 bg-background">

      <div class="container mx-auto px-4 py-24 sm:py-16 md:py-20 lg:py-32">

        <div
          class="mx-auto w-full flex flex-col items-center justify-center gap-12 md:gap-16 lg:gap-20"
        >
           <!-- Header Section -->
          <div class="flex flex-col items-center gap-4 text-center">
             <Skeleton class="h-7 md:h-8 w-48 md:w-56 rounded-full" /> <Skeleton
              class="h-12 sm:h-16 md:h-20 lg:h-24 w-full max-w-4xl"
            />
          </div>
           <!-- Main Content: Image and Description -->
          <div class="w-full grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
             <!-- Image Card --> <Card
              class="overflow-hidden border-2 border-transparent shadow-lg shadow-black/25 bg-background p-0 gap-0 h-[300px] md:h-[400px] lg:h-[460px]"
              > <Skeleton class="h-full w-full rounded-none" /> </Card
            > <!-- Description Card --> <Card
              class="flex flex-col justify-center gap-6 p-6 md:p-8 border-2 border-transparent shadow-lg shadow-black/25 bg-card/80 backdrop-blur-xs h-[300px] md:h-[400px] lg:h-[460px]"
              > <CardHeader class="p-0"
                >
                <div class="flex items-center gap-3 mb-2">
                   <Skeleton class="size-6 md:size-8 rounded-md" /> <Skeleton
                    class="h-8 md:h-10 w-32 md:w-40"
                  />
                </div>
                 </CardHeader
              > <CardContent class="p-0 space-y-4"
                >
                <div class="space-y-2">
                   <Skeleton class="h-5 w-full" /> <Skeleton class="h-5 w-full" /> <Skeleton
                    class="h-5 w-4/5"
                  />
                </div>

                <div class="space-y-2">
                   <Skeleton class="h-5 w-full" /> <Skeleton class="h-5 w-3/4" />
                </div>
                 </CardContent
              > </Card
            >
          </div>
           <!-- Features Cards -->
          <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
             <Card
              v-for="i in 4"
              :key="i"
              class="group shadow-sm border-2 border-transparent hover:border-primary/50 bg-card"
              > <CardHeader class="pb-3"
                >
                <div class="flex items-center gap-3 mb-2">
                   <Skeleton class="size-10 md:size-12 rounded-lg" /> <Skeleton
                    class="h-6 md:h-7 w-24 md:w-32"
                  />
                </div>
                 </CardHeader
              > <CardContent class="pt-0"> <Skeleton class="h-4 md:h-5 w-full" /> </CardContent>
              </Card
            >
          </div>

        </div>

      </div>

    </section>
     <!-- Latest News Section Skeleton -->
    <section class="w-full py-4 md:py-8 lg:py-12 bg-card">

      <div class="container mx-auto px-4 py-24 sm:py-16 md:py-20 lg:py-32">

        <div
          class="mx-auto w-full flex flex-col items-center justify-center gap-12 md:gap-16 lg:gap-20"
        >
           <!-- Header Section -->
          <div class="flex flex-col items-center gap-4 text-center">
             <Skeleton class="h-7 md:h-8 w-48 md:w-56 rounded-full" /> <Skeleton
              class="h-12 sm:h-16 md:h-20 lg:h-24 w-full max-w-4xl"
            />
          </div>
           <!-- News Cards -->
          <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             <Card
              v-for="i in 3"
              :key="i"
              class="flex flex-col border-2 border-transparent shadow-sm shadow-black/10 bg-background/80 backdrop-blur-xs"
              > <CardHeader class="pb-3"
                >
                <div class="flex items-start justify-between gap-4 mb-2">

                  <div class="flex-1 space-y-2">
                     <Skeleton class="h-4 w-20" /> <Skeleton class="h-6 md:h-7 w-full" />
                  </div>
                   <Skeleton class="h-5 w-24 rounded-full" />
                </div>
                 </CardHeader
              > <CardContent class="flex-1 flex flex-col gap-4"
                >
                <div class="space-y-2 flex-1">
                   <Skeleton class="h-4 w-full" /> <Skeleton class="h-4 w-full" /> <Skeleton
                    class="h-4 w-3/4"
                  />
                </div>
                 <Skeleton class="h-3 w-2/3" /> </CardContent
              > </Card
            >
          </div>
           <!-- Button -->
          <div class="flex justify-center"> <Skeleton class="h-10 w-32 rounded-md" /> </div>

        </div>

      </div>

    </section>
     <!-- CTA Section Skeleton -->
    <section class="w-full py-4 md:py-8 lg:py-12 bg-background">

      <div class="container mx-auto px-4 py-24 sm:py-16 md:py-20 lg:py-32">

        <div
          class="mx-auto w-full flex flex-col items-center justify-center gap-12 md:gap-16 lg:gap-20"
        >
           <!-- Header Section -->
          <div class="flex flex-col items-center gap-4 text-center">
             <Skeleton class="h-7 md:h-8 w-48 md:w-56 rounded-full" /> <Skeleton
              class="h-12 sm:h-16 md:h-20 lg:h-24 w-full max-w-4xl"
            />
          </div>
           <!-- Main Content: Card and Image -->
          <div class="w-full grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
             <!-- Description Card --> <Card
              class="flex flex-col justify-center gap-6 p-6 md:p-8 border-2 border-transparent shadow-sm shadow-black/10 bg-card/80 backdrop-blur-xs"
              > <CardHeader class="p-0"
                >
                <div class="flex items-center gap-3 mb-2">
                   <Skeleton class="size-6 md:size-8 rounded-md" /> <Skeleton
                    class="h-8 md:h-10 w-32 md:w-40"
                  />
                </div>
                 </CardHeader
              > <CardContent class="p-0 space-y-6"
                >
                <div class="space-y-2">
                   <Skeleton class="h-5 w-full" /> <Skeleton class="h-5 w-full" /> <Skeleton
                    class="h-5 w-4/5"
                  />
                </div>

                <div class="space-y-2">
                   <Skeleton class="h-5 w-full" /> <Skeleton class="h-5 w-3/4" />
                </div>
                 <Skeleton class="h-11 w-full md:w-fit rounded-md" /> </CardContent
              > </Card
            > <!-- Image Card --> <Card
              class="overflow-hidden border-2 border-transparent shadow-sm shadow-black/10 bg-background p-0 gap-0 h-[300px] md:h-[400px] lg:h-[460px]"
              > <Skeleton class="h-full w-full rounded-none" /> </Card
            >
          </div>

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

