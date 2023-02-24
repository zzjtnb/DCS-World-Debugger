import { initNetwork } from './network'
import { getStore } from './store/store'
import { mutate, mutationNames } from './store/mutation'
import { handleMessage, isMesssage } from './message'
import { COALITIONS } from './dcs/constants'
import { executeDebug, executeFunction, getGroups, getUnits } from './dcs/functions'
import { EVENTS, addEventHandler, removeEventHandler } from './dcs/event'

const networkOnMessage: NetworkOnMessage = (payload, rinfo) => {
  if (!isMesssage(payload)) {
    console.error(
      `ERROR: received invalid message from ${rinfo.address}:${rinfo.port}`,
      payload,
    )
    return
  }
  handleMessage(payload)
}

/**
 * @param ownPort  To specify a custom port for the nodejs server, default is 15487
 * @param distantPort  To specify a custom port for the lua server, default is 15488
 */
export const initNode = async (ownPort?: number, distantPort?: number) => {
  const initialStateStore = getStore()
  mutate(mutationNames.SET_CONFIG, {
    ownPort: ownPort || initialStateStore.config.ownPort,
    distantPort: distantPort || initialStateStore.config.distantPort,
  })

  const store = getStore()
  const [server, networkSend] = await initNetwork(
    store.config.ownPort,
    store.config.distantPort,
    networkOnMessage,
  )
  mutate(mutationNames.SET_SERVER, { server })
  mutate(mutationNames.SET_NETWORK_SEND, { networkSend })
}

export {
  EVENTS,
  COALITIONS,
  executeDebug,
  executeFunction,
  getGroups,
  getUnits,
  addEventHandler,
  removeEventHandler,
}
