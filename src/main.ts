import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import VueTheMask from 'vue-the-mask'
import router from './router'
import App from './App.vue'
import '@/styles/style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(VueTheMask as any)
app.use(autoAnimatePlugin)
app.use(pinia)
app.use(router)

app.mount('#app')
