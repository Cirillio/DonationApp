import { NavLink } from '@/domain/app/navigation/types'

export const navLinks = [
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
] as NavLink[]
