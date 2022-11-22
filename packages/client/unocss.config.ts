import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import presetWebFonts from '@unocss/preset-web-fonts'

// https://uno.antfu.me
// http://localhost:3000/__unocss
// https://tailwindcomponents.com
// https://icones.js.org
export default defineConfig({
  shortcuts: [],
  presets: [
    // 这个预设提供了流行的实用程序优先框架的通用超集，包括Tailwind CSS，Windi CSS，Bootstrap，Tachyons等
    presetUno(),
    // 继承了WindiCSS的属性化模式，简化了书写class，以属性的形式去写class，但是在使用组件的时候，较大可能出现属性太多，容易混淆的情况。
    presetAttributify(),
    // UnoCSS提供了图标的预设，它是纯CSS的图标，可以选择Icones 或 Iconify作为图标源使用，同样也支持自定义icon，本身实现按需加载。
    presetIcons({
      scale: 1.2,
      warn: true,
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
  rules: [
    [/^bc-(.+)$/, ([, color]) => ({ 'border-color': `#${color}` })],
    ['card-shadow', { 'box-shadow': '0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017' }],
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
})
