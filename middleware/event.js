// const EventEmitter = require('events').EventEmitter;
// const emitter = new EventEmitter();
// emitter.setMaxListeners(Infinity);
// module.exports = emitter
const { on, EventEmitter } = require('events');
class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter()
myEmitter.on('error', (err) => {
  console.log(err)
})
//即使没有去触发 myEmitter 事件，on() 方法也会触发 newListener 事件。
// myEmitter.on('newListener', (event, listener) => {
//   console.log('----')
//   console.log(event)
//   console.log(listener)
// })
myEmitter.setMaxListeners(Infinity)

module.exports = myEmitter