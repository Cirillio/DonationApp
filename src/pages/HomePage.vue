<script lang="ts" setup>
import Hero from '@/components/home/Hero.vue'
import WhySupportSection from '@/components/home/WhySupportSection.vue'
import CTASection from '@/components/home/CTASection.vue'
import { Separator } from '@/components/ui/separator'
</script>

<template>
  <div class="min-h-full w-full">
    <Hero />
    <Separator class="bg-primary !h-1" />
    <WhySupportSection />
    <CTASection />
    <Separator class="bg-primary !h-1" />
  </div>
</template>
