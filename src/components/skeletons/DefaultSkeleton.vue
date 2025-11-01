<!-- components/skeletons/DefaultSkeleton.vue -->
<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="space-y-4">
        <Skeleton class="h-12 w-3/4" />
        <Skeleton class="h-6 w-1/2" />
      </div>

      <div class="space-y-4">
        <Skeleton class="h-32 w-full" />
        <Skeleton class="h-32 w-full" />
        <Skeleton class="h-32 w-full" />
      </div>
    </div>
  </div>
</template>
