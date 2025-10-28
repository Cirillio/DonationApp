<template>
  <div class="flex gap-2" role="group" aria-label="Выбор темы оформления">
    <SelectButton
      v-for="theme in APP_THEME"
      :key="theme.label"
      :selected="theme.mode === mode"
      :on-select="() => toggleTheme(theme.mode)"
      :aria-label="`${theme.label} тема${theme.mode === mode ? ' (выбрана)' : ''}`"
    >
      <Icon :class="[theme.icon, 'size-6']" />
      {{ theme.label }}
    </SelectButton>
  </div>
</template>

<script lang="ts" setup>
import SelectButton from './SelectButton.vue'
import { Icon } from '@/components/ui/icon'
import { useAppSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { APP_THEME } from '@/lib/constants'

const { toggleTheme } = useAppSettingsStore()
const { mode } = storeToRefs(useAppSettingsStore())
</script>

<style></style>
