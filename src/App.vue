<script setup lang="ts">
import DefaultLayout from './layout/DefaultLayout.vue'
import { useAppSettingsStore } from './stores/settings'

// Initialize settings store immediately
// This ensures CSS variables and theme are applied on app load
useAppSettingsStore()
</script>

<template>
  <DefaultLayout />
</template>
