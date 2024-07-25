// 生成旧版兼容模式
import type { HtmlTagDescriptor } from 'vite'
import type { Options as LegacyPluginOptions } from '@vitejs/plugin-legacy'
import legacy from '@vitejs/plugin-legacy'

function legacyPluginWithoutCrossOrigin(options: LegacyPluginOptions) {
  const plugin = legacy(options)
  plugin.forEach((item) => {
    const origin = item.transformIndexHtml
    if (typeof origin === 'function') {
      item.transformIndexHtml = (html, context) => {
        const result = origin(html, context) as {
          html: string
          tags: HtmlTagDescriptor[]
        }
        result?.tags?.forEach((tag) => {
          if (!tag.attrs)
            return
          delete tag.attrs.crossorigin
          if (tag.attrs['data-src']) {
            tag.children = `System.import('${tag.attrs['data-src']}')`
            delete tag.attrs['data-src']
          }
        })
        return result
      }
    }
  })

  return plugin
}

export function legacyPlugin() {
  // return [
  //   /*
  //     是否为打包后的文件提供传统浏览器兼容性支持
  //     legacy({
  //       targets: ['ie >= 11'],
  //     })
  //   */
  // ]
  return legacyPluginWithoutCrossOrigin({
    targets: ['defaults', 'not IE 11'],
    renderModernChunks: false,
  })
}
