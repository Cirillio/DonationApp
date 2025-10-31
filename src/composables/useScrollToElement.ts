// composables/useScrollToElement.ts

interface ScrollOptions {
  mobileOffset?: number
  desktopOffset?: number
  mobileBreakpoint?: number
  behavior?: ScrollBehavior
}

export const useScrollToElement = (options: ScrollOptions = {}) => {
  const { mobileBreakpoint = 768, behavior = 'smooth' } = options

  const isMobile = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < mobileBreakpoint
    }
    return false
  }

  const scrollTo = (element: HTMLElement | null) => {
    if (!element || typeof window === 'undefined') return

    const isMobileDevice = isMobile()

    // Прокрутка работает только на мобиле
    if (!isMobileDevice) return

    // На мобиле: скролл до начала карточки
    element.scrollIntoView({
      behavior,
      block: 'start',
      inline: 'nearest',
    })
  }

  return {
    scrollTo,
    isMobile,
  }
}
