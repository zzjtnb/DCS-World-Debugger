const event = require('../../middleware/event');
const { serverStatus } = require('../../middleware/logger');
event.on('serverStatus', (msg) => {
  serverStatus.info(msg.data.msg);
});