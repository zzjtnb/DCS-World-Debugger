import { createApp } from 'vue'

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
import 'highlight.js/styles/atom-one-dark.css'
/** 引入uno.css，不引入不生效 */
import 'uno.css'

// 将pinia实例传递给app实例,在此之后使用useStore钩子会自动注入pinia实例,否则需要在useStore中手动注入
import pinia from '@/stores'
import i18n from '@/plugins/i18n'

const app = createApp(App)

app.use(pinia)
app.use(i18n)
app.use(router)

app.mount('#app')
