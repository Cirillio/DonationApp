import { defineStore } from 'pinia'
import { useColorMode, UseColorModeOptions } from '@vueuse/core'
import type { AppTheme } from '@/lib/types'

/**
 * Unified app settings store for theme and future settings
 */
export const useAppSettingsStore = defineStore('appSettings', () => {
  // ========== THEME ==========
  const mode = useColorMode<AppTheme>({
    emitAuto: true,
    disableTransition: true,
    initialValue: 'light',
  } as UseColorModeOptions<AppTheme>)

  function toggleTheme(newMode: AppTheme | null = null) {
    mode.value = newMode ?? (mode.value === 'light' ? 'dark' : mode.value === 'dark' ? 'auto' : 'light')
  }


  return {
    // Theme
    mode,
    toggleTheme,
  }
})
