<template>
  <div class="flex gap-2" role="group" aria-label="Выбор темы оформления">
    <CheckBlock
      v-for="theme in APP_THEME"
      :key="theme.label"
      :checked="theme.mode === mode"
      :show-checkbox="false"
      @on-check="() => toggleTheme(theme.mode)"
      :aria-label="`${theme.label} тема${theme.mode === mode ? ' (выбрана)' : ''}`"
      class="w-full flex-1 text-foreground min-h-14"
    >
      <template #content>
        <Icon :class="[theme.icon, 'size-6']" />
        {{ theme.label }}
      </template>
    </CheckBlock>
  </div>
</template>

<script lang="ts" setup>
import CheckBlock from '../ui/checkblock/CheckBlock.vue'
import { Icon } from '@/components/ui/icon'
import { useAppSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { APP_THEME } from '@/lib/constants'

const { toggleTheme } = useAppSettingsStore()
const { mode } = storeToRefs(useAppSettingsStore())
</script>

<style></style>
