<template>
  <div class="flex gap-2 w-full" role="group" aria-label="Выбор радиуса скругления">
    <CheckBlock
      v-for="_radius in [...RADIUS_TYPES].reverse()"
      :key="_radius"
      :checked="_radius === radius"
      :show-checkbox="false"
      @on-check="() => setRadius(_radius)"
      :aria-label="`Радиус ${_radius}${_radius === radius ? ' (выбран)' : ''}`"
      class="w-full min-w-60 flex-1 text-foreground min-h-14 flex-col py-3"
    >
      <template #content>
        <div
          class="h-8 w-10 border border-primary/50"
          :class="[
            BORDER_RADIUS_CSS_CLASSES[_radius],
            _radius === radius ? 'bg-card/75' : 'bg-background',
          ]"
        ></div>
        {{ _radius }}
      </template>
    </CheckBlock>
  </div>
</template>

<script lang="ts" setup>
import CheckBlock from '../ui/checkblock/CheckBlock.vue'
import { RADIUS_TYPES, BORDER_RADIUS_CSS_CLASSES } from '@/lib/constants'
import { useAppSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'

const { setRadius } = useAppSettingsStore()
const { radius } = storeToRefs(useAppSettingsStore())
</script>

<style></style>
