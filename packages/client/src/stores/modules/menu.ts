export const useMenuStore = defineStore({
  id: 'menu',
  state: () => ({
    theme: 'light' as ThemeType,
    locale: 'zh-CN' as LocaleType, // 明确类型,
  }),
  actions: {},
  persist: {
    key: 'menu',
    paths: ['theme', 'locale'],
  },
})
