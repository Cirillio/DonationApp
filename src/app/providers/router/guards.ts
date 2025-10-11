import type { Router } from 'vue-router'
import { APP_TITLE } from '@/app/shared/config/app-main'
import { pageSliderObj } from '@/domain/app/page-slider/types'

/**
 * Настройка navigation guards для роутера
 */
export function setupGuards(router: Router) {
  // Guard для определения направления анимации перехода
  router.beforeEach((to, from, next) => {
    const toIndex = to.meta.index as number | undefined
    const fromIndex = from.meta.index as number | undefined

    // Если это первый переход (from.name === undefined), то 'initial'
    if (!from.name) {
      to.meta.transitionDirection = pageSliderObj['slide-initial']
    } else if (toIndex !== undefined && fromIndex !== undefined) {
      to.meta.transitionDirection =
        toIndex > fromIndex ? pageSliderObj['slide-down'] : pageSliderObj['slide-up']
    } else {
      to.meta.transitionDirection = pageSliderObj['slide-down']
    }

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
