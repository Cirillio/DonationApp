import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { MainNavigationLink } from '@/lib/types'
import { mainNavigationLinks } from '@/lib/constants'
import type { TransitionDirection } from '@/lib/types'

export const useMainNavigationStore = defineStore('mainNavigation', () => {
  const router = useRouter()

  // State
  const activeLink = ref<MainNavigationLink>()
  const transitionDirection = ref<TransitionDirection>('slide-initial')

  // Getters
  const links = computed(() => {
    return mainNavigationLinks.map((link) => ({
      ...link,
      active: link.name === activeLink.value?.name,
    }))
  })

  const activeIndex = computed(() => {
    if (!activeLink.value) return -1
    return mainNavigationLinks.findIndex((link) => link.name === activeLink.value?.name)
  })

  const prevLink = computed<MainNavigationLink | undefined>(() => {
    if (activeIndex.value > 0) {
      return mainNavigationLinks[activeIndex.value - 1]
    }
    return undefined
  })

  const nextLink = computed<MainNavigationLink | undefined>(() => {
    if (activeIndex.value > -1 && activeIndex.value < mainNavigationLinks.length - 1) {
      return mainNavigationLinks[activeIndex.value + 1]
    }
    return undefined
  })

  const canGoPrev = computed(() => !!prevLink.value)
  const canGoNext = computed(() => !!nextLink.value)

  // Actions
  const getIndexByName = (name: string | undefined): number => {
    if (!name) return -1
    return mainNavigationLinks.findIndex((link) => link.name === name)
  }

  const setActiveLink = (linkName: string) => {
    activeLink.value = mainNavigationLinks.find((link) => link.name === linkName)
  }

  const setTransition = (toName: string | undefined, fromName: string | undefined) => {
    // Если это первый переход
    if (!fromName) {
      transitionDirection.value = 'slide-initial'
      return
    }

    const toIndex = getIndexByName(toName)
    const fromIndex = getIndexByName(fromName)

    // Если одна из страниц не главная (не в навигации), используем initial
    if (toIndex === -1 || fromIndex === -1) {
      transitionDirection.value = 'slide-initial'
      return
    }

    // Если обе страницы главные, определяем направление
    transitionDirection.value = toIndex > fromIndex ? 'slide-down' : 'slide-up'
  }

  const goNext = () => {
    if (nextLink.value && canGoNext.value) router.push(nextLink.value.url)
  }

  const goPrev = () => {
    if (prevLink.value && canGoPrev.value) router.push(prevLink.value.url)
  }

  return {
    // State
    activeLink,
    transitionDirection,
    // Getters
    links,
    activeIndex,
    prevLink,
    nextLink,
    canGoPrev,
    canGoNext,
    // Actions
    setActiveLink,
    setTransition,
    goNext,
    goPrev,
  }
})
