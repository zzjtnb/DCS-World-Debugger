import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

import { FileSystemIconLoader } from 'unplugin-icons/loaders'

export default defineConfig({

  presets: [
    // 这个预设提供了流行的实用程序优先框架的通用超集,包括Tailwind CSS,Windi CSS,Bootstrap,Tachyons等
    presetUno(),
    /* 继承了WindiCSS的属性化模式,简化了书写class,以属性的形式去写class,但是在使用组件的时候,较大可能出现属性太多,容易混淆的情况. */
    presetAttributify(),
    /**
     * 预设图标, 可用图标集npm包需要自己去npm查找.
     * UnoCSS提供了图标的预设,它是纯CSS的图标。
     * 可以选择Icones 或 Iconify作为图标源使用.同样也支持自定义icon,本身实现按需加载.
     * @description 支持使用的图标集
     * @link https://www.npmjs.com/search?q=%40iconify-json
     */
    presetIcons({
      scale: 1.2,
      //
      warn: true,
      // 将图标默认设置为内联
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      // https://unocss-cn.pages.dev/presets/icons#filesystemiconloader
      collections: {
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
    /* 将 rem 转换为 px 的基准字体大小 (1rem = n px) */
    presetRemToPx({
      /*
        rem:是一个相对单位,是相对html根元素中设置的font-size值.
        公式:size = html-font-size * rem-value
        html中,font-size: 16px;
        div中,font-size: 2rem;
        则:div中的font-size = 16px * 2 = 32px
        浏览器的默认的font-size是16px,1rem默认就等于16px.
        注意:chrome不支持小于12px的字体,计算小于12px的时候,会默认取12px去计算,导致chrome的rem/em不准确.
        unocss 默认1代表0.25rem,根元素默认是16px,16*0.25=4,也是就是1代表4px
        要想1代表1px 则设置根元素为4px
       */
      baseFontSize: 4,
    }),
    presetWebFonts({
      provider: 'google', // default provider
      fonts: {
        // these will extend the default theme
        sans: 'Roboto',
        mono: ['Fira Code', 'Fira Mono:400,700'],
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
  // 配置规则
  rules: [
    /*
      https://unocss-cn.pages.dev/config/rules
      以下是官网规则可以自定义转换
      例如 m-1 转为 margin: 0.25rem
      [/^m-(\d+)$/, ([, d]) => ({ margin: `${Number(d) / 4}rem` })],
      [/^p-(\d+)$/, match => ({ padding: `${Number(match[1]) / 4}rem` })],
    */
    [/^bc-(.+)$/, ([, color]) => ({ 'border-color': `#${color}` })],
    ['card-shadow', { 'box-shadow': '0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017' }],
  ],
  /*
  快捷方式
  https://unocss-cn.pages.dev/config/shortcuts
  自定义属性一个属性可以对应多个 unocss 类值
  */
  shortcuts: [
    {
      // 横着垂直水平居中
      'flex-center': 'flex justify-center items-center',
      // 竖着垂直水平居中
      'flex-col-center': 'flex flex-col justify-center items-center',
      // 分开两边
      'flex-between': 'flex justify-between items-center',
      // 放在最后
      'flex-end': 'flex justify-end items-center',
    },
  ],
  theme: {
    colors: {
      primary: 'var(--primary-color)',
      dark_bg: 'var(--dark-bg)',
    },
    fontFamily: {
      sans: '\'Inter\', sans-serif',
      mono: '\'Fira Code\', monospace',
    },
  },
  // 如果@vitejs/plugin-legacy有renderModernChunks: false,您需要将其添加到unocss选项
  // legacy: {
  //   renderModernChunks: false,
  // },
})
