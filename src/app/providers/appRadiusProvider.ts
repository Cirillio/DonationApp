import { App } from 'vue'
import { useRadiusConfig } from '@/features/app-radius/composables/useRadiusConfig'

export const appRadiusProvider = {
  install(app: App) {
    const radiusConfig = useRadiusConfig()

    app.provide('radiusConfig', radiusConfig)

    app.config.globalProperties.$radiusConfig = radiusConfig
  },
}
