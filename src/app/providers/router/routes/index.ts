import type { RouteRecordRaw } from 'vue-router'
import { mainRoutes } from './main.routes'
import { systemRoutes } from './system.routes'

/**
 * Все маршруты приложения
 */
export const routes: RouteRecordRaw[] = [...systemRoutes, ...mainRoutes]

/**
 * Экспорт отдельных групп маршрутов для использования в других частях приложения
 */
export { mainRoutes, systemRoutes }
