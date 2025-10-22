<script setup lang="ts">
import DefaultLayout from './layout/DefaultLayout.vue'
import { useAppSettingsStore } from './stores/settings'

const appSettings = useAppSettingsStore()
appSettings.toggleTheme()
</script>

<template>
  <DefaultLayout />
</template>
