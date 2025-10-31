/**
 * Композабл для управления SEO и meta тегами
 */
export function useSEO() {
  /**
   * Устанавливает meta теги для страницы
   */
  const setMetaTags = (options: {
    title?: string
    description?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
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
