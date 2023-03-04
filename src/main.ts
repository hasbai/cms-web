import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/plugins/router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import '@/css/index.css'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(router)

const vuetify = createVuetify({})
app.use(vuetify)

app.mount('#app')
