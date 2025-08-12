import { NavLink } from '@/domain/app/navigation/types'
import { ref } from 'vue'

export const headerLinks = ref<NavLink[]>([
  {
    name: 'donat',
    title: 'Пожертвование',
    url: '/',
    icon: 'f7--heart',
    active: false,
  },
  {
    name: 'stats',
    title: 'Статистика',
    url: '/stats',
    icon: 'f7--chart-pie',
    active: false,
  },
  {
    name: 'news',
    title: 'Новости',
    url: '/news',
    icon: 'f7--envelope',
    active: false,
  },
])
