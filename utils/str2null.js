const xss = require("xss");
function str2null(data) {
  let reg = /^\s+|\s+$/g
  for (let x in data) {
    data[x] = xss(data[x])
    if (data[x] === '' || reg.test(data[x])) {
      data[x] = null;
    } else {
      if (Array.isArray(data[x])) {
        data[x] = data[x].map(z => {
          return str2null(z);
        });
      }
      if (typeof (data[x]) === 'object') {
        data[x] = str2null(data[x])
      }
    }
  }
  return data;
}
module.exports = str2null
