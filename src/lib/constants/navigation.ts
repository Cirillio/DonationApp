import type { MainNavigationLink } from '@/lib/types'

export const mainNavigationLinks: MainNavigationLink[] = [
  {
    name: 'home',
    title: 'Главная',
    url: '/home',
    icon: 'f7--house',
  },
  {
    name: 'donation',
    title: 'Пожертвования',
    url: '/',
    icon: 'f7--heart',
  },
  {
    name: 'statistic',
    title: 'Статистика',
    url: '/statistic',
    icon: 'f7--chart-pie',
  },
  {
    name: 'news',
    title: 'Новости',
    url: '/news',
    icon: 'f7--envelope',
  },
]
