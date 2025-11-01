<script lang="ts" setup>
import HeroSection from '@/components/home/HeroSection.vue'
import WhySupportSection from '@/components/home/WhySupportSection.vue'
import CTASection from '@/components/home/CTASection.vue'
import { Separator } from '@/components/ui/separator'
import {
  useStructuredData,
  getOrganizationStructuredData,
  getWebSiteStructuredData,
} from '@/composables/useStructuredData'

// Добавляем structured data для главной страницы
useStructuredData({
  '@context': 'https://schema.org',
  '@graph': [getOrganizationStructuredData(), getWebSiteStructuredData()],
})
</script>

<template>
  <div class="min-h-full w-full">
    <HeroSection />
    <Separator class="bg-primary !h-1" />
    <WhySupportSection />
    <CTASection />
    <Separator class="bg-primary !h-1" />
  </div>
</template>
