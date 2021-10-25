const isPlainObject = (v) => Object.prototype.toString.call(v) === '[object Object]';
const isString = (v) => Object.prototype.toString.call(v) === '[object String]';

/**
 * 格式 JSON 字符串为对象
 *
 * @author anran758
 * @param { any }
 */
function formatJsonStrAsObj(sample) {
  let temp = sample;

  if (isString(temp)) {
    // 因为有解析失败的可能，使用 try catch 做相应处理
    try {
      temp = JSON.parse(temp);
    } catch (ex) {
      // parse error，return this sample
      return sample;
    }
  }

  if (isPlainObject(temp)) {
    temp = { ...temp };

    Object.keys(temp).forEach((key) => {
      const item = temp[key];

      // 字符串或者对象进行递归确认
      if (isString(item) || isPlainObject(item)) {
        temp[key] = formatJsonStrAsObj(item);
      }
    });
  }

  return temp;
}
/**
 * 将 JSON 字符串转换为带缩进的字符串
 *
 * @param {*} sample JSON 字符串
 * @param {number} [indnt=2] 缩进数
 * @returns
 */
function formatJSONIndnt(sample, indnt = 2) {
  const newSample = formatJsonStrAsObj(sample);

  if (isString(newSample)) return newSample;

  try {
    return JSON.stringify(newSample, null, indnt);
  } catch (ex) {
    return newSample.toString();
  }
}
