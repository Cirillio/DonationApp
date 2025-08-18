import type { BorderRadius } from '@/domain/app/app-radius/types'
import { BORDER_RADIUS } from '@/shared/config/radius'
import { RADIUS_TYPES } from '@/shared/config/radius'
import { DEFAULT_RADIUS } from '@/domain/app/app-radius/default'
import { ref, computed } from 'vue'

function updateCSSRadius(radius: BorderRadius) {
  if (typeof document !== 'undefined') {
    const cssValue = BORDER_RADIUS[radius]
    document.documentElement.style.setProperty('--radius', cssValue)
  }
}

const internalRadius = ref<BorderRadius>(getInitialRadius())

// Initialize CSS on module load
updateCSSRadius(internalRadius.value)

export function useRadiusConfig() {
  return computed<BorderRadius>({
    get: () => internalRadius.value,
    set(rad: BorderRadius) {
      if (RADIUS_TYPES.includes(rad)) {
        internalRadius.value = rad
        saveRadius(rad)
        updateCSSRadius(rad)
      } else {
        throw new Error('Invalid radius type')
      }
    },
  })
}

function getInitialRadius(): BorderRadius {
  const initialRadius = localStorage.getItem('app-radius')
  if (initialRadius && RADIUS_TYPES.includes(initialRadius as BorderRadius)) {
    return initialRadius as BorderRadius
  }
  return DEFAULT_RADIUS
}

function saveRadius(newRadius: BorderRadius) {
  localStorage.setItem('app-radius', newRadius)
}
