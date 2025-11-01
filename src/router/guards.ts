import type { Router } from 'vue-router'
import { APP_TITLE } from '@/lib/constants'
import { useSEO } from '@/composables/useSEO'

export function setupGuards(router: Router) {
  // Guard для установки SEO и meta тегов
  router.afterEach((to) => {
    const { setMetaTags } = useSEO()
    const title = to.meta.title as string
    const description = to.meta.description as string | undefined
    const fullTitle = title ? `${title} | ${APP_TITLE}` : APP_TITLE

    // Получаем базовый URL приложения
    const baseUrl = window.location.origin
    const ogImageUrl = `${baseUrl}/og-image.jpg`

    setMetaTags({
      title: fullTitle,
      description: description || `Фонд Чилгази - ${title || 'Поддержите развитие нашего посёлка'}`,
      ogTitle: fullTitle,
      ogDescription:
        description || `Фонд Чилгази - ${title || 'Поддержите развитие нашего посёлка'}`,
      ogUrl: window.location.href,
      ogImage: ogImageUrl,
    })
  })
}
