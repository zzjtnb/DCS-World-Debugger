type RGB = [number, number, number]
interface Color {
  [key: string]: any // 允许其他属性
  RGB: RGB
}

/**
 * 校验 RGB 颜色值是否合法
 * @param {any} rgb - 需要校验的 RGB 颜色。
 * @returns {boolean} 是否是合法的 RGB 颜色值
 */
function isValidRgb(rgb: any): rgb is RGB {
  return Array.isArray(rgb)
    && rgb.length === 3
    && rgb.every(value => typeof value === 'number' && value >= 0 && value <= 255)
}

/**
 * 将 RGB 颜色转换为 HSV 颜色。
 * @param {RGB} rgb - 需要转换的 RGB 颜色。
 * @returns {[number, number, number]} 颜色的 HSV 表示，格式为 [hue, saturation, value]。
 */
function convertRgbToHsv(rgb: RGB): [number, number, number] {
  const [r, g, b] = rgb.map(value => value / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const value = max

  const delta = max - min
  const saturation = max === 0 ? 0 : delta / max

  let hue: number = 0
  if (max !== min) {
    switch (max) {
      case r:
        hue = (g - b) / delta + (g < b ? 6 : 0)
        break
      case g:
        hue = (b - r) / delta + 2
        break
      case b:
        hue = (r - g) / delta + 4
        break
    }
    hue /= 6
  }

  return [hue, saturation, value]
}

/**
 * 根据指定字段的 RGB 值的 HSV 转换结果对颜色数组进行排序
 * @param {Color[]} colorsArray - 需要排序的颜色数组。
 * @param {string} colorKey - 颜色属性的键名，例如 'RGB'。
 * @returns {Color[]} 排序后的颜色数组。
 * @throws {Error} 如果某些颜色值不符合 RGB 颜色规则，抛出错误。
 */
export function sortColorsByHsv(colorsArray: Color[], colorKey: string): Color[] {
  return colorsArray.slice().sort((a, b) => {
    const rgbA = a[colorKey]
    const rgbB = b[colorKey]

    if (!isValidRgb(rgbA) || !isValidRgb(rgbB)) {
      // throw new Error(`无效的 RGB 颜色值，键名为: ${colorKey}`);
      console.error(`无效的 RGB 颜色值，键名为: ${colorKey}`)
      return 0
    }

    const [hueA, saturationA] = convertRgbToHsv(rgbA)
    const [hueB, saturationB] = convertRgbToHsv(rgbB)

    if (hueA === hueB) {
      return saturationB - saturationA
    }
    else {
      return hueB - hueA
    }
  })
}

// // 使用示例
// const colorsArray: Color[] = [
//   { RGB: [255, 0, 0] },  // 红色
//   { RGB: [0, 255, 0] },  // 绿色
//   { RGB: [0, 0, 255] },  // 蓝色
//   // 其他颜色
// ];

// try {
//   const sortedColors = sortColorsByHsv(colorsArray, 'RGB');
//   console.log(sortedColors);
// } catch (error) {
//   console.error(error.message);
// }
