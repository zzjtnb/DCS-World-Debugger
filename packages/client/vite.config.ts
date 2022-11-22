import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 图标
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

import viteCompression from 'vite-plugin-compression'
import legacy from '@vitejs/plugin-legacy'

import Inspect from 'vite-plugin-inspect'

import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 服务端渲染
  server: {
    // 是否开启 https
    https: false,
    hmr: true,
    // 端口号
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    vue(),
    UnoCSS('unocss.config.ts'),
    Icons({
      // autoInstall: true,
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
      resolvers: [
        NaiveUiResolver(),
        IconsResolver(),
      ],
      imports: [
        // presets
        'vue',
        'vue-router',
        'pinia',
        {
          '@vueuse/core': [
            // named imports
            'useVModel', // import { useVModel } from '@vueuse/core',
          ],
        },
      ],
      dirs: [
        'src/hooks/**',
      ],
      // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
      dts: 'types/auto-import.d.ts',
    }),
    Components({
      // ui库解析器，也可以自定义
      resolvers: [
        NaiveUiResolver (),
        // 自动注册图标组件
        IconsResolver({
          // 自动引入的Icon组件统一前缀，默认为 i,设置false为不需要前缀
          prefix: 'icon',
          // prefix: false,
          // {prefix}-{collection}-{icon} 使用组件解析器时,您必须遵循名称转换才能正确推断图标
        }),
      ],
      // 用于搜索组件的目录的相对路径。
      dirs: ['src/components/auto', 'src/assets/svg', 'src/layout/components'],
      // 组件的有效文件扩展名
      extensions: ['vue', 'svg', 'ts'],
      // 搜索子目录
      deep: true,
      // 生成`components.d.ts` 全局声明文件
      dts: 'types/components.d.ts',
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
    }),
    viteCompression(),
    // 是否为打包后的文件提供传统浏览器兼容性支持
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
    // https://github.com/antfu/vite-plugin-inspect
    // Visit http://localhost:3000/__inspect/ to see the inspector
    Inspect(),
  ],
  optimizeDeps: {
    include: [],
    exclude: [],
  },
  build: {
    sourcemap: false,
    // brotliSize: false,
    // 消除打包大小超过500kb警告
    chunkSizeWarningLimit: 2000,
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
