<template>
  <div :class="isMobile ? 'flex flex-col gap-4 items-center w-full' : 'hidden md:inline-flex gap-2 items-center h-full'">
    <Button as-child :size="isMobile ? 'lg' : 'icon'" :class="isMobile ? 'w-full' : ''">
      <RouterLink to="/donate" class="flex items-center gap-2" @click="handleClick">
        <Icon class="f7--heart size-6" />
        <span v-if="isMobile">Поддержать</span>
      </RouterLink>
    </Button>
    <div :class="isMobile ? 'w-full h-[1px] bg-border' : 'w-[1px] h-[24px] bg-border'"></div>
    <ThemeButton :is-icon="!isMobile" :class="isMobile ? 'w-full gap-2 py-2' : ''">
      <template v-if="isMobile">{{ themeLabel }}</template>
    </ThemeButton>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import ThemeButton from '@/components/settings/ThemeButton.vue'
import { getThemeLabel } from '@/lib/constants/settings'
import { computed } from 'vue'
import { useAppSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
const { mode } = storeToRefs(useAppSettingsStore())

const themeLabel = computed(()=>getThemeLabel(mode.value))

interface Props {
  variant?: 'desktop' | 'mobile'
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'desktop'
})

const emit = defineEmits<Emits>()

const isMobile = props.variant === 'mobile'

const handleClick = () => {
  if (isMobile) {
    emit('click')
  }
}
</script>
