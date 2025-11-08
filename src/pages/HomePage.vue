<script lang="ts" setup>
import HeroSection from '@/components/home/HeroSection.vue'
import OurCountrySection from '@/components/home/OurCountrySection.vue'
import LatestNewsSection from '@/components/home/LatestNewsSection.vue'
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
     <HeroSection /> <OurCountrySection /> <LatestNewsSection /> <CTASection />
  </div>

</template>

