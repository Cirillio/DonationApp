import type { RouteRecordRaw } from 'vue-router'

/**
 * Системные маршруты (редиректы, 404 и т.д.)
 */
export const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound/Page.vue'),
    meta: { title: 'Страница не найдена' },
  },
]
