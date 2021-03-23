const { EventEmitter } = require('events');
const emitter = new EventEmitter()
emitter.setMaxListeners(3);
// emitter.setMaxListeners(100)
// or 0 to turn off the limit
// emitter.setMaxListeners(0)
// console.log("监听器数量:" + emitter.getMaxListeners());
module.exports = emitter