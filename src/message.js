const _this = this;
const {v4} = require('uuid');
const {getStore} = require('./store/store');
const {enqueue, removeFromQueue, handleQueue} = require('./queue');
const {mutate, mutationNames} = require('./store/mutation');
const {storeCallback, executeCallback} = require('./dispatch');
const {handleEvent} = require('./dcs/event');

/** @internal */
exports.createMessage = (type, payload, callback) => {
  return {
    id: v4().toString(),
    type,
    callbackId: callback ? storeCallback(callback) : null,
    payload,
    sent: Date.now(),
  };
};
/** @internal */
exports.sendMessage = (message) => {
  const networkSend = getStore().networkSend;
  if (!networkSend) {
    console.error("Couldn't send message, server is probably not initialized");
    return;
  }

  networkSend(JSON.stringify(message) + '\r\n');
  enqueue(message, getStore().sentMessages, (sentMessages) => mutate(mutationNames.SET_SENT_MESSAGES, {sentMessages}));
  // console.log('Sent', message);
};

const handleReceived = (message) => {
  // console.log('Received', message);
  const queuedMessage = removeFromQueue(message, getStore().sentMessages, (sentMessages) => mutate(mutationNames.SET_SENT_MESSAGES, {sentMessages}));
  if (!queuedMessage) {
    return;
  }

  switch (message.type) {
    case 'net_dostring':
      executeCallback(queuedMessage.callbackId, message);
      break;
    case 'api_loadstring':
      executeCallback(queuedMessage.callbackId, message);
      break;
    default:
      executeCallback(queuedMessage.callbackId, message.payload);
      break;
  }
};
const handleFunction = (message) => {};

const messageHandlers = {
  function: handleFunction,
  event: (message) => handleEvent(typeof message.payload.id === 'number' ? message.payload.id : -1, message.payload),
  received: handleReceived,
  net_dostring: handleReceived,
  api_loadstring: handleReceived,
};

/** @internal */
exports.handleMessage = (message) => {
  messageHandlers[message.type](message);
};
