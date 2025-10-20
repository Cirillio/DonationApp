import type { RouteRecordRaw } from 'vue-router'
import { mainNavigationLinks } from '@/domain/main-navigation/config'

/**
 * Основные маршруты приложения (главные страницы с навигацией)
 * Маршруты генерируются автоматически из конфигурации mainNavigationLinks
 */
const pageComponents: Record<string, () => Promise<any>> = {
  home: () => import('@/pages/Home/Page.vue'),
  donation: () => import('@/pages/Donation/Page.vue'),
  stats: () => import('@/pages/Statistic/StatsView.vue'),
  news: () => import('@/pages/News/NewsView.vue'),
}

export const mainRoutes: RouteRecordRaw[] = [
  ...mainNavigationLinks.map((link) => ({
    path: link.url,
    name: link.name,
    component: pageComponents[link.name],
    meta: {
      title: link.title,
    },
  })),
]
