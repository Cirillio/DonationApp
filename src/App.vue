<script setup lang="ts">
import DefaultLayout from './layout/DefaultLayout.vue'
import { useAppSettingsStore } from './stores/settings'

const appSettings = useAppSettingsStore()
</script>

<template>
  <DefaultLayout />
</template>
