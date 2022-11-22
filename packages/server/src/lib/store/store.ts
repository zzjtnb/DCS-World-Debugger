export const store: Store = {
  config: {
    ownPort: 6666,
    distantPort: 8888,
  },
  sentMessages: [],
  receivedMessages: [],
  callbacks: new Map<string, Callback<any>>(),
  server: undefined,
  networkSend: undefined,
  eventHandlers: [],
}

export const getStore = (): Readonly<Store> => store
