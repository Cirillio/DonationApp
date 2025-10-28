import { BORDER_RADIUS } from '@/lib/constants'

export type BorderRadius = keyof typeof BORDER_RADIUS

export type AppTheme = 'light' | 'dark' | 'auto'
