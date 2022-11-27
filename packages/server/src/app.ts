import { socketInit } from './utils/socket'
import { EVENTS, addEventHandler, initNode } from './lib'

/**
 * from https://github.com/Ked57/NIOD-core
 * I transformed it into a TCP communication protocol
 */
initNode().then(async () => {
  // Log information on all the groups in the blue coalition
  // console.log(await getGroups(COALITIONS.BLUE));
  // Log position of new added marks
  addEventHandler(EVENTS.EventMarkAdded, (event) => {
    console.log('A mark was added at position', event)
  })
  addEventHandler(EVENTS.EventBirth, (event) => {
    // console.log('出生', event);
  })
  addEventHandler(EVENTS.EventShot, (event) => {
    // console.log('EventShot', event);
  })
})
socketInit()
