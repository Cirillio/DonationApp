<script lang="ts" setup>
import NavigationButton from './NavigationButton.vue'
import { SOCIALS } from '@/app/shared/config/socials'
</script>

<template>
  <a
    v-for="social in SOCIALS"
    :key="social.label"
    :href="social.url"
    target="_blank"
    class="w-full"
  >
    <NavigationButton :class="[social.colorClass]" :active="true">
      <template v-slot:leading>
        <Icon class="size-5" :class="[social.icon]" />
      </template>

      <template v-slot:label>
        <span class="max-lg:hidden">{{ social.label }}</span>
      </template>
    </NavigationButton>
  </a>
</template>
