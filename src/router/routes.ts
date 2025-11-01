import type { RouteRecordRaw } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import { DonationPageSkeleton } from '@/components/skeletons'
export const mainRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: {
      title: 'Главная',
      icon: 'f7--house',
      description: 'Поддержите развитие нашего посёлка. Фонд Чилгази - вместе мы сильнее!',
    },
  },
  {
    path: '/donate',
    name: 'donation',
    component: defineAsyncComponent({
      loader: () => import('@/pages/DonatePage.vue'),
      loadingComponent: DonationPageSkeleton,
      delay: 0,
      timeout: 10000,
    }),
    meta: {
      title: 'Пожертвование',
      icon: 'f7--heart',
      description: 'Сделайте пожертвование на развитие нашего посёлка. Каждый вклад важен!',
    },
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('@/pages/NewsPage.vue'),
    meta: {
      title: 'Новости',
      icon: 'f7--book',
      description: 'Актуальные новости и события фонда Чилгази',
    },
  },
  {
    path: '/statistic',
    name: 'statistic',
    component: () => import('@/pages/StatisticPage.vue'),
    meta: {
      title: 'Статистика',
      icon: 'f7--chart-pie',
      description: 'Статистика пожертвований и завершенных проектов фонда Чилгази',
    },
  },
]

export const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/SettingsPage.vue'),
    meta: { title: 'Настройки', icon: 'f7--gear' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: '404' },
  },
]

export const routes: RouteRecordRaw[] = [...mainRoutes, ...systemRoutes]
