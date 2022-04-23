const _this = this;
exports.isMessageTypeFunction = (input) => input === 'function';
exports.isMessageTypeEvent = (input) => input === 'event';
exports.isMessageTypeReceived = (input) => input === 'received';
exports.isMessageTypeNetDostring = (input) => input === 'net_dostring';
exports.isMessageTypeApiLoadstring = (input) => input === 'api_loadstring';

exports.isMessageType = (input) =>
  _this.isMessageTypeFunction(input) ||
  _this.isMessageTypeEvent(input) ||
  _this.isMessageTypeReceived(input) ||
  _this.isMessageTypeNetDostring(input) ||
  _this.isMessageTypeApiLoadstring(input);

exports.isMesssage = (data) => {
  return typeof data === 'object' && data !== null && typeof data.id === 'string' && _this.isMessageType(data.type) && typeof data.payload === 'object';
};
