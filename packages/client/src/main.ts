import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { setupNaiveDiscreteApi } from '@/utils/globalMessage'

/** 重置样式 这里引入自定义的重置样式也可 */
// import '@/assets/reset/normalize.scss'
// import '@/assets/fonts/fonts.scss'
/**
 *  项目内的样式，
 *  注意：最好放在重置样式后，uno.css前
 */
import 'highlight.js/styles/atom-one-dark.css'
import 'virtual:uno.css'

// 将pinia实例传递给app实例,在此之后使用useStore钩子会自动注入pinia实例,否则需要在useStore中手动注入
import pinia from '@/stores'
import i18n from '@/plugins/i18n'

const app = createApp(App)

app.use(pinia)
app.use(i18n)
app.use(router)

// 必须在 createApp 之后
setupNaiveDiscreteApi()
app.mount('#app')
