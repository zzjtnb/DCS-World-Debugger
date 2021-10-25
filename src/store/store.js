var _this = this;
exports.store = {
  config: {
    ownPort: 15487,
    distantPort: 15488,
  },
  sentMessages: [],
  receivedMessages: [],
  callbacks: new Map(),
  server: undefined,
  networkSend: undefined,
  eventHandlers: [],
};

exports.getStore = () => _this.store;
