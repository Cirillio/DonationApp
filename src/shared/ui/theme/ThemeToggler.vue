<template>
  <Button
    @click="toggleMode"
    variant="outline"
    class="relative p-0 aspect-square grid place-items-center overflow-hidden"
  >
    <Transition name="rotate-fade" mode="out-in">
      <Icon :key="mode" :class="iconClass" class="size-4 md:size-5" />
    </Transition>
  </Button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode({ emitAuto: true, disableTransition: false })

const toggleMode = () => {
  mode.value = mode.value === 'light' ? 'dark' : mode.value === 'dark' ? 'auto' : 'light'
}

const iconClass = computed(() => {
  switch (mode.value) {
    case 'light':
      return 'f7--sun-min'
    case 'dark':
      return 'f7--moon'
    case 'auto':
      return 'f7--desktopcomputer'
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
