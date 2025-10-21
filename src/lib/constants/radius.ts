import { BorderRadius } from '@/lib/types'

export const BORDER_RADIUS = {
  none: '0rem',
  '2xs': '0.125rem',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
} as const

export const RADIUS_TYPES = Object.keys(BORDER_RADIUS) as BorderRadius[]

export const DEFAULT_RADIUS: BorderRadius = 'md'
