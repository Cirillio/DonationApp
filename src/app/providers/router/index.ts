import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { setupGuards } from './guards'

/**
 * Создание и настройка роутера приложения
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Настройка navigation guards
setupGuards(router)

export default router

/**
 * Экспорт маршрутов для использования в других частях приложения
 */
export { mainRoutes } from './routes'
