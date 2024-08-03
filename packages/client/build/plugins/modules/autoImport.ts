/**
 * 自动引入和组件自动注册
 */

// 自动导入 Icon 依赖
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

// 按需自动导入API
import AutoImport from 'unplugin-auto-import/vite'
// 按需自动导入组件
import Components from 'unplugin-vue-components/vite'
// 按需加载 naive-ui
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export function autoImportPlugins() {
  return [
    Icons({
      /**
       * 自定义图标加载器集合
       * https://github.com/unplugin/unplugin-icons?tab=readme-ov-file#custom-icons
       */
      customCollections: {
        lc: FileSystemIconLoader(
          'src/assets/icons',
          (svg) => {
            // 删除path元素的fill属性
            svg = svg.replace(/<path[^>]*>/g, (match) => {
              return match.replace(/fill="[^"]*"/g, 'fill=""')
            })
            // 添加fill属性为currentColor
            svg = svg.replace(/<svg /, '<svg fill="currentColor" ')
            return svg
          },
        ),
      },
    }),
    AutoImport({
      /**
       * 预设名称或自定义导入映射
       *
       * @default []
       */
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
            'createDiscreteApi',
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
            'NTag',
            'NIcon',
            'NButton',
            'NTooltip',
            'NColorPicker',

          ],
          '@vueuse/core': [
            'isObject',
            'useVModel',
            'useClipboard',
            'onClickOutside',
          ],
        },
        {
          from: 'vue',
          imports: ['VNodeChild'],
          type: true,
        },
        {
          from: 'vue-router',
          imports: ['RouteRecordRaw'],
          type: true,
        },
        {
          from: 'naive-ui',
          imports: ['MenuOption', 'DataTableColumns', 'RowData', 'UploadFileInfo', 'FormInst', 'FormItemRule'],
          type: true,
        },
      ],
      /**
       * 要自动导入的目录路径
       */
      dirs: [
        'src/api/**',
        'src/hooks/**',
        'src/stores/**',
      ],
      /**
       * 用于生成对应的.d.ts文件的文件路径.
       * 默认情况下,当本地安装了`typescript`时启用.
       * 设置为`false`以禁用.
       *
       * @default './auto-imports.d.ts'
       */
      dts: 'types/auto/auto-import.d.ts',
      /**
       * 在Vue模板中自动导入
       * @default false
       */
      vueTemplate: true,
    }),
    Components({
      // 用于匹配要转换的文件的正则表达式或glob模式
      include: [/\.vue$/, /\.vue\?vue/, /\.svg$/],
      // 用于匹配不要转换的文件的正则表达式或glob模式
      exclude: ['src/components/exclude'],
      // 用于搜索组件的目录的相对路径.默认为'src/components'
      dirs: ['src/components/auto', 'src/assets/icons', 'src/layout/**/components'],
      // 组件的有效文件扩展名
      extensions: ['vue', 'svg', 'ts'],
      // 搜索子目录
      deep: true,
      // ui库解析器,也可以自定义
      resolvers: [
        NaiveUiResolver (),
        // 自动导入图标组件
        IconsResolver({
          // https://github.com/unplugin/unplugin-icons?tab=readme-ov-file#collection-aliases
          alias: {
            fas: 'fa-solid',
          },
          // https://github.com/unplugin/unplugin-icons?tab=readme-ov-file#use-with-resolver
          customCollections: ['lc'],
        }),
      ],
      //  生成全局组件的TypeScript声明文件
      dts: 'types/auto/components.d.ts',
      types: [{
        from: 'vue-router',
        names: ['RouterLink', 'RouterView'],
      }],
    }),
  ]
}
