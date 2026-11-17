import { createApp } from 'vue'
import './assets/main.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/dist/locale/zh-cn'
import App from './App.vue'
import router from './router'
import pinia from './pinia'
createApp(App).use(ElementPlus, { locale }).use(router).use(pinia).mount('#app')
