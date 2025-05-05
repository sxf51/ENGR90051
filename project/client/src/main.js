import { createApp } from 'vue' 
import App from './App.vue'
import router from './router'    // 导入路由配置
import axios from 'axios'        // 导入HTTP客户端

// 如果是Vue 2项目需要安装vue2-leaflet，Vue 3则用vue3-leaflet
import { LMap, LTileLayer, LMarker, LPopup } from 'vue3-leaflet'  
import 'leaflet/dist/leaflet.css'

// 创建Vue应用实例
const app = createApp(App)

// 配置axios
axios.defaults.baseURL = 'http://localhost:3000/api'
app.config.globalProperties.$axios = axios

// 全局注册Leaflet组件（Vue 3方式）
app.component('LMap', LMap)
app.component('LTileLayer', LTileLayer)
app.component('LMarker', LMarker)
app.component('LPopup', LPopup)

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')
