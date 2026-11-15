import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createAppRouter } from './router.js'
import { useThemeStore } from './stores/theme.js'
import './style.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
useThemeStore(pinia).init()
app.use(createAppRouter())
app.mount('#app')
