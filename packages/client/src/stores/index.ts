import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export * from './modules/menu'
export * from './modules/lua'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
