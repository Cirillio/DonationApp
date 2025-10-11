import type { RouteRecordRaw } from 'vue-router'
import { mainNavigationLinks } from '@/domain/main-navigation/config'

/**
 * Основные маршруты приложения (главные страницы с навигацией)
 */
export const mainRoutes: RouteRecordRaw[] = [
  {
    path: mainNavigationLinks[0].url,
    name: mainNavigationLinks[0].name,
    component: () => import('@/pages/Donation/Page.vue'),
    meta: {
      title: mainNavigationLinks[0].title,
      index: 0,
    },
  },
  {
    path: mainNavigationLinks[1].url,
    name: mainNavigationLinks[1].name,
    component: () => import('@/pages/Statistic/StatsView.vue'),
    meta: {
      title: mainNavigationLinks[1].title,
      index: 1,
    },
  },
  {
    path: mainNavigationLinks[2].url,
    name: mainNavigationLinks[2].name,
    component: () => import('@/pages/News/NewsView.vue'),
    meta: {
      title: mainNavigationLinks[2].title,
      index: 2,
    },
  },
]
