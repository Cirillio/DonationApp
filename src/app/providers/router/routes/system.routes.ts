import type { RouteRecordRaw } from 'vue-router'
import { mainNavigationLinks } from '@/domain/main-navigation/config'

/**
 * Системные маршруты (редиректы, 404 и т.д.)
 */
export const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: mainNavigationLinks[0].url,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound/Page.vue'),
    meta: { title: 'Страница не найдена' },
  },
]
