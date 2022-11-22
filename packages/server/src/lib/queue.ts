export const enqueue = (
  message: Message,
  queue: Message[],
  setter: (messages: Message[]) => void,
) => {
  queue.push(message)
  setter(queue)
}

export const dequeue = (
  queue: Message[],
  setter: (messages: Message[]) => void,
): Message | undefined => {
  const message = queue.shift()
  setter(queue)
  return message
}

export const removeFromQueue = (
  message: Message,
  queue: Message[],
  setter: (messages: Message[]) => void,
): Message | undefined => {
  const index = queue.findIndex(m => m.id === message.id)
  if (index === -1) {
    console.error(
      'ERROR: Trying to removeFromQueue => message not found in queue',
      message,
      queue,
    )
    return
  }
  const removedElements = queue.splice(index, 1)
  setter(queue)
  return removedElements[0]
}

export const handleQueue = (
  queue: Message[],
  setter: (messages: Message[]) => void,
  messageHandler: (message: Message) => void,
) => {
  queue.forEach((message) => {
    if (Date.now() - message.sent <= 5000)
      return
    const dequeuedMessage = removeFromQueue(message, queue, setter)
    if (!dequeuedMessage)
      return
    messageHandler(dequeuedMessage)
  })
}
