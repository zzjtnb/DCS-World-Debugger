# Vue3

[unocss 交互式文档](https://unocss.dev/interactive)
[unocss本地调试](http://localhost:3000/__unocss)
[Tailwind 组件](https://tailwindcomponents.com)
[icones](https://icones.js.org)
[fontawesome](https://fontawesome.com)

## 安装依赖

1. sass

   ```bash
   pnpm add -D sass
   ```

2. pinia

   ```bash
   pnpm i pinia

   # Pinia 持久化存储插件
   pnpm i pinia-plugin-persistedstate
   ```

3. 配置Unocss
   UnoCSS 是一个具有高性能且极具灵活性的即时原子化 CSS 引擎

   ```bash
   # 安装 Unocss
   pnpm i -D unocss

   # 安装 Unocss 的 Web Fonts 预设
   pnpm i -D @unocss/preset-web-fonts

   # 安装 Iconify 的 FA6 Solid 图标集
   pnpm i -D @iconify-json/fa6-solid

   # 安装所有 CodeMirror 依赖
   pnpm i -D unocss @unocss/preset-web-fonts @iconify-json/fa6-solid
   ```

4. 配置Iconify
   结合unocss,自动按需引入图标

   ```bash
   # 自动导入 Icon 依赖
   pnpm i -D unplugin-icons
   ```

5. unplugin 自动导入
   | 插件 | 概念 | 自动导入对象 |
   | :---------------------: | :--------------: | :-------------------------------------------: |
   | unplugin-auto-import | 按需自动导入API | ref,reactive,watch,computed 等API |
   | unplugin-vue-components | 按需自动导入组件 | Element Plus 等三方库和指定目录下的自定义组件 |

   ```bash
   # 按需自动导入API
   pnpm i -D unplugin-auto-import
   # 按需自动导入组件
   pnpm i -D unplugin-vue-components
   ```

6. naive-ui

   ```bash
   pnpm i -D naive-ui
   ```

7. @vitejs/plugin-legacy
   提供对旧版浏览器的支持

   ```bash
   pnpm i -D @vitejs/plugin-legacy
   ```

8. VueUse
   基于Vue组合式API的实用工具集

   ```bash
   pnpm i @vueuse/core
   ```

9. jszip

   ```bash
   pnpm i jszip
   ```

10. socket.io-client

    ```bash
    pnpm i socket.io-client
    ```

11. CodeMirror
    CodeMirror 是一个基于浏览器的文本编辑器，它提供了丰富的 API 和插件来扩展其功能。以下是安装 CodeMirror 和相关插件的命令和注释：

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

12. dev工具(可选)

    ```bash
    # pnpm i -D vite-plugin-inspect
    ```

汇总开发依赖

```bash
pnpm i -D sass unocss @unocss/preset-web-fonts @iconify-json/fa6-solid unplugin-icons unplugin-auto-import unplugin-vue-components naive-ui @vitejs/plugin-legacy
```

汇总项目依赖

```bash
pnpm i pinia pinia-plugin-persistedstate @vueuse/core jszip socket.io-client codemirror @codemirror/lint @codemirror/language @codemirror/lang-json @codemirror/legacy-modes highlight.js
```
