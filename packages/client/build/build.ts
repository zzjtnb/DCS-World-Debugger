// 打包选项
import fs from 'node:fs'
import type { PreRenderedAsset } from 'rollup'
import type { BuildOptions } from 'vite'

function deleteFile(fileName: string) {
  const root = process.cwd()
  const filePath = `${root}/${fileName}`
  try {
    fs.unlinkSync(filePath)
    console.log('🚀 ~ deleteFile ~ fileName:', fileName)
  }
  catch (err) {
    if (fs.existsSync(filePath)) {
      console.error(`删除文件${filePath}时发生错误:`, err)
    }
  }
}

deleteFile('stats.html')

export function useBuild(viteEnv: ViteEnv): BuildOptions {
  const { VITE_CHECK } = viteEnv
  const options: BuildOptions = {
    // 10kb以下转 base64
    assetsInlineLimit: 1024 * 10,
    // chunkSizeWarningLimit: 2000, //配置文件大小提雄县之,默认 500kb
    rollupOptions: {
      output: {
        // 入口文件命名模式,使用 [name] 表示文件名,[hash] 表示哈希值
        entryFileNames: 'js/[name]-[hash].js',
        // 分块文件命名模式,使用 [name] 表示文件名,[hash] 表示哈希值
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
          // 如果 id 包含 'node_modules/.pnpm/',则将其分到 'vendor' 分块中
          const targetPath = 'node_modules/.pnpm/'
          if (id.includes(targetPath)) {
            return VITE_CHECK ? id.toString().split(targetPath)[1].split('/')[0] : 'vendor'
          }
        },
      },
    },
  }
  return options
}
