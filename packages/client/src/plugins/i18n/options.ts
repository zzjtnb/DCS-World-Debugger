import { createPinia } from 'pinia'
import type { I18nOptions } from 'vue-i18n'
import { getLanguage, loadLanguages } from '@/utils/language'

const context = import.meta.glob('./locales/*.ts', { eager: true })

const messages = loadLanguages(context)
const menuStore = useMenuStore(createPinia())

const options = {
  // you must set `false`, to use Composition API
  legacy: false,
  // 隐含注入的属性和函数
  globalInjection: true,
  // 设置地区
  locale: menuStore.locale ?? getLanguage(messages),
  // 回退本地化(选择首选语言缺少翻译时要使用的语言)
  fallbackLocale: 'eh-US',
  // 消除警告
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  missingWarn: false,
  fallbackWarn: false,

  // 设置地区信息
  messages,
  datetimeFormats: {
    'zh-CN': {
      short: {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
        timezone: 'Asia/Shanghai',
      },
    },
    'en-US': {
      short: {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
        timezone: 'Asia/Shanghai',
      },
    },
  },
  numberFormats: {
    'zh-CN': {
      currency: {
        style: 'currency',
        currencyDisplay: 'symbol',
        currency: 'RMB',
      },
    },
    'en-US': {
      currency: {
        style: 'currency',
        currencyDisplay: 'symbol',
        currency: 'RMB',
      },
    },
  },
} as I18nOptions

export default options
