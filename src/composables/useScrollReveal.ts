/**
 * Композабл для анимации появления элементов при скролле
 *
 * @description
 * Автоматически отслеживает появление элементов в viewport с помощью IntersectionObserver
 * и применяет fade-in анимацию. Поддерживает как одиночные элементы, так и группы
 * с последовательным появлением (stagger effect).
 *
 * @example
 * // Базовое использование для одного элемента
 * const { createRevealRef } = useScrollReveal({
 *   rootMargin: '-50px',
 *   duration: 600
 * })
 * const { elementRef } = createRevealRef()
 *
 * @example
 * // Использование с несколькими элементами и задержкой
 * const { createStaggerRevealRef } = useScrollReveal({
 *   rootMargin: '-50px',
 *   duration: 600,
 *   staggerDelay: 100
 * })
 * const { containerRef } = createStaggerRevealRef()
 *
 * @template
 * <div ref="elementRef">
 *   <h2>Заголовок</h2>
 * </div>
 *
 * @template
 * <div ref="containerRef">
 *   <Card v-for="item in items" :key="item.id">...</Card>
 * </div>
 */
import { ref, onMounted, onUnmounted } from 'vue'

export interface ScrollRevealOptions {
  /**
   * Root margin для IntersectionObserver (например, "0px", "-100px 0px", etc.)
   * @default "-50px"
   */
  rootMargin?: string
  /**
   * Пороговое значение для срабатывания
   * @default 0.1
   */
  threshold?: number
  /**
   * Длительность анимации в ms
   * @default 600
   */
  duration?: number
  /**
   * Интервал между дочерними элементами в ms (для stagger)
   * @default 100
   */
  staggerDelay?: number
}

/**
 * Создает анимацию появления для одного элемента
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { rootMargin = '-50px', threshold = 0.1, duration = 600, staggerDelay = 100 } = options

  /**
   * Создает ref с автоматической анимацией при появлении элемента
   *
   * @returns {Object} Объект с elementRef для привязки к элементу
   *
   * @example
   * const { elementRef } = createRevealRef()
   * // <div ref="elementRef">...</div>
   */
  const createRevealRef = () => {
    const elementRef = ref<HTMLElement | null>(null)

    onMounted(() => {
      if (!elementRef.value) return

      // Добавляем начальное состояние
      elementRef.value.classList.add('opacity-0')
      ;(elementRef.value as any).style.setProperty('transition-duration', `${duration}ms`)

      // Используем IntersectionObserver для отслеживания появления
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement
              element.classList.remove('opacity-0')
              element.classList.add('opacity-100')

              // Удаляем transition-duration после завершения анимации
              const handleTransitionEnd = () => {
                element.style.removeProperty('transition-duration')
                element.removeEventListener('transitionend', handleTransitionEnd)
              }
              element.addEventListener('transitionend', handleTransitionEnd)
            }
          })
        },
        { rootMargin, threshold }
      )

      observer.observe(elementRef.value)

      onUnmounted(() => {
        observer.disconnect()
      })
    })

    return { elementRef }
  }

  /**
   * Создает анимацию для массива элементов с задержкой (stagger effect)
   *
   * @returns {Object} Объект с containerRef для привязки к контейнеру
   *
   * @example
   * const { containerRef } = createStaggerRevealRef()
   * // <div ref="containerRef">
   * //   <Card v-for="item in items" :key="item.id">...</Card>
   * // </div>
   */
  const createStaggerRevealRef = () => {
    const containerRef = ref<HTMLElement | null>(null)

    onMounted(() => {
      if (!containerRef.value) return

      const elements = Array.from(containerRef.value.children) as HTMLElement[]

      elements.forEach((element, index) => {
        // Добавляем начальное состояние
        element.classList.add('opacity-0')
        ;(element as any).style.setProperty('transition-duration', `${duration}ms`)
        ;(element as any).style.setProperty('transition-delay', `${index * staggerDelay}ms`)

        // Используем IntersectionObserver для отслеживания появления
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const element = entry.target as HTMLElement
                element.classList.remove('opacity-0')
                element.classList.add('opacity-100')

                // Удаляем transition-duration и transition-delay после завершения анимации
                const handleTransitionEnd = () => {
                  element.style.removeProperty('transition-duration')
                  element.style.removeProperty('transition-delay')
                  element.removeEventListener('transitionend', handleTransitionEnd)
                }
                element.addEventListener('transitionend', handleTransitionEnd)
              }
            })
          },
          { rootMargin, threshold }
        )

        observer.observe(element)

        onUnmounted(() => {
          observer.disconnect()
        })
      })
    })

    return { containerRef }
  }

  return {
    createRevealRef,
    createStaggerRevealRef,
  }
}
