import { v4 as uuidv4 } from 'uuid'
import { getStore } from './store/store'
import { mutate, mutationNames } from './store/mutation'

/** @internal */
export const executeCallback = (
  callbackId?: string,
  args?: { [key: string]: any },
) => {
  if (!callbackId)
    return

  const callbacks = getStore().callbacks
  const callback = callbacks.get(callbackId)
  if (!callback) {
    console.error('ERROR: No callback found for id: ', callbackId)
    return
  }
  callbacks.delete(callbackId)
  callback(args || {})
  mutate(mutationNames.SET_CALLBACKS, { callbacks })
}

/** @internal */
export const storeCallback = <R>(callback?: Callback<R>) => {
  if (!callback)
    return

  const callbackId = uuidv4().toString()
  const callbacks = getStore().callbacks
  callbacks.set(callbackId, callback)
  mutate(mutationNames.SET_CALLBACKS, { callbacks })
  return callbackId
}
