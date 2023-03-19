import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/plugins/router'
import { createVuetify } from 'vuetify'
import { registerPinia } from '@/plugins/store'

import '@/css/index.css'
import 'vuetify/styles'
import '@milkdown/theme-nord/style.css'

const app = createApp(App)

registerPinia(app)
app.use(router)
app.use(createVuetify({}))

app.mount('#app')
