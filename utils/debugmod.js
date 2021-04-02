const path = require('path');
const { makedir, streamData } = require('./fs');
function log(data) { console.log("TCP_Server-->" + data) }
debug_mod = (result) => {
  const debugpath = 'logs/debug/json/'
  if (!result.event || !result.executionTime.os) return
  makedir(path.join(process.cwd(), debugpath))
  const debug_dir = path.join(process.cwd(), debugpath + result.event)
  const mksucess = makedir(debug_dir)
  if (!mksucess) return
  const name = result.executionTime.os.replace(/:|-/g, '_')
  let filePath = path.join(debug_dir, name)
  if (result.data && result.data.log_type) {
    subDir = path.join(debug_dir, result.data.log_type)
    const mksubsucess = makedir(subDir)
    if (!mksubsucess) return
    filePath = path.join(subDir, name)
  }
  streamData(filePath + '.json', JSON.stringify(result) + '\n');
}
// debug_mod({ event: 'test', executionTime: { os: '2012-03-09 12:02:06' }, data: { log_type: 'quit' } })
module.exports = {
  log, debug_mod
};
