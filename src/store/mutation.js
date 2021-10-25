var _this = this;
// import { Socket } from 'dgram';
// import { store } from './store';
const { store } = require('./store');
// import { NetworkSend } from '../types/network_types';
// import { Mutate } from '../types/store_types';
// import { Message } from '../types/message_types';
// import { Callback } from '../types/dispatch_types';
// import { EventHandler } from '../dcs/event';

const mutate = (mutationName, args) => mutations[mutationName](args);

const mutationNames = {
  SET_CONFIG: 'setConfig',
  SET_SERVER: 'setServer',
  SET_NETWORK_SEND: 'setNetworkSend',
  SET_SENT_MESSAGES: 'setSentMessages',
  SET_RECEIVED_MESSAGES: 'setReceivedMessage',
  SET_CALLBACKS: 'setCallbacks',
  SET_EVENT_HANDLERS: 'setEventHandlers',
};

const mutations = {
  [mutationNames.SET_CONFIG]: ({ ownPort, distantPort }) => (store.config = { ownPort, distantPort }),
  [mutationNames.SET_SERVER]: ({ server }) => (store.server = server),
  [mutationNames.SET_NETWORK_SEND]: ({ networkSend }) => (store.networkSend = networkSend),
  [mutationNames.SET_SENT_MESSAGES]: ({ sentMessages }) => {
    store.sentMessages = sentMessages;
  },
  [mutationNames.SET_RECEIVED_MESSAGES]: ({ receivedMessages }) => {
    store.receivedMessages = receivedMessages;
  },
  [mutationNames.SET_CALLBACKS]: ({ callbacks }) => {
    store.callbacks = callbacks;
  },
  [mutationNames.SET_EVENT_HANDLERS]: ({ eventHandlers }) => {
    store.eventHandlers = eventHandlers;
  },
};

module.exports = {
  mutate,
  mutationNames,
};
