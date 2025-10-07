import { defineStore } from 'pinia'
import { useAppRadius } from '@/app/composables/useAppRadius'
import { RADIUS_TYPES } from '@/domain/app/app-radius/config'
import { BORDER_RADIUS } from '@/domain/app/app-radius/config'
import type { BorderRadius } from '@/domain/app/app-radius/types'
import { computed } from 'vue'

const createAppRadiusStore = () => {
  const radius = useAppRadius()

  const currentRadius = computed(() => BORDER_RADIUS[radius.value].replace('rem', ''))

  const setRadius = (newRadius: BorderRadius) => {
    radius.value = newRadius
  }

  const setMoreRadius = () => {
    const currentRadiusIndex = RADIUS_TYPES.indexOf(radius.value)
    const nextRadiusIndex = (currentRadiusIndex + 1) % RADIUS_TYPES.length
    const nextRadius = RADIUS_TYPES[nextRadiusIndex]
    setRadius(nextRadius)
  }

  const setLessRadius = () => {
    const currentRadiusIndex = RADIUS_TYPES.indexOf(radius.value)
    const prevRadiusIndex = (currentRadiusIndex - 1 + RADIUS_TYPES.length) % RADIUS_TYPES.length
    const prevRadius = RADIUS_TYPES[prevRadiusIndex]
    setRadius(prevRadius)
  }

  const canGoNext = computed(() => {
    const currentIndex = RADIUS_TYPES.indexOf(radius.value)
    return currentIndex < RADIUS_TYPES.length - 1
  })

  const canGoPrev = computed(() => {
    const currentIndex = RADIUS_TYPES.indexOf(radius.value)
    return currentIndex > 0
  })

  return { setMoreRadius, setLessRadius, canGoNext, canGoPrev, currentRadius }
}

export const useAppRadiusStore = defineStore('appRadius', createAppRadiusStore)
