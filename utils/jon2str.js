function json2string(data) {
  return new Promise((resolve, reject) => {
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        if (typeof data[key] === 'object') data[key] = JSON.stringify(data[key]);
      }
    }
    resolve(data)
  });
}
module.exports = {
  json2string
};
