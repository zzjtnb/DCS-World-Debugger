/**
 * 自动引入和组件自动注册
 */

// 自动导入 Icon 依赖
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
// 按需自动导入API
import AutoImport from 'unplugin-auto-import/vite'
// 按需自动导入组件
import Components from 'unplugin-vue-components/vite'
// 按需加载 naive-ui
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export function autoImportPlugins() {
  return [
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
        // prefix: false,
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
  ]
}
