import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { MainNavigationLink } from '@/domain/app/navigation/types'
import { mainNavigationLinks } from '@/domain/main-navigation/config'

export const useMainNavigationStore = defineStore('mainNavigation', () => {
  const route = useRoute()

  // State
  const activeLink = ref<MainNavigationLink>()

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
  const setActiveLink = (linkName: string) => {
    activeLink.value = mainNavigationLinks.find((link) => link.name === linkName)
  }

  // Watch route changes
  watch(
    () => route.name,
    (newName) => {
      if (newName && typeof newName === 'string') {
        setActiveLink(newName)
      }
    },
    { immediate: true }
  )

  return {
    // State
    activeLink,
    // Getters
    links,
    activeIndex,
    prevLink,
    nextLink,
    canGoPrev,
    canGoNext,
    // Actions
    setActiveLink,
  }
})
