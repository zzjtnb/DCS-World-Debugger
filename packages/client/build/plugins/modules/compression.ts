import type { PluginOption } from 'vite'
import { compression } from 'vite-plugin-compression2'

export function compressionPlugin(): PluginOption {
  return compression({
    threshold: 10240, // 仅处理大于此大小的资产(以字节为单位)(10KB),
    algorithm: 'gzip', // 压缩算法
    // deleteOriginalAssets: true, // 删除原文件
    filename: '[path][base].gz', // 生成的压缩文件名
  })
}
