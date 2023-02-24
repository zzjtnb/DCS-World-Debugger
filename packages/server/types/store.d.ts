interface Store {
  config: {
    ownPort: number
    distantPort: number
  }
  sentMessages: Message[]
  receivedMessages: Message[]
  callbacks: Map<string, Callback<any>>
  server: Socket | undefined
  networkSend: NetworkSend | undefined
  eventHandlers: {
    [key: number]: Map<string, EventHandler<any>>
  }
}
type Mutate = (mutationName: string, args: any) => void
