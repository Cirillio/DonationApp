/**
 * Композабл для управления SEO и meta тегами
 *
 * @description
 * Управляет установкой meta тегов для страницы, включая Open Graph теги
 * для социальных сетей. Автоматически создает недостающие теги.
 *
 * @example
 * const { setMetaTags } = useSEO()
 *
 * setMetaTags({
 *   title: 'Название страницы',
 *   description: 'Описание страницы',
 *   ogTitle: 'Название для соцсетей',
 *   ogDescription: 'Описание для соцсетей',
 *   ogImage: 'https://example.com/image.jpg',
 *   ogUrl: 'https://example.com/page'
 * })
 */
export function useSEO() {
  /**
   * Устанавливает meta теги для страницы
   *
   * @param options - Объект с meta тегами для установки
   */
  const setMetaTags = (options: {
    /** Title страницы */
    title?: string
    /** Meta description */
    description?: string
    /** Open Graph title */
    ogTitle?: string
    /** Open Graph description */
    ogDescription?: string
    /** Open Graph image URL */
    ogImage?: string
    /** Open Graph URL */
    ogUrl?: string
  }) => {
    const { title, description, ogTitle, ogDescription, ogImage, ogUrl } = options

    // Title
    if (title) {
      document.title = title
    }

    // Description
    const updateOrCreateMeta = (name: string, content: string, attribute = 'name') => {
      let meta = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Meta description
    if (description) {
      updateOrCreateMeta('description', description)
    }

    // Open Graph tags
    if (ogTitle || title) {
      updateOrCreateMeta('og:title', ogTitle || title || '', 'property')
    }

    if (ogDescription || description) {
      updateOrCreateMeta('og:description', ogDescription || description || '', 'property')
    }

    if (ogImage) {
      updateOrCreateMeta('og:image', ogImage, 'property')
    }

    if (ogUrl) {
      updateOrCreateMeta('og:url', ogUrl, 'property')
    }
  }

  return {
    setMetaTags,
  }
}
