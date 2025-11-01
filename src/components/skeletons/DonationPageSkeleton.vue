<!-- components/skeletons/DonatePageSkeleton.vue -->
<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
</script>

<template>
  <div class="donate-page">
    <div class="container min-h-screen mx-auto py-8 md:py-16">
      <div class="mx-auto flex flex-col gap-4 w-full sm:max-w-4xl">
        <!-- Header Section -->
        <div class="mb-12 text-center max-sm:px-4 items-center flex flex-col">
          <Skeleton class="size-12 rounded-full mb-4" />
          <Skeleton class="h-12 w-3/4 max-w-md mb-4" />
          <Skeleton class="h-6 w-full max-w-lg" />
          <Skeleton class="h-6 w-2/3 max-w-md mt-2" />
        </div>

        <!-- Stepper (desktop) -->
        <div class="max-md:hidden flex w-full px-12 items-center justify-center gap-4 mb-24">
          <Skeleton class="size-14 rounded-full" />
          <Skeleton class="h-[2px] w-full max-w-32" />
          <Skeleton class="size-14 rounded-full" />
          <Skeleton class="h-[2px] w-full max-w-32" />
          <Skeleton class="size-14 rounded-full" />
        </div>

        <!-- Form Card -->
        <div class="sm:max-w-xl w-full mx-auto">
          <Card
            class="flex flex-col w-full rounded-md gap-6 max-md:border-0 !py-6 shadow-none sm:shadow-md !bg-transparent sm:!bg-card"
          >
            <CardHeader
              class="flex gap-2 !px-4 sm:!px-6 md:gap-3 max-md:my-4 items-center max-md:flex-col"
            >
              <div class="max-md:text-center w-full">
                <Skeleton class="h-8 w-32 mx-auto md:mx-0 mb-2" />
                <Skeleton class="h-5 w-48 mx-auto md:mx-0" />
              </div>
            </CardHeader>

            <!-- Mobile Progress -->
            <div class="md:hidden w-full px-4">
              <Skeleton class="h-4 w-24 mb-2" />
              <Skeleton class="h-2 w-full rounded-full" />
            </div>

            <Separator class="bg-border max-md:hidden" />

            <CardContent class="!px-4 sm:!px-6 space-y-6">
              <!-- Phone field -->
              <div class="space-y-2">
                <Skeleton class="h-6 w-24" />
                <div class="flex gap-0">
                  <Skeleton class="h-11 w-24 rounded-r-none" />
                  <Skeleton class="h-11 flex-1 rounded-l-none" />
                </div>
              </div>

              <!-- Name field -->
              <div class="space-y-2">
                <Skeleton class="h-6 w-16" />
                <Skeleton class="h-11 w-full" />
                <Skeleton class="h-4 w-48" />
              </div>

              <!-- Birth date -->
              <div class="space-y-2">
                <Skeleton class="h-6 w-32" />
                <Skeleton class="h-11 w-full" />
              </div>

              <!-- Checkbox -->
              <div class="space-y-2">
                <Skeleton class="h-12 w-full rounded-md" />
                <Skeleton class="h-4 w-56" />
              </div>
            </CardContent>

            <CardFooter class="!px-4 sm:!px-6">
              <Skeleton class="h-11 w-full rounded-md" />
            </CardFooter>
          </Card>
        </div>

        <!-- Stats cards -->
        <div class="mt-12 grid gap-6 md:grid-cols-3 px-4">
          <div class="rounded-lg bg-card p-6 text-center shadow-sm space-y-2">
            <Skeleton class="h-9 w-20 mx-auto" />
            <Skeleton class="h-4 w-full" />
          </div>
          <div class="rounded-lg bg-card p-6 text-center shadow-sm space-y-2">
            <Skeleton class="h-9 w-20 mx-auto" />
            <Skeleton class="h-4 w-full" />
          </div>
          <div class="rounded-lg bg-card p-6 text-center shadow-sm space-y-2">
            <Skeleton class="h-9 w-20 mx-auto" />
            <Skeleton class="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.donate-page {
  position: relative;
  background-color: var(--color-background);

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
