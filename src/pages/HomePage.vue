<script lang="ts" setup>
import HeroSection from '@/components/home/HeroSection.vue'
import WhySupportSection from '@/components/home/WhySupportSection.vue'
import CTASection from '@/components/home/CTASection.vue'
import {
  useStructuredData,
  getOrganizationStructuredData,
  getWebSiteStructuredData,
} from '@/composables/useStructuredData'

useStructuredData({
  '@context': 'https://schema.org',
  '@graph': [getOrganizationStructuredData(), getWebSiteStructuredData()],
})
</script>

<template>
  <div class="min-h-full w-full">
    <HeroSection />
    <WhySupportSection />

    <!-- TODO: Add latest news section -->
    <!-- <LatestNewsSection /> -->

    <CTASection />
  </div>
</template>
