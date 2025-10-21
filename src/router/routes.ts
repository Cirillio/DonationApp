import type { RouteRecordRaw } from 'vue-router'

export const mainRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'donation',
    component: () => import('@/pages/DonationPage.vue'),
    meta: { title: 'Пожертвование' },
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: 'Главная' },
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('@/pages/NewsPage.vue'),
    meta: { title: 'Новости' },
  },
  {
    path: '/statistic',
    name: 'statistic',
    component: () => import('@/pages/StatisticPage.vue'),
    meta: { title: 'Статистика' },
  },
]

export const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: '404' },
  },
]

export const routes: RouteRecordRaw[] = [...mainRoutes, ...systemRoutes]
