import { defineStore } from 'pinia'
import { useColorMode, UseColorModeOptions } from '@vueuse/core'
import { ref, computed } from 'vue'
import type { AppTheme, BorderRadius } from '@/lib/types'
import { BORDER_RADIUS, RADIUS_TYPES, DEFAULT_RADIUS } from '@/lib/constants'

/**
 * Unified app settings store for theme, radius, and future settings
 */
export const useAppSettingsStore = defineStore('appSettings', () => {
  // ========== THEME ==========
  const mode = useColorMode<AppTheme>({
    emitAuto: true,
    disableTransition: true,
    initialValue: 'light',
  } as UseColorModeOptions<AppTheme>)

  function toggleTheme(newMode: AppTheme | null) {
    if (newMode) {
      mode.value = newMode
      return
    }

    if (mode.value === 'light') {
      mode.value = 'dark'
    } else if (mode.value === 'dark') {
      mode.value = 'auto'
    } else {
      mode.value = 'light'
    }
  }

  // ========== RADIUS ==========
  const radius = ref<BorderRadius>(getInitialRadius())

  const currentRadius = computed(() => BORDER_RADIUS[radius.value].replace('rem', ''))

  function setRadius(newRadius: BorderRadius) {
    if (RADIUS_TYPES.includes(newRadius)) {
      radius.value = newRadius
      saveRadius(newRadius)
      updateCSSRadius(newRadius)
    } else {
      throw new Error('Invalid radius type')
    }
  }

  function setMoreRadius() {
    const currentRadiusIndex = RADIUS_TYPES.indexOf(radius.value)
    const nextRadiusIndex = (currentRadiusIndex + 1) % RADIUS_TYPES.length
    const nextRadius = RADIUS_TYPES[nextRadiusIndex]
    setRadius(nextRadius)
  }

  function setLessRadius() {
    const currentRadiusIndex = RADIUS_TYPES.indexOf(radius.value)
    const prevRadiusIndex = (currentRadiusIndex - 1 + RADIUS_TYPES.length) % RADIUS_TYPES.length
    const prevRadius = RADIUS_TYPES[prevRadiusIndex]
    setRadius(prevRadius)
  }

  const canGoNext = computed(() => {
    const currentIndex = RADIUS_TYPES.indexOf(radius.value)
    return currentIndex < RADIUS_TYPES.length - 1
  })

  const canGoPrev = computed(() => {
    const currentIndex = RADIUS_TYPES.indexOf(radius.value)
    return currentIndex > 0
  })

  // ========== HELPERS ==========
  function getInitialRadius(): BorderRadius {
    const initialRadius = localStorage.getItem('app-radius')
    if (initialRadius && RADIUS_TYPES.includes(initialRadius as BorderRadius)) {
      return initialRadius as BorderRadius
    }
    return DEFAULT_RADIUS
  }

  function saveRadius(newRadius: BorderRadius) {
    localStorage.setItem('app-radius', newRadius)
  }

  function updateCSSRadius(radiusValue: BorderRadius) {
    if (typeof document !== 'undefined') {
      const cssValue = BORDER_RADIUS[radiusValue]
      document.documentElement.style.setProperty('--radius', cssValue)
    }
  }

  // Initialize CSS on store creation
  updateCSSRadius(radius.value)

  return {
    // Theme
    mode,
    toggleTheme,
    // Radius
    radius,
    currentRadius,
    setRadius,
    setMoreRadius,
    setLessRadius,
    canGoNext,
    canGoPrev,
  }
})
