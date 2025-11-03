<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import DefaultLayout from './layout/DefaultLayout.vue'
import { useAppSettingsStore } from './stores/settings'
import { SCROLL_TOP } from './lib/constants'

useAppSettingsStore()

onMounted(() => {
  nextTick(() => {
    window.scrollTo({
      top: SCROLL_TOP,
      behavior: 'smooth',
    })
  })
})
</script>

<template>
  <DefaultLayout />
</template>
