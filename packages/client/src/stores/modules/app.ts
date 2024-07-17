export const useAppStore = defineStore({
  id: 'app',
  state: () => ({
    theme: 'light' as ThemeType,
    locale: 'zh-CN' as LocaleType, // 明确类型,
    provider: {
      notification: {
        max: 1,
      },
    },
  }),
  getters: {
    getTheme: state => state.theme === 'dark' ? darkTheme : lightTheme,
    getLocale: state => state.locale === 'zh-CN' ? zhCN : enUS,
    getDateLocale: state => state.locale === 'zh-CN' ? dateZhCN : dateEnUS,
  },
  actions: {},
  persist: {
    key: 'menu',
    paths: ['theme', 'locale'],
  },
})
