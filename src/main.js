import {createApp} from 'vue'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "./router/index.js";
import './assets/public.scss'
import _ from 'lodash';
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)
pinia.use(piniaPluginPersistedstate)
app.config.globalProperties.$lodash = _;
app.use(ElementPlus)
app.use(pinia)

app.use(router)
app.mount('#app')

