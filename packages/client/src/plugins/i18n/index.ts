import { createI18n } from 'vue-i18n'
import type { Composer, Locale } from 'vue-i18n'

import options from './options'

const i18n = createI18n(options)

/**
 * 设置 i18n 实例的语言环境。
 *
 * @param {Locale} locale - 要设置的语言环境。
 * @return {void} 此函数不返回任何值。
 */
export function setLocale(locale: Locale): void {
  if (i18n.mode === 'legacy')
    (i18n.global).locale = locale
  else
    (i18n.global as unknown as Composer).locale.value = locale
}

export function setHtmlPageLang(locale: LocaleType) {
  document.querySelector('html')?.setAttribute('lang', locale)
}
/**
 * 设置 i18n 实例的语言环境，并更新 HTML 元素的 lang 属性。
 *
 * @param {Locale} locale - 要设置的语言环境。
 * @return {void} 此函数不返回任何值。
 */
export function setI18nLanguage(locale: LocaleType) {
  setLocale(locale)
  setHtmlPageLang(locale)
}

export default i18n
