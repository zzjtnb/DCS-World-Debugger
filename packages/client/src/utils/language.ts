/**
 * 从给定的上下文对象加载语言，并将其作为字典返回。
 *
 * @param {Record<string, any>} context - 包含语言文件的上下文对象。
 * @return {Record<string | number | symbol, any>} - 一个字典，其中键是语言名称，值是语言对象。
 */
export function loadLanguages(context: Record<string, any>) {
  const languages: Record<string | number | symbol, any> = {}
  const langs = Object.keys(context)
  for (const key of langs) {
    const lang = context[key].default
    const name = key.replace(/(\.\/locales\/|\.ts)/g, '')
    languages[name] = lang
  }
  return languages
}
/**
 * 从浏览器的语言设置中获取语言。
 *
 * @param {Record<string, unknown>} messages - 语言消息的字典。
 * @return {string} - 语言代码。
 */
export function getLanguage(messages: Record<string, unknown>) {
  // if has not choose language
  const language = navigator.language
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.includes(locale))
      return locale
  }
  return 'en-US'
}
