<template>
  <div class="flex gap-2 w-full" role="group" aria-label="Выбор радиуса скругления">
    <SelectButton
      v-for="_radius in [...RADIUS_TYPES].reverse()"
      :key="_radius"
      :selected="_radius === radius"
      :on-select="() => setRadius(_radius)"
      :aria-label="`Радиус ${_radius}${_radius === radius ? ' (выбран)' : ''}`"
      class="flex-col flex-2/9 py-3"
    >
      <div
        class="h-8 w-10 border"
        :class="[
          BORDER_RADIUS_CSS_CLASSES[_radius],
          _radius === radius ? 'bg-card/75' : 'bg-background',
        ]"
      ></div>
      {{ _radius }}
    </SelectButton>
  </div>
</template>

<script lang="ts" setup>
import SelectButton from './SelectButton.vue'
import { RADIUS_TYPES, BORDER_RADIUS_CSS_CLASSES } from '@/lib/constants'
import { useAppSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'

const { setRadius } = useAppSettingsStore()
const { radius } = storeToRefs(useAppSettingsStore())
</script>

<style></style>
