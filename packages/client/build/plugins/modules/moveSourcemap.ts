import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

interface moveSourcemapPluginOptions {
  dirName?: string
}

function moveFile(sourcePath: string, targetPath: string, distDir: string, sourcemapsDir: string): void {
  try {
    fs.renameSync(sourcePath, targetPath)
    // 计算相对路径并打印
    const relativeSource = path.relative(path.dirname(distDir), sourcePath)
    const relativeTarget = path.relative(path.dirname(sourcemapsDir), targetPath)
    console.log('🚀 ~ moveFile ~ 已移动 sourcemap 文件:', `${relativeSource} -> ${relativeTarget}`)
  }
  catch (error: any) {
    console.error('🚀 ~ moveFile ~ 移动文件时发生错误:', error.message || error)
  }
}

function ensureDirectoryExists(dir: string): void {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true })
    }
    fs.mkdirSync(dir, { recursive: true })
  }
  catch (error: any) {
    console.error('🚀 ~ ensureDirectoryExists ~ 处理目录时发生错误:', error.message || error)
    throw error
  }
}

export function moveSourcemap(options: moveSourcemapPluginOptions = {}): Plugin {
  let { dirName } = options
  if (!dirName) {
    dirName = 'sourcemap'
  }
  return {
    name: 'vite-plugin-move-sourcemaps',
    writeBundle(buildOptions, bundle) {
      const distDir = path.resolve(buildOptions.dir || '')
      const sourcemapsDir = path.join(distDir, dirName)
      try {
        ensureDirectoryExists(sourcemapsDir)
        for (const file of Object.keys(bundle)) {
          const chunk = bundle[file]
          if (chunk.type === 'asset' && chunk.fileName.endsWith('.map')) {
            const sourcemapPath = path.join(distDir, chunk.fileName)
            const newSourcemapPath = path.join(sourcemapsDir, path.basename(chunk.fileName))

            if (fs.existsSync(sourcemapPath)) {
              moveFile(sourcemapPath, newSourcemapPath, distDir, sourcemapsDir)
            }
            else {
              console.error('🚀 ~ writeBundle ~ 错误: sourcemap 文件不存在:', sourcemapPath)
            }
          }
        }
      }
      catch (error: any) {
        console.error('🚀 ~ writeBundle ~ 错误:', error.message || error)
      }
    },
  }
}
