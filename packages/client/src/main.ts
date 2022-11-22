import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

/** 重置样式 这里引入自定义的重置样式也可 */
import '@/assets/reset/normalize.css'
import '@/assets/fonts/fonts.css'
/**
 *  项目内的样式，
 *  注意：最好放在重置样式后，uno.css前
 */
// import './style.css'
/** 引入uno.css，不引入不生效 */
import 'uno.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
