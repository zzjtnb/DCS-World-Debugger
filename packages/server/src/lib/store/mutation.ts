import type { Socket } from 'node:net'
import { store } from './store'

export const mutationNames = {
  SET_CONFIG: 'setConfig',
  SET_SERVER: 'setServer',
  SET_NETWORK_SEND: 'setNetworkSend',
  SET_SENT_MESSAGES: 'setSentMessages',
  SET_RECEIVED_MESSAGES: 'setReceivedMessage',
  SET_CALLBACKS: 'setCallbacks',
  SET_EVENT_HANDLERS: 'setEventHandlers',
}

const mutations = {
  [mutationNames.SET_CONFIG]: ({
    ownPort,
    distantPort,
  }: {
    ownPort: number
    distantPort: number
  }) => (store.config = { ownPort, distantPort }),

  [mutationNames.SET_SERVER]: ({ server }: { server: Socket }) =>
    (store.server = server),

  [mutationNames.SET_NETWORK_SEND]: ({
    networkSend,
  }: {
    networkSend: NetworkSend
  }) => (store.networkSend = networkSend),

  [mutationNames.SET_SENT_MESSAGES]: ({
    sentMessages,
  }: {
    sentMessages: Message[]
  }) => {
    store.sentMessages = sentMessages
  },

  [mutationNames.SET_RECEIVED_MESSAGES]: ({
    receivedMessages,
  }: {
    receivedMessages: Message[]
  }) => {
    store.receivedMessages = receivedMessages
  },

  [mutationNames.SET_CALLBACKS]: ({
    callbacks,
  }: {
    callbacks: Map<string, Callback<any>>
  }) => {
    store.callbacks = callbacks
  },

  [mutationNames.SET_EVENT_HANDLERS]: ({
    eventHandlers,
  }: {
    eventHandlers: {
      [key: number]: Map<string, EventHandler<any>>
    }
  }) => {
    store.eventHandlers = eventHandlers
  },
}
export const mutate: Mutate = (mutationName, args) =>
  mutations[mutationName](args)
