const event = require('../../middleware/event');
const { serverStatus } = require('../../middleware/logger');
event.on('ServerStatus', (msg) => {
  serverStatus.info(msg.data.msg);
});