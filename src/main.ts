import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import router from './router'
import App from './App.vue'
import '@/styles/style.css'
import { vMaska } from 'maska/vue'

const app = createApp(App)
const pinia = createPinia()
app.use(autoAnimatePlugin)
app.use(pinia)
app.use(router)
app.directive('maska', vMaska)
app.mount('#app')
