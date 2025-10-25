import type { Router } from 'vue-router'
import { APP_TITLE } from '@/lib/constants'

export function setupGuards(router: Router) {
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
