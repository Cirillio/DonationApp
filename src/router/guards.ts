import type { Router } from 'vue-router'
import { APP_TITLE } from '@/lib/constants'
import { useMainNavigationStore } from '@/stores/navigation'

/**
 * Настройка navigation guards для роутера
 */
export function setupGuards(router: Router) {
  // Guard для обновления состояния навигации и направления анимации
  router.beforeEach((to, from, next) => {
    const mainNavigationStore = useMainNavigationStore()

    // Обновляем активную ссылку и направление перехода
    if (to.name && typeof to.name === 'string') {
      mainNavigationStore.setActiveLink(to.name)
    }
    mainNavigationStore.setTransition(
      to.name as string | undefined,
      from.name as string | undefined
    )

    next()
  })

  // Guard для установки title страницы
  router.afterEach((to) => {
    const title = to.meta.title as string
    if (title) {
      document.title = `${title} | ${APP_TITLE}`
    } else {
      document.title = APP_TITLE
    }
  })
}
