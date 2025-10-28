import { AppTheme, BorderRadius } from '@/lib/types'

/*
  UI RADIUS PARAMS
*/

export const BORDER_RADIUS = {
  none: '0rem',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.75rem',
} as const

export const BORDER_RADIUS_CSS_CLASSES: Record<BorderRadius, string> = {
  none: 'rounded-none',
  xs: 'rounded-[0.25rem]',
  sm: 'rounded-[0.5rem]',
  md: 'rounded-[0.75rem]',
  lg: 'rounded-[1rem]',
  xl: 'rounded-[1.25rem]',
  '2xl': 'rounded-[1.75rem]',
} as const

export const RADIUS_TYPES = Object.keys(BORDER_RADIUS) as BorderRadius[]

export const DEFAULT_RADIUS: BorderRadius = 'md'

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

export const DEFAULT_THEME: AppTheme = 'auto'
