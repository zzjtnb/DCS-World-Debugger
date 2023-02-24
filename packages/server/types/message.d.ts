type MessageTypeFunction = 'function'
type MessageTypeEvent = 'event'
type MessageTypeReceived = 'received'
type MessageTypeServerStatus = 'serverStatus'
type MessageTypeDebug = 'debug'

type MessageType =
| MessageTypeFunction
| MessageTypeEvent
| MessageTypeReceived
| MessageTypeServerStatus
| MessageTypeDebug

interface Message {
  id: string
  type: MessageType
  payload: { [key: string]: any }
  sent: number
  callbackId: string | undefined
}
