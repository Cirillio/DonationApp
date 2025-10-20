import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { appThemeProvider } from './app/providers/appThemeProvider'
import { appRadiusProvider } from './app/providers/appRadiusProvider'

import VueTheMask from 'vue-the-mask'
import router from './app/providers/router'
import App from './app/App.vue'
import '@/shared/styles/style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(VueTheMask as any)
app.use(autoAnimatePlugin)
app.use(router)
app.use(pinia)
app.use(appRadiusProvider)

appThemeProvider()

app.mount('#app')
