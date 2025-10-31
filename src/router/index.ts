import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { setupGuards } from './guards'

/**
 * Создание и настройка роутера приложения
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    // Определяем offset для главной или других страниц
    const scrollTop = to.path === '/' ? 57 : 0

    return new Promise((resolve) => {
      setTimeout(() => {
        window.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        })
        resolve({ top: scrollTop, behavior: 'smooth' })
      }, 25)
    })
  },
})

// Настройка navigation guards
setupGuards(router)

export default router

/**
 * Экспорт маршрутов для использования в других частях приложения
 */
export { mainRoutes } from './routes'
