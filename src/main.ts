import './assets/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
const pinia = createPinia()
const toastOptions: PluginOptions = {
    position: POSITION.BOTTOM_RIGHT
}
app.use(Toast, toastOptions)
app.use(pinia)
app.mount('#app')
