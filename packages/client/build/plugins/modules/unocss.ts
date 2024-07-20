// UnoCSS 是一个具有高性能且极具灵活性的即时原子化 CSS 引擎
import UnoCSS from 'unocss/vite'

export const unocssPlugin = () => UnoCSS('unocss.config.ts')
