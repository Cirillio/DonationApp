<template>
  <Button
    @click="appThemeStore.toggleTheme"
    variant="outline"
    size="lg"
    class="max-lg:aspect-square gap-2 max-lg:p-2"
  >
    <div class="relative aspect-square grid place-items-center overflow-hidden">
      <Transition name="rotate-fade" mode="out-in">
        <Icon :key="appThemeStore.mode" :class="iconClass" class="size-6" />
      </Transition>
    </div>

    <span class="max-lg:hidden">
      {{ buttonTitle }}
    </span>
  </Button>
</template>

<script setup lang="ts">
import { useAppThemeStore } from '@/features/app-theme/model/app-theme-store'
import { computed } from 'vue'

const appThemeStore = useAppThemeStore()

const buttonTitle = computed(() => {
  switch (appThemeStore.mode) {
    case 'light':
      return 'Светлая'
    case 'dark':
      return 'Тёмная'
    case 'auto':
      return 'Авто'
  }
})

const iconClass = computed(() => {
  switch (appThemeStore.mode) {
    case 'light':
      return 'f7--sun-min'
    case 'dark':
      return 'f7--moon'
    case 'auto':
      return 'f7--gear-alt'
    default:
      return ''
  }
})
</script>

<style scoped>
.rotate-fade-enter-active,
.rotate-fade-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
  transform-origin: center;
}

.rotate-fade-enter-from {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

.rotate-fade-leave-to {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}
</style>
