import { defineStore } from 'pinia'
import { useColorMode, UseColorModeOptions } from '@vueuse/core'
import type { AppTheme } from '@/domain/app/app-theme/types'

export const useAppThemeStore = defineStore('appTheme', () => {
  const mode = useColorMode<AppTheme>({
    emitAuto: true,
    disableTransition: false,
    initialValue: 'light',
  } as UseColorModeOptions<AppTheme>)

  function toggleTheme() {
    if (mode.value === 'light') {
      mode.value = 'dark'
    } else if (mode.value === 'dark') {
      mode.value = 'auto'
    } else {
      mode.value = 'light'
    }
  }

  return {
    mode,
    toggleTheme,
  }
})
