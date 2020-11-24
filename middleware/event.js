const { EventEmitter } = require('events');
const emitter = new EventEmitter()
emitter.on('error', (err) => {
  // console.log(err)
})
emitter.setMaxListeners(0)
module.exports = emitter