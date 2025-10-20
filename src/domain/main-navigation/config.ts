import { MainNavigationLink } from '@/domain/app/navigation/types'

export const mainNavigationLinks = [
  {
    name: 'home',
    title: 'Главная',
    url: '/',
    icon: 'f7--house',
  },
  {
    name: 'donation',
    title: 'Пожертвования',
    url: '/donation',
    icon: 'f7--heart',
  },
  {
    name: 'stats',
    title: 'Статистика',
    url: '/stats',
    icon: 'f7--chart-pie',
  },
  {
    name: 'news',
    title: 'Новости',
    url: '/news',
    icon: 'f7--envelope',
  },
] as MainNavigationLink[]
