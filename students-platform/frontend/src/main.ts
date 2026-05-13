import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { useSessionStore } from './store/session'

import './assets/styles.css'


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// Restore session before mounting the app
const sessionStore = useSessionStore()
sessionStore.restoreSession()
    .catch(err => {
    })
    .finally(() => {
        app.mount('#app')
    })

