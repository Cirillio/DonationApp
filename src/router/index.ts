import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { setupGuards } from './guards'
import { SCROLL_TOP } from '@/lib/constants'

/**
 * Создание и настройка роутера приложения
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(__, _, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }


    return new Promise((resolve) => {
      setTimeout(() => {
        window.scrollTo({
          top: SCROLL_TOP,
          behavior: 'smooth',
        })
        resolve({ top: SCROLL_TOP, behavior: 'smooth' })
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
