const _this = this;
exports.enqueue = (message, queue, setter) => {
  queue.push(message);
  setter(queue);
};

exports.dequeue = (queue, setter) => {
  const message = queue.shift();
  setter(queue);
  return message;
};

exports.removeFromQueue = (message, queue, setter) => {
  const index = queue.findIndex((m) => m.id === message.id);
  if (index === -1) {
    console.error('ERROR: Trying to removeFromQueue => message not found in queue');
    return;
  }
  const removedElements = queue.splice(index, 1);
  setter(queue);
  return removedElements[0];
};

exports.handleQueue = (queue, setter, messageHandler) => {
  queue.forEach((message) => {
    if (Date.now() - message.sent <= 5000) {
      return;
    }
    const dequeuedMessage = _this.removeFromQueue(message, queue, setter);
    if (!dequeuedMessage) {
      return;
    }
    messageHandler(dequeuedMessage);
  });
};
