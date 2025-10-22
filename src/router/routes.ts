import type { RouteRecordRaw } from 'vue-router'

export const mainRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: 'Главная', icon: 'f7:house' },
  },
  {
    path: '/donate',
    name: 'donation',
    component: () => import('@/pages/donate/DonatePage.vue'),
    meta: { title: 'Пожертвование', icon: 'f7:heart' },
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('@/pages/NewsPage.vue'),
    meta: { title: 'Новости', icon: 'f7:book' },
  },
  {
    path: '/statistic',
    name: 'statistic',
    component: () => import('@/pages/StatisticPage.vue'),
    meta: { title: 'Статистика', icon: 'f7:chart-pie' },
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
