import { inject } from 'vue'
import type { WritableComputedRef } from 'vue'
import { BorderRadius } from '@/domain/app/app-radius/types'

export function useAppRadius(): WritableComputedRef<BorderRadius> {
  const radiusConfig = inject<WritableComputedRef<BorderRadius>>('radiusConfig')

  if (!radiusConfig) {
    throw new Error('radiusConfig is not provided')
  }

  return radiusConfig
}
