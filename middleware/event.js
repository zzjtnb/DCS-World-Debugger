const { EventEmitter } = require('events');
const emitter = new EventEmitter()
// emitter.setMaxListeners(10000000);
emitter.setMaxListeners(3);
// console.log("监听器数量:" + emitter.getMaxListeners());
module.exports = emitter