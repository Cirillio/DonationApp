import type { LucideIcon } from 'lucide-vue-next'

export type MainNavigationLink = {
  name: string
  title: string
  url: string
  icon: LucideIcon
}

export type TransitionDirection = 'slide-up' | 'slide-down' | 'slide-initial'
