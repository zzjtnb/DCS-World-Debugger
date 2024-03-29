import { v4 as uuidv4 } from 'uuid'
import { getStore } from '../store/store'
import { mutate, mutationNames } from '../store/mutation'

export const EVENTS = {
  EventBaseCaptured: 10,
  EventBirth: 15,
  EventCrash: 5,
  EventDead: 8,
  EventDetailedFailure: 17,
  EventEjection: 6,
  EventEngineShutdown: 19,
  EventEngineStartup: 18,
  EventHit: 2,
  EventKill: 28,
  EventLand: 4,
  EventLandingAfterEjection: 31,
  EventMarkAdded: 25,
  EventMarkChange: 26,
  EventMarkRemove: 27,
  EventMissionEnd: 12,
  EventMissionStart: 1,
  EventPilotDead: 9,
  EventPlayerComment: 22,
  EventPlayerEnterUnit: 20,
  EventLeaveUnit: 21,
  EventRefueling: 7,
  EventRefuelingStop: 14,
  EventScore: 29,
  EventShootingEnd: 24,
  EventShootingStart: 23,
  EventShot: 1,
  EventTakeoff: 3,
  EventUnitLost: 30,
}

/**
 * @typeParam T  The type of the event payload that is handled.
 * @param id  The id of the event that is handled. Note: you should use the constants in the EVENTS object
 * @param payload The payload passed to the handler
 */
export const handleEvent = <T>(id: number, payload: T) => {
  if (id === -1) {
    console.error('ERROR: Received unknown event', payload)
    return
  }
  const eventHandlers = getStore().eventHandlers
  if (!eventHandlers || !eventHandlers[id])
    return

  getStore().eventHandlers[id].forEach(handler => handler(payload))
}

/**
 * @typeParam T  The type of the event payload that will be handled.
 * @param id  The id of the event that is handled. Note: you should use the constants in the EVENTS object
 * @param handler The function handling the event, this is a generic function si a type must be provided
 * @returns the id of the handler that was created
 */
export const addEventHandler = <T>(id: number, handler: EventHandler<T>) => {
  const eventHandlers = getStore().eventHandlers
  const handlerId = uuidv4().toString()
  if (!eventHandlers[id])
    eventHandlers[id] = new Map<string, EventHandler<T>>()

  eventHandlers[id].set(handlerId, handler)
  mutate(mutationNames.SET_EVENT_HANDLERS, { eventHandlers })
  return handlerId
}

/**
 * @param id  The id of the event that is handled. Note: you should use the constants in the EVENTS object
 * @param handlerId The id of the handler, you can retrieve this when adding a handler
 */
export const removeEventHandler = (id: number, handlerId: string) => {
  const eventHandlers = getStore().eventHandlers
  eventHandlers[id].delete(handlerId)
  mutate(mutationNames.SET_EVENT_HANDLERS, eventHandlers)
}

