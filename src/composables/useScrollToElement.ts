/**
 * Композабл для программной прокрутки к элементу
 *
 * @description
 * Специализированный composable для прокрутки к элементу на мобильных устройствах.
 * Используется преимущественно для автоматической прокрутки к формам доната
 * при переключении шагов на мобильных устройствах.
 *
 * @example
 * const { scrollTo, isMobile } = useScrollToElement({
 *   mobileBreakpoint: 768,
 *   behavior: 'smooth'
 * })
 *
 * // Прокрутка к элементу
 * scrollTo(formElementRef.value)
 *
 * // Проверка типа устройства
 * if (isMobile()) {
 *   // логика для мобильных
 * }
 *
 * @note
 * В текущей реализации прокрутка работает только на мобильных устройствах
 * (ширина экрана меньше mobileBreakpoint). Параметры mobileOffset и desktopOffset
 * зарезервированы для будущего использования.
 */
interface ScrollOptions {
  /**
   * Смещение от верхнего края для мобильных устройств (зарезервировано)
   * @default undefined
   */
  mobileOffset?: number
  /**
   * Смещение от верхнего края для десктопов (зарезервировано)
   * @default undefined
   */
  desktopOffset?: number
  /**
   * Брейкпоинт для определения мобильного устройства
   * @default 768
   */
  mobileBreakpoint?: number
  /**
   * Тип поведения прокрутки
   * @default 'smooth'
   */
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
