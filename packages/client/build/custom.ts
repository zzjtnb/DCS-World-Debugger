// UnoCSS 是一个具有高性能且极具灵活性的即时原子化 CSS 引擎
import UnoCSS from 'unocss/vite'
// 自动导入 Icon 依赖
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
// 按需自动导入API
import AutoImport from 'unplugin-auto-import/vite'
// 按需自动导入组件
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
// import type { HtmlTagDescriptor } from 'vite'
import type { PreRenderedAsset } from 'rollup'
// rollup打包分析插件
// import { visualizer } from 'rollup-plugin-visualizer'

// 启用gzip压缩
// import { compression } from 'vite-plugin-compression2'

// 生成旧版兼容模式
// import type { Options as LegacyPluginOptions } from '@vitejs/plugin-legacy'
// import legacy from '@vitejs/plugin-legacy'

// function legacyPluginWithoutCrossOrigin(options: LegacyPluginOptions) {
//   const plugin = legacy(options)
//   plugin.forEach((item) => {
//     const origin = item.transformIndexHtml
//     if (typeof origin === 'function') {
//       item.transformIndexHtml = (html, context) => {
//         console.log(html)
//         const result = origin(html, context) as {
//           html: string
//           tags: HtmlTagDescriptor[]
//         }
//         result?.tags?.forEach((tag) => {
//           if (!tag.attrs)
//             return
//           delete tag.attrs.crossorigin
//           if (tag.attrs['data-src']) {
//             tag.children = `System.import('${tag.attrs['data-src']}')`
//             delete tag.attrs['data-src']
//           }
//         })
//         return result
//       }
//     }
//   })

//   return plugin
// }
// import Inspect from 'vite-plugin-inspect'
export function customPlugins(mode: string) {
  return [
    UnoCSS('unocss.config.ts'),

    Icons({
      autoInstall: true,
      // 缩放
      // Scale of icons against 1em
      scale: 1.2,
      // 编译方式
      // 'vue2', 'vue3', 'jsx'
      compiler: 'vue3',
      // 默认样式
      // Style apply to icons
      defaultStyle: '',
      // 默认类名
      // Class names apply to icons
      defaultClass: '',
    }),
    AutoImport({
      vueTemplate: true,
      imports: [
        'vue',
        'vue-i18n',
        'vue-router',
        'pinia',
        {

          'naive-ui': [
            'darkTheme',
            'lightTheme',
            'zhCN',
            'enUS',
            'dateZhCN',
            'dateEnUS',
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
            'NIcon',
            'createDiscreteApi',
          ],
          '@vueuse/core': [
            'isObject',
            'useVModel',
            'useClipboard',
          ],
        },
      ],
      dirs: [
        'src/api/**',
        'src/hooks/**',
        'src/stores/**',
      ],
      // 选择auto-import.d.ts生成的位置
      dts: 'types/auto/auto-import.d.ts',
    }),
    Components({
    // ui库解析器,也可以自定义
      resolvers: [
        NaiveUiResolver (),
        // 自动导入图标组件
        IconsResolver({
        // 自动引入的Icon组件统一前缀,默认为 i,设置false为不需要前缀
        // prefix: 'icon',
          prefix: false,
        // {prefix}-{collection}-{icon} 使用组件解析器时,您必须遵循名称转换才能正确推断图标
        }),
      ],
      // 用于搜索组件的目录的相对路径.
      dirs: ['src/components/auto', 'src/assets/svg', 'src/layout/components'],
      // 组件的有效文件扩展名
      extensions: ['vue', 'svg', 'ts'],
      // 搜索子目录
      deep: true,
      // 指令的自动导入
      // 默认值:Vue 3 的`true`,Vue 2 的`false`
      directives: true,
      // 允许子目录作为组件的命名空间前缀
      directoryAsNamespace: false,
      // 忽略命名空间前缀的子目录路径
      // 当`directoryAsNamespace: true` 时有效
      globalNamespaces: [],
      // 用于转换目标的过滤器
      include: [/\.vue$/, /\.vue\?vue/, /\.svg$/],
      exclude: ['src/components/exclude'],
      // 生成`components.d.ts` 全局声明文件
      dts: 'types/auto/components.d.ts',
    }),
    // 是否为打包后的文件提供传统浏览器兼容性支持
    // legacy({
    //   targets: ['ie >= 11'],
    //   additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    // }),
    // legacyPluginWithoutCrossOrigin({
    //   targets: ['defaults', 'not IE 11'],
    //   renderModernChunks: false,
    // }),
    // 启用gzip压缩
    // compression(),
    // https://github.com/antfu/vite-plugin-inspect
    // Visit http://localhost:3000/__inspect/ to see the inspector
    // Inspect(),
  ]
}

export function customBuildOptions(mode: string) {
  return {
    // 配置esbuild
    esbuild: {
    // esbuild生产环境移除console和debugger
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    build: {
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        // plugins: [
        //   visualizer({
        //     gzipSize: true,
        //     emitFile: false,
        //     open: true, // 如果存在本地服务端口，将在打包后自动展
        //   }),
        // ],
        output: {
          // 入口文件命名模式，使用 [name] 表示文件名，[hash] 表示哈希值
          entryFileNames: 'js/[name]-[hash].js',
          // 分块文件命名模式，使用 [name] 表示文件名，[hash] 表示哈希值
          chunkFileNames: 'js/[name]-[hash].js',
          // 确定资产文件命名模式的函数
          assetFileNames: (assetInfo: PreRenderedAsset) => {
            // 获取资产文件的扩展名
            const extType = assetInfo.name?.split('.').pop() || 'defaultExtension'
            // 根据扩展名匹配不同的命名模式
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return 'images/[name]-[hash][extname]'
            }
            if (/css/i.test(extType)) {
              return 'css/[name]-[hash][extname]'
            }
            if (/js/i.test(extType)) {
              return 'js/[name]-[hash][extname]'
            }
            if (/ttf|woff|eot|otf/i.test(extType)) {
              return 'fonts/[name]-[hash][extname]'
            }
            return 'media/[name]-[hash][extname]'
          },
          // 确定手动分块策略的函数
          manualChunks(id: string | string[]) {
            // 如果 id 包含 'node_modules'，则将其分到 'vendor' 分块中
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
        },
      },
    },
  }
}
