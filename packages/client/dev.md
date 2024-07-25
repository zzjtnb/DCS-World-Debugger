# Vue3

[unocss 中文文档](https://unocss-cn.pages.dev)
[unocss 练习场](https://unocss.dev/play)
[unocss 交互式文档](https://unocss.dev/interactive)
[unocss本地调试](http://localhost:3000/__unocss)
[Tailwind 组件](https://tailwindcomponents.com)

## 图标

[icones](https://icones.js.org)
[fontawesome](https://fontawesome.com)

## 命令

```bash
# 升级依赖到 latest
pnpm up -L
```

## 安装依赖

### 基础依赖

#### pinia

[官网](https://pinia.vuejs.org/zh/)

```bash
pnpm add pinia

```

#### pinia-plugin-persistedstate

[官网](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/)

Pinia 持久化存储插件

```bash
pnpm add pinia-plugin-persistedstate
```

#### VueUse

[官网](https://vueuse.org/)

基于Vue组合式API的实用工具集

```bash
pnpm i @vueuse/core
```

#### sass

[GitHub](https://github.com/sass/dart-sass)

```bash
pnpm i -D sass
```

#### Unocss

[官网](https://unocss.dev/)

UnoCSS 是一个具有高性能且极具灵活性的即时原子化 CSS 引擎

```bash
# 安装 Unocss
pnpm i -D unocss

# 将 unocss 自带的 rem 转换为 px
# https://unocss-cn.pages.dev/presets/rem-to-px
pnpm add -D @unocss/preset-rem-to-px

# 安装所有 Unocss 依赖
pnpm i -D unocss @unocss/preset-rem-to-px
```

#### unplugin 自动导入

|          插件           |       概念       |                 自动导入对象                  |
| :---------------------: | :--------------: | :-------------------------------------------: |
|     unplugin-icons      | 按需自动加载图标 |          Iconify图标集合和自定义图标          |
|  unplugin-auto-import   | 按需自动导入API  |       ref,reactive,watch,computed 等API       |
| unplugin-vue-components | 按需自动导入组件 | Element Plus 等三方库和指定目录下的自定义组件 |

```bash
# 按需自动加载图标
pnpm i -D unplugin-icons
# 按需自动导入API
pnpm i -D unplugin-auto-import
# 按需自动导入组件
pnpm i -D unplugin-vue-components

```

##### unplugin-icons

[Github](https://github.com/unplugin/unplugin-icons)

按照约定导入图标名称`~icons/{collection}/{icon}`并直接将其用作组件

```vue
<script setup>
import Fa6SolidGlobe from '~icons/fa6-solid/globe'
</script>

<template>
  <Fa6SolidGlobe />
</template>
```

使用组件解析器时,必须遵循名称转换才能正确推断图标.
`{prefix}-{collection}-{icon}`

- 默认情况下,前缀(prefix)设置为`i`
- 集合(collection)字段遵循 [Iconify](https://icon-sets.iconify.design/) 的集合 ID

```vue
<template>
  <IFa6SolidFile style=" color: red;font-size: 2em" />
</template>
```

###### 自定义图标

主要的配置是在 customCollections 中新增一个键值对,key 为图标集合名称,value 则为导入的图标

```ts
import { promises as fs } from 'node:fs'
// loader helpers
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
Icons({
  customCollections: {
    // 自定义图标集合的名称
    'my-icons': {
      account: '<svg><!-- ... --></svg>',
      // 异步加载自定义图标
      settings: () => fs.readFile('./path/to/my-icon.svg', 'utf-8'),
    },
    'my-other-icons': async (iconName) => {
      // 自定义加载器,可以执行任何操作
      // 例如,从远程服务器获取图标:
      return await fetch(`https://example.com/icons/${iconName}.svg`).then(res => res.text())
    },
    // 从文件系统加载图标的帮助函数
    // 位于`./assets/icons`目录下的所有带有`.svg`扩展名的文件都将被加载,并以其文件名作为图标名称
    // 您还可以提供一个转换回调函数来更改每个图标(可选)
    'my-yet-other-icons': FileSystemIconLoader(
      './assets/icons',
      svg => svg.replace(/^<svg /, '<svg fill="currentColor" '),
    ),
  },
})
```

然后使用

```ts
import IconAccount from '~icons/my-icons/account'
import IconFoo from '~icons/my-other-icons/foo'
import IconBar from '~icons/my-yet-other-icons/bar'
```

💡 SVG 创作技巧:

- 为了使图标颜色适应性强,请在 SVG 中设置fill="currentColor"或stroke="currentColor".
- 如果您不指定height和width,我们将为您设置.

###### Icons 所有选项

```ts
/**
 * 选项接口
 */
interface Options {
/**
 * 图标相对于1em的缩放比例
 *
 * @default 1.2
 */
  scale?: number
  /**
   * 图标默认样式
   *
   * @default ''
   */
  defaultStyle?: string
  /**
   * 图标默认类名
   *
   * @default ''
   */
  defaultClass?: string
  /**
   * 自定义图标加载器集合
   */
  customCollections?: Record<string, CustomIconLoader | InlineCollection>
  /**
   * 图标自定义器
   */
  iconCustomizer?: IconCustomizer
  /**
   * 用于从node_modules解析集合的当前工作目录
   */
  collectionsNodeResolvePath?: string
  /**
   * 转换原始`svg`.
   *
   * **警告**:`transform`只在使用`custom`图标集合时才会应用.
   *
   * @param svg 加载的`svg`
   * @param collection 集合的名称
   * @param icon 图标的名称
   * @return 转换后的`svg`.
   */
  transform?: (svg: string, collection: string, icon: string) => Awaitable<string>
  /**
   * 自动安装图标源包,当检测到使用时
   *
   * @default false
   */
  autoInstall?: boolean
  /**
   * 编译器
   *
   * - none: 纯SVG内容
   * - raw: 一个默认导出的字符串的ESM模块,包含SVG HTML
   *
   * @default (自动检测,如果无法检测到,则回退到'vue3')
   */
  compiler?: 'astro' | 'jsx' | 'marko' | 'none' | 'solid' | 'svelte' | 'raw' | 'vue2' | 'vue3' | 'web-components' | 'qwik' | CustomCompiler
  /**
   * JSX样式,仅在编译器设置为`jsx`时生效
   *
   * @default (自动检测,如果无法检测到,则回退到'react')
   */
  jsx?: 'react' | 'preact' | 'qwik'
  /**
   * Web组件编译器配置
   */
  webComponents?: {
    /**
     * 自动调用`customElements.define`在模块导入时
     */
    autoDefine?: boolean
    /**
     * 自动定义的前缀
     *
     * @default 'icon'
     */
    iconPrefix?: string
    /**
     * 使用阴影DOM
     * @default false
     */
    shadow?: boolean
  }
  /**
   * @deprecated 不再需要
   */
  iconSource?: 'legacy' | 'modern' | 'auto'
}
```

##### unplugin-auto-import

[Github](https://github.com/unplugin/unplugin-auto-import)

```ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({ /* options */ }),
  ],
})
```

###### AutoImport 所有选项

```ts
/**
 * 选项接口
 */
interface Options {
/**
 * 预设名称或自定义导入映射
 *
 * @default []
 */
  imports?: Arrayable<ImportsMap | PresetName | InlinePreset>
  /**
   * 本地包预设.
   *
   * 将本地安装的包注册为预设.
   *
   * @default []
   * @see https://github.com/unplugin/unplugin-auto-import#package-presets
   */
  packagePresets?: (PackagePreset | string)[]
  /**
   * 要忽略的标识符
   */
  ignore?: (string | RegExp)[]
  /**
   * 不会被放在DTS文件中的标识符
   */
  ignoreDts?: (string | RegExp)[]
  /**
   * 将导入注入到其他导入的末尾
   *
   * @default true
   */
  injectAtEnd?: boolean
  /**
   * 要自动导入的目录路径
   */
  dirs?: string[]
  /**
   * 自定义函数,用于从组件名解析组件导入路径.
   *
   * 组件名始终是PascalCase
   */
  resolvers?: Arrayable<Arrayable<Resolver>>
  /**
   * 用于解析源代码的解析器.
   *
   * @see https://github.com/unjs/unimport#acorn-parser
   * @default 'regex'
   */
  parser?: UnimportOptions['parser']
  /**
   * 用于生成对应的.d.ts文件的文件路径.
   * 默认情况下,当本地安装了`typescript`时启用.
   * 设置为`false`以禁用.
   *
   * @default './auto-imports.d.ts'
   */
  dts?: string | boolean
  /**
   * 在Vue模板中自动导入
   *
   * @see https://github.com/unjs/unimport/pull/15
   * @see https://github.com/unjs/unimport/pull/72
   * @default false
   */
  vueTemplate?: boolean
  /**
   * 通过文件名设置默认导出别名
   *
   * @default false
   */
  defaultExportByFilename?: boolean
  /**
   * 转换目标的规则
   *
   * @default [/\.[jt]sx?$/, /\.astro$/, /\.vue$/, /\.vue\?vue/, /\.svelte$/]
   */
  include?: FilterPattern
  /**
   * 排除转换目标的规则
   *
   * @default [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]
   */
  exclude?: FilterPattern
  /**
   * 生成对应的.eslintrc-auto-import.json文件.
   */
  eslintrc?: ESLintrc
  /**
   * 生成对应的.biomelintrc.json文件.
   */
  biomelintrc?: BiomeLintrc
  /**
   * 在Vite的`optimizeDeps`选项中包含自动导入的包
   *
   * @default true
   */
  viteOptimizeDeps?: boolean
}
```

##### unplugin-vue-components

[Github](https://github.com/unplugin/unplugin-vue-components)

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Components({ /* options */ }),
  ],
})
```

###### Components 所有选项

```ts
interface Options {
/**
 * 用于匹配要转换的文件的正则表达式或glob模式
 */
  include?: FilterPattern
  /**
   * 用于匹配不要转换的文件的正则表达式或glob模式
   */
  exclude?: FilterPattern
  /**
   * 组件所在的相对目录路径.默认为'src/components'
   */
  dirs?: string | string[]
  /**
   * 组件的有效文件扩展名.默认为['vue']
   */
  extensions?: string | string[]
  /**
   * 用于检测组件的文件名的glob模式.
   *
   * 指定后,`dirs`和`extensions`选项将被忽略.
   */
  globs?: string | string[]
  /**
   * 搜索子目录
   * @default true
   */
  deep?: boolean
  /**
   * 将子目录作为组件的命名空间前缀
   * @default false
   */
  directoryAsNamespace?: boolean
  /**
   * 将相同的前缀(大小写敏感)折叠到组件名称中,以防止在命名空间组件名称中出现重复.
   *
   * 仅在`directoryAsNamespace: true`时生效
   * @default false
   */
  collapseSamePrefixes?: boolean
  /**
   * 忽略命名空间前缀的子目录路径
   *
   * 仅在`directoryAsNamespace: true`时生效
   * @default "[]"
   */
  globalNamespaces?: string[]
  /**
   * 提供自定义函数,将组件名称解析为导入路径
   *
   * 组件名称始终为PascalCase
   */
  resolvers?: (ComponentResolver | ComponentResolver[])[]
  /**
   * 应用自定义转换到导入路径
   */
  importPathTransform?: (path: string) => string | undefined
  /**
   * 转换器
   *
   * @default 'vue3'
   */
  transformer?: SupportedTransformer
  /**
   * 生成全局组件的TypeScript声明
   *
   * 接受布尔值或相对于项目根目录的路径
   *
   * @see https://github.com/vuejs/core/pull/3399
   * @see https://github.com/johnsoncodehk/volar#using
   * @default true
   */
  dts?: boolean | string
  /**
   * 禁止覆盖组件时发出警告
   *
   * @default false
   */
  allowOverrides?: boolean
  /**
   * 自动导入指令的自动导入
   *
   * 默认为Vue 3为`true`,Vue 2为`false`
   *
   * 为了进行Vue 2的转换,需要安装Babel,默认为性能考虑而禁用.
   * 要安装Babel,请运行:`npm install -D @babel/parser`
   * @default undefined
   */
  directives?: boolean
  /**
   * 库中仅提供组件的类型
   */
  types?: TypeImport[]
  /**
   * Vue项目的版本.如果未指定,将自动检测.
   */
  version?: 2 | 2.7 | 3
}
```

##### 自动导入

只有使用的图标或者组件最终才会打包,所以不用担心打包后的文件体积

与`unplugin-vue-components`一起使用

```ts
// vite.config.js
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

export default {
  plugins: [
    Icons({
      /**
       * 自定义图标加载器集合
       */
      customCollections: {
        lc: FileSystemIconLoader(
          'src/assets/icons',
          svg => svg.replace(/^<svg /, '<svg fill="currentColor" '),
        ),
      },
    }),
    Components({
      resolvers: [
      // https://github.com/unplugin/unplugin-icons?tab=readme-ov-file#auto-importing
        // 自动引入的Icon组件统一前缀,默认为 i,设置false为不需要前缀
        // prefix: 'icon',
        // prefix: false,
        // {prefix}-{collection}-{icon} 使用组件解析器时,您必须遵循名称转换才能正确推断图标
        IconsResolver({
          alias: {
            fas: 'fa-solid',
          },
          customCollections: [
            // https://github.com/unplugin/unplugin-icons?tab=readme-ov-file#use-with-resolver
            'lc'
          ]
        }),
      ],
    }),

  ],
}
```

###### IconsResolver 所有选项

```ts
interface ComponentResolverOption {
  /**
   * https://github.com/unplugin/unplugin-icons?tab=readme-ov-file#name-conversion
   * 用于解析组件名称的前缀.
   * 将空字符串设置为禁用前缀.
   *
   * @default 'i'
   */
  prefix?: string | false
  /**
   * 要启用的图标集合名称.
   *
   * @default [所有集合]
   */
  enabledCollections?: string | string[]
  /**
   * https://github.com/unplugin/unplugin-icons?tab=readme-ov-file#collection-aliases
   * 图标集合别名.
   *
   * `aliases`的键是`alias`,值是集合的`name`.
   *
   * 通过配置,我们可以使用`<i-park-abnormal />`而不是使用`<i-icon-park-abnormal />`:
   * `alias: { park: 'icon-park' }`
   */
  alias?: Record<string, string>
  /**
   * 通过加载器提供的自定义集合名称.
   */
  customCollections?: string | string[]
  /**
   * 解析后的ID的名称.
   * 将`jsx`设置为JSX组件.
   *
   * @default ''
   */
  extension?: string
  /**
   * @deprecated 已经更名为`prefix`
   */
  componentPrefix?: string
  /**
   * 对集合进行严格匹配.
   * 默认为`false`,没有副作用.
   * 将`true`设置为启用使用`-`后缀进行严格匹配的所有集合.
   */
  strict?: boolean
}
```

#### Iconify

[官网](https://icon-sets.iconify.design/)
[即时搜索功能的图标浏览器](https://icones.js.org)

```bash
# 安装 Iconify 的 FA6 Solid 图标集
pnpm i -D @iconify-json/fa6-solid
```

#### naive-ui

```bash
pnpm i -D naive-ui
```

#### vite-plugin-compression2

[Github](https://github.com/nonzzz/vite-plugin-compression#readme)

压缩打包文件 gzip

```bash
pnpm i -D vite-plugin-compression2
```

#### vite-plugin-image-optimizer

[Github](https://github.com/FatehAK/vite-plugin-image-optimizer)
Vite 打包图像优化

```bash
pnpm i -D vite-plugin-image-optimizer
```

> **注意**
>
> `sharp` 和 `svgo` 不会随着包一起安装.你需要手动安装它们,并将它们添加为开发依赖.这是一个设计决定,目的是让你可以选择是否安装
> `sharp`
> 如果你只想使用 `svgo` 优化 svg 资产,反之亦然.
>
> ```console
> pnpm i -D sharp
> ```
>
> ```console
> pnpm i -D svgo
> ```

#### @vitejs/plugin-legacy

[Github](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

提供对旧版浏览器的支持

```bash
pnpm i -D @vitejs/plugin-legacy
```

#### rollup-plugin-visualizer

rollup 打包分析工具

```bash
pnpm i -D rollup-plugin-visualizer
```

#### dev工具(可选)

```bash
# 已被集成不需要
# pnpm i -D vite-plugin-inspect
```

#### 汇总

1. 汇总项目依赖

   ```bash
   pnpm add pinia pinia-plugin-persistedstate @vueuse/core
   ```

2. 汇总开发依赖

   ```bash
   pnpm i -D sass unocss @unocss/preset-rem-to-px @iconify-json/fa6-solid unplugin-icons unplugin-auto-import unplugin-vue-components naive-ui vite-plugin-compression2 vite-plugin-image-optimizer sharp svgo @vitejs/plugin-legacy rollup-plugin-visualizer
   ```

### 独立使用

1. jszip

   ```bash
   pnpm i jszip
   ```

2. socket.io-client

   ```bash
   pnpm i socket.io-client
   ```

3. CodeMirror
   CodeMirror 是一个基于浏览器的文本编辑器,它提供了丰富的 API 和插件来扩展其功能.以下是安装 CodeMirror 和相关插件的命令和注释:

   ```bash
   # 安装 CodeMirror
   pnpm i codemirror

   # 安装 CodeMirror Lint 插件
   pnpm i @codemirror/lint

   # 安装 CodeMirror 语言包
   pnpm i @codemirror/language

   # 安装 CodeMirror JSON 语言包
   pnpm i @codemirror/lang-json

   # 安装 CodeMirror 旧版模式
   pnpm i @codemirror/legacy-modes

   # 安装 highlight.js
   pnpm i highlight.js

   # 安装所有 CodeMirror 依赖
   pnpm i codemirror @codemirror/lint @codemirror/language @codemirror/lang-json @codemirror/legacy-modes highlight.js
   ```
