import { AppTheme } from '@/lib/types'

/*
  UI THEME PARAMS
*/

export const APP_THEME: {
  mode: AppTheme
  icon: string
  label: string
}[] = [
  {
    mode: 'light',
    icon: 'f7--sun-min',
    label: 'Светлая',
  },
  {
    mode: 'dark',
    icon: 'f7--moon',
    label: 'Тёмная',
  },
  {
    mode: 'auto',
    icon: 'f7--gear-alt',
    label: 'Автоматическая',
  },
]

export const getThemeLabel = (mode: AppTheme) => {
  return APP_THEME.find((theme) => theme.mode === mode)?.label || 'Автоматическая'
}

export const getThemeIcon = (mode: AppTheme) => {
  return APP_THEME.find((theme) => theme.mode === mode)?.icon || 'f7--gear-alt'
}


export const DEFAULT_THEME: AppTheme = 'auto'
