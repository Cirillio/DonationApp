<template>
  <Button variant="soft" :size="isIcon ? 'icon' : 'default'" @click="() => toggleTheme(null)">
    <Icon :class="[iconClass, 'size-6']" />
    <slot v-if="!isIcon" />
  </Button>
</template>

<script lang="ts" setup>
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { useAppSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { APP_THEME } from '@/lib/constants'
import { computed } from 'vue'

defineProps<{
  isIcon?: boolean
}>()

const { mode } = storeToRefs(useAppSettingsStore())
const { toggleTheme } = useAppSettingsStore()

const iconClass = computed(() => {
  return APP_THEME.find(theme => theme.mode === mode.value)?.icon || 'f7--sun-min'
})
</script>

<style></style>
