const { Logger } = require('../utils/logo4');
const { initNetwork } = require('./network');
const { getStore } = require('./store/store');
const { handleMessage } = require('./message');
const { isMesssage } = require('./types/message_types');
const { mutate, mutationNames } = require('./store/mutation');

const networkOnError = async (err) => {
  // const store = getStore();
  // const [server, networkSend] = await initNetwork(
  //   store.config.ownPort,
  //   store.config.distantPort,
  //   networkOnError,
  //   networkOnMessage,
  // );
  // mutate(mutationNames.SET_SERVER, { server });
  // mutate(mutationNames.SET_NETWORK_SEND, { networkSend });
  console.log(err);
  Logger.error('NODE server successfuly loaded after crashing');
};

const networkOnMessage = (data, rinfo) => {
  if (data.type == 'ServerStatus') {
    return Logger.log(JSON.stringify(data.payload.msg));
  }
  if (!isMesssage(data)) {
    return Logger.error(`ERROR: received invalid message from ${rinfo.address}:${rinfo.port}`, data);
  }
  handleMessage(data, rinfo);
};

/**
 * @param ownPort  为 nodejs 服务器指定自定义端口，默认为 15487
 * @param distantPort  为lua服务器指定自定义端口，默认为15488
 */
exports.initNode = async (ownPort, distantPort) => {
  const initialStateStore = getStore();
  mutate(mutationNames.SET_CONFIG, {
    ownPort: ownPort || initialStateStore.config.ownPort,
    distantPort: distantPort || initialStateStore.config.distantPort,
  });
  const store = getStore();
  const [server, networkSend] = await initNetwork(
    store.config.ownPort,
    store.config.distantPort,
    networkOnError,
    networkOnMessage,
  );
  mutate(mutationNames.SET_SERVER, { server });
  mutate(mutationNames.SET_NETWORK_SEND, { networkSend });
  Logger.log(`NODE server successfuly loaded on port ${store.config.ownPort}`);
};
