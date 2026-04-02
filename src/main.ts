import { createApp } from 'vue'
import App from './App.vue'

import './styles/global.scss'
// import './styles/reset.scss'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { i18n } from './i18n'
import router from './router'

const app = createApp(App)

app.use(Antd)
app.use(i18n)
app.use(router)

app.mount('#app')
