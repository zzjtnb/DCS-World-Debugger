/**
 * 截取数字到指定的小数位数,不进行四舍五入.
 *
 * @param {number | string} number - 要截取的数字,可以是数字类型或表示数字的字符串.
 * @param {number} [decimalPlaces] - 保留的小数位数,必须是非负整数.
 * @returns {number} - 截取后的数字.如果输入无效,返回 0.
 */
export const truncate = function (number: number | string, decimalPlaces: number = 2): number {
  // 将输入转换为数字
  const parsedNumber = Number(number)
  let truncatedStr = '0'

  // 检查是否是有效的数字
  if (Number.isFinite(parsedNumber)) {
    // 检查 decimalPlaces 是否是非负数
    if (typeof decimalPlaces === 'number' && decimalPlaces >= 0) {
      // 转换为字符串以处理小数位
      const strNumber = parsedNumber.toString()
      const decimalIndex = strNumber.indexOf('.')
      // 如果没有小数点,直接返回数字
      if (decimalIndex === -1) {
        return parsedNumber
      }
      // 截断到指定的小数位
      truncatedStr = strNumber.slice(0, decimalIndex + decimalPlaces + 1)
    }
  }
  return Number(truncatedStr)
}

/**
 * 格式化给定的秒数为时分秒格式(hh:mm:ss).
 * @param {number} seconds - 需要格式化的秒数.
 * @returns {string} 格式化后的时分秒字符串.
 */
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  const formattedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  return formattedTime
}

/**
 * 获取图片路径
 * @param {string} path - 图片路径
 * @returns {string} url - 图片路径
 */
export function getAssetsFile(path: string): string {
  console.log('🚀 ~ getAssetsFile ~ url:', path, import.meta.url)
  return new URL(`../assets/images/${path}`, import.meta.url)?.href
}
