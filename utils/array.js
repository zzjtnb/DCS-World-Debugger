/**
 * @description 数组扁平化
 * @param {Array} args -原数组
 * @param {Array} result -目标数组
 * @returns {Array}
 */
function flattening(args, result = []) {
  for (const item of args) {
    Array.isArray(item) ? flattening(item, result) : result.push(item)
  }
  return result
}

/**
 * @description 合并数组
 * @param  {String} key  -需要对比的key值
 * @param  {...any} args  -原数组
 * @returns {Array}   合并后的数组
 */
function merge(key, ...args) {
  const _origin = flattening(args);
  const targer = []
  _origin.forEach(item => {
    const findIndex = targer.findIndex((item2) => item[key] === item2[key]);
    findIndex < 0 ? targer.push(item) : Object.assign(targer[findIndex], item);
  });
  return targer
}
/**
 *
 * @param {*} key
 * @param  {...any} args
 */
function mergeobj(key, ...args) {
  const _origin = flattening(args);
  const targer = []
  _origin.forEach(item => {
    const findIndex = targer.findIndex((item2) => item[key] === item2[key]);
    if (findIndex < 0) {
      targer.push(item)
    } else {
      let data = []
      data.push(targer[findIndex].dataValues.depodds, item.dataValues.depodds,)
      item.dataValues.depodds = data
      Object.assign(targer[findIndex], item);
    }
  });
  return targer
}
module.exports = {
  flattening, merge, mergeobj
};
