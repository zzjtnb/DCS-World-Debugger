import { v4 as uuidv4 } from 'uuid'

import { Logger } from '../utils/logo4'
import { getStore } from './store/store'
import { enqueue, handleQueue, removeFromQueue } from './queue'
import { mutate, mutationNames } from './store/mutation'
import { executeCallback, storeCallback } from './dispatch'
import { handleEvent } from './dcs/event'

/** @internal */
export const sendMessage = (message: Message) => {
  const networkSend = getStore().networkSend
  if (!networkSend) {
    console.error('Couldn\'t send message, server is probably not initialized')
    return
  }
  networkSend(JSON.stringify(message))
  enqueue(message, getStore().sentMessages, (sentMessages: Message[]) =>
    mutate(mutationNames.SET_SENT_MESSAGES, { sentMessages }),
  )
}

/** @internal */
export const createMessage = <R>(
  type: MessageType,
  payload: { [key: string]: any },
  callback?: Callback<R>,
): Message => {
  const data = {
    id: uuidv4().toString(),
    type,
    callbackId: storeCallback<R>(callback),
    payload,
    sent: Date.now(),
  }
  return data
}

const handleFunction = (message: Message) => {}
const handleDebug = (message: Message) => {
  const queuedMessage = removeFromQueue(
    message,
    getStore().sentMessages,
    (sentMessages: Message[]) =>
      mutate(mutationNames.SET_SENT_MESSAGES, { sentMessages }),
  )
  if (!queuedMessage)
    return

  executeCallback(queuedMessage.callbackId, message.payload)
}
const handleServerStatus = (message: Message) => {
  const result = message.payload.result
  Logger.log(result.msg ?? JSON.stringify(result))
}

const handleReceived = (message: Message) => {
  const queuedMessage = removeFromQueue(
    message,
    getStore().sentMessages,
    (sentMessages: Message[]) =>
      mutate(mutationNames.SET_SENT_MESSAGES, { sentMessages }),
  )
  if (!queuedMessage)
    return

  executeCallback(queuedMessage.callbackId, message.payload)
}

const messageHandlers = {
  function: handleFunction,
  event: (message: Message) =>
    handleEvent(
      typeof message.payload.id === 'number' ? message.payload.id : -1,
      message.payload,
    ),
  received: handleReceived,
  serverStatus: handleServerStatus,
  debug: handleDebug,
}

/** @internal */
export const handleMessage = (message: Message) => {
  // console.log("Received", message);
  messageHandlers[message.type](message)
}

/** message type */

export const isMessageTypeServerStatus = (input: any): input is MessageTypeServerStatus => input === 'serverStatus'
export const isMessageTypeDebug = (input: any): input is MessageTypeFunction => input === 'debug'
export const isMessageTypeFunction = (input: any): input is MessageTypeFunction => input === 'function'
export const isMessageTypeEvent = (input: any): input is MessageTypeEvent => input === 'event'
export const isMessageTypeReceived = (input: any): input is MessageTypeReceived => input === 'received'

export const isMessageType = (input: any): input is MessageType => isMessageTypeServerStatus(input) || isMessageTypeDebug(input) || isMessageTypeFunction(input) || isMessageTypeEvent(input) || isMessageTypeReceived(input)

export const isMesssage = (data: { [key: string]: any }): data is Message =>
  typeof data === 'object'
  && data !== null
  && typeof data.id === 'string'
  && isMessageType(data.type)
  && typeof data.payload === 'object'
  && typeof data.sent === 'number'

// setInterval(() => {
//   handleQueue(
//     getStore().sentMessages,
//     (sentMessages: Message[]) =>
//       mutate(mutationNames.SET_SENT_MESSAGES, { sentMessages }),
//     sendMessage,
//   )
// }, 2000)
