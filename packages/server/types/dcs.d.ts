type EventHandler<T> = (payload: T) => void
type Callback<R> = (args: R) => void

type Event =
| EventBaseCaptured
| EventBirth
| EventCrash
| EventDead
| EventDetailedFailure
| EventEjection
| EventEngineShutdown
| EventEngineStartup
| EventHit
| EventKill
| EventLand
| EventLandingAfterEjection
| EventMarkAdded
| EventMarkChange
| EventMarkRemove
| EventMissionEnd
| EventMissionStart
| EventPilotDead
| EventPlayerComment
| EventPlayerEnterUnit
| EventLeaveUnit
| EventRefueling
| EventRefuelingStop
| EventScore
| EventShootingEnd
| EventShootingStart
| EventShot
| EventTakeoff
| EventUnitLost

/**
 * Represents an unit returned by a DCS event
 */
interface EventUnit {
  _id: number
}

/**
 * Represents an airbase returned by a DCS event
 */
interface EventAirbase {
  _id: number
}

/**
 * Represents a weapon returned by a DCS event
 */
interface EventWeapon {
  _id: number
}

/**
 * Represents an object returned by a DCS event
 */
interface EventObject {
  _id: number
}

/**
 * Represents the neutral coalition returned by a DCS event
 */
 type EventNeutralCoalition = -1

/**
 * Represents the red coalition returned by a DCS event
 */
 type EventRedCoalition = 1

/**
 * Represents the blue returned by a DCS event
 */
 type EventBlueCoalition = 2

/**
 * Occurs when a ground unit captures either an airbase or a farp. Source: [https://wiki.hoggitworld.com/view/DCS_event_base_captured](https://wiki.hoggitworld.com/view/DCS_event_base_captured)
 */
interface EventBaseCaptured {
  id: 10
  time: number
  initiator: EventUnit
  place: EventAirbase
  subplace: 0
}

/**
 * Occurs when any object is spawned into the mission. Source: [https://wiki.hoggitworld.com/view/DCS_event_birth](https://wiki.hoggitworld.com/view/DCS_event_birth)
 */
interface EventBirth {
  id: 15
  time: number
  initiator: EventUnit
}

/**
 * Occurs when any aircraft crashes into the ground and is completely destroyed. Source: [https://wiki.hoggitworld.com/view/DCS_event_crash](https://wiki.hoggitworld.com/view/DCS_event_crash)
 */
interface EventCrash {
  id: 5
  time: number
  initiator: EventUnit
}

/**
 * Occurs when an object is completely destroyed. Source: [https://wiki.hoggitworld.com/view/DCS_event_dead](https://wiki.hoggitworld.com/view/DCS_event_dead)
 */
interface EventDead {
  id: 8
  time: number
  initiator: EventUnit
}

/**
 * Unknown precisely what creates this event, likely tied into newer damage model. Will update this page when new information become available. Source: [https://wiki.hoggitworld.com/view/DCS_event_detailed_failure](https://wiki.hoggitworld.com/view/DCS_event_detailed_failure)
 */
interface EventDetailedFailure {
  id: 17
  time: number
  initiator: EventUnit
}

/**
 * Occurs when a pilot ejects from an aircraft. Source: [https://wiki.hoggitworld.com/view/DCS_event_ejection](https://wiki.hoggitworld.com/view/DCS_event_ejection)
 */
interface EventEjection {
  id: 6
  time: number
  initiator: EventUnit
}

/**
 * Occurs when any aircraft shuts down its engines. Source: [https://wiki.hoggitworld.com/view/DCS_event_engine_shutdown](https://wiki.hoggitworld.com/view/DCS_event_engine_shutdown)
 */
interface EventEngineShutdown {
  id: 19
  time: number
  initiator: EventUnit
}

/**
 * Occurs when any aircraft starts its engines. Source: [https://wiki.hoggitworld.com/view/DCS_event_engine_startup](https://wiki.hoggitworld.com/view/DCS_event_engine_startup)
 */
interface EventEngineStartup {
  id: 18
  time: number
  initiator: EventUnit
}

/**
 * Occurs whenever an object is hit by a weapon. Source: [https://wiki.hoggitworld.com/view/DCS_event_hit](https://wiki.hoggitworld.com/view/DCS_event_hit)
 */
interface EventHit {
  id: 2
  time: number
  initiator: EventUnit
  weapon: EventWeapon
  target: EventObject
}

/**
 * Occurs when any system fails on a human controlled aircraft. Source: [https://wiki.hoggitworld.com/view/DCS_event_human_failure](https://wiki.hoggitworld.com/view/DCS_event_human_failure)
 */
interface EventHumanFailure {
  id: 16
  time: number
  initiator: EventUnit
}

/**
 * Occurs on the death of a unit. Contains more and different information. Similar to unit_lost it will occur for aircraft before the aircraft crash event occurs. Source: [https://wiki.hoggitworld.com/view/DCS_event_kill](https://wiki.hoggitworld.com/view/DCS_event_kill)
 */
interface EventKill {
  id: 28
  time: number
  initiator: EventUnit
  target: EventUnit
  weapon: EventWeapon
  weapon_name: string
}

/**
 * Occurs when an aircraft lands at an airbase, farp or ship. Source: [https://wiki.hoggitworld.com/view/DCS_event_land](https://wiki.hoggitworld.com/view/DCS_event_land)
 */
interface EventLand {
  id: 4
  time: number
  initiator: EventUnit
  place: EventObject
  sbuPlace: 0
}

/**
 * Occurs shortly after the landing animation of an ejected pilot touching the ground and standing up. Source: [https://wiki.hoggitworld.com/view/DCS_event_landing_after_ejection](https://wiki.hoggitworld.com/view/DCS_event_landing_after_ejection)
 */
interface EventLandingAfterEjection {
  id: 31
  time: number
  initiator: EventUnit
  place: EventUnit
  subplace: 0
}

/**
 * Occurs when mark panels get added to the mission by players or scripting functions. Source: [https://wiki.hoggitworld.com/view/DCS_event_mark_added](https://wiki.hoggitworld.com/view/DCS_event_mark_added)
 */
interface EventMarkAdded {
  id: 25
  idx: number
  time: number
  initiator: EventUnit
  coalition: EventNeutralCoalition | EventRedCoalition | EventBlueCoalition
  groupID: number
  text: string
  pos: Vector3
}

/**
 * Occurs when a mark panel is modified by a player. Source: [https://wiki.hoggitworld.com/view/DCS_event_mark_change](https://wiki.hoggitworld.com/view/DCS_event_mark_change)
 */
interface EventMarkChange {
  id: 26
  idx: number
  time: number
  initiator: EventUnit
  coalition: EventNeutralCoalition | EventRedCoalition | EventBlueCoalition
  groupID: number
  text: string
  pos: Vector3
}

/**
 * Occurs when mark panels get removed from the mission by players or scripting functions. Source: [https://wiki.hoggitworld.com/view/DCS_event_mark_remove](https://wiki.hoggitworld.com/view/DCS_event_mark_remove)
 */
interface EventMarkRemove {
  id: 27
  idx: number
  time: number
  initiator: EventUnit
  coalition: EventNeutralCoalition | EventRedCoalition | EventBlueCoalition
  groupID: number
  text: string
  pos: Vector3
}

/**
 * Occurs when a mission ends. Source: [https://wiki.hoggitworld.com/view/DCS_event_mission_end](https://wiki.hoggitworld.com/view/DCS_event_mission_end)
 */
interface EventMissionEnd {
  id: 12
  time: number
}

/**
 * Occurs when a mission starts. Source: [https://wiki.hoggitworld.com/view/DCS_event_mission_start](https://wiki.hoggitworld.com/view/DCS_event_mission_start)
 */
interface EventMissionStart {
  id: 1
  time: number
}

/**
 * Occurs when the pilot of an aircraft is killed. Can occur either if the player is alive and crashes or if a weapon kills the pilot without completely destroying the plane. Source: [https://wiki.hoggitworld.com/view/DCS_event_pilot_dead](https://wiki.hoggitworld.com/view/DCS_event_pilot_dead)
 */
interface EventPilotDead {
  id: 9
  time: number
  initiator: EventUnit
}

/**
 * Typically corresponds to generalized events that create a triggered message called directly from the game itself. Currently the only known cause appears to display a landing score when AI and occasionally when players land on an aircraft carrier. Source: [https://wiki.hoggitworld.com/view/DCS_event_player_comment](https://wiki.hoggitworld.com/view/DCS_event_player_comment)
 */
interface EventPlayerComment {
  id: 22
  time: number
  comment: string
}

/**
 * Occurs when any player assumes direct control of a unit. Source: [https://wiki.hoggitworld.com/view/DCS_event_player_enter_unit](https://wiki.hoggitworld.com/view/DCS_event_player_enter_unit)
 */
interface EventPlayerEnterUnit {
  id: 20
  time: number
  initiator: EventUnit
}

/**
 * Occurs when any player relieves control of a unit to the AI. Source: [https://wiki.hoggitworld.com/view/DCS_event_player_leave_unit](https://wiki.hoggitworld.com/view/DCS_event_player_leave_unit)
 */
interface EventLeaveUnit {
  id: 21
  time: number
  initiator: EventUnit
}

/**
 * Occurs when an aircraft connects with a tanker and begins taking on fuel. Source: [https://wiki.hoggitworld.com/view/DCS_event_refueling](https://wiki.hoggitworld.com/view/DCS_event_refueling)
 */
interface EventRefueling {
  id: 7
  time: number
  initiator: EventUnit
}

/**
 * Occurs when an aircraft is finished taking fuel. Source: [https://wiki.hoggitworld.com/view/DCS_event_refueling_stop](https://wiki.hoggitworld.com/view/DCS_event_refueling_stop)
 */
interface EventRefuelingStop {
  id: 14
  time: number
  initiator: EventUnit
}

/**
 * Occurs when any modification to the "Score" as seen on the debrief menu would occur. There is no information on what values the score was changed to. Event is likely similar to player_comment in this regard. Source: [https://wiki.hoggitworld.com/view/DCS_event_score](https://wiki.hoggitworld.com/view/DCS_event_score)
 */
interface EventScore {
  id: 29
  time: number
}

/**
 * Occurs when any unit stops firing its weapon. Event will always correspond with a shooting start event. Source: [https://wiki.hoggitworld.com/view/DCS_event_shooting_end](https://wiki.hoggitworld.com/view/DCS_event_shooting_end)
 */
interface EventShootingEnd {
  id: 24
  time: number
  initiator: EventUnit
}

/**
 * Occurs when any unit begins firing a weapon that has a high rate of fire. Most common with aircraft cannons (GAU-8), autocannons, and machine guns. Source: [https://wiki.hoggitworld.com/view/DCS_event_shooting_start](https://wiki.hoggitworld.com/view/DCS_event_shooting_start)
 */
interface EventShootingStart {
  id: 23
  time: number
  initiator: EventUnit
  target: EventUnit
}

/**
 * Occurs whenever any unit in a mission fires a weapon. But not any machine gun or autocannon based weapon, those are handled by shooting_start. Source: [https://wiki.hoggitworld.com/view/DCS_event_shot](https://wiki.hoggitworld.com/view/DCS_event_shot)
 */
interface EventShot {
  id: 1
  time: number
  initiator: EventUnit
  weapon: EventWeapon
}

/**
 * Occurs when an aircraft takes off from an airbase, farp, or ship. Source: [https://wiki.hoggitworld.com/view/DCS_event_takeoff](https://wiki.hoggitworld.com/view/DCS_event_takeoff)
 */
interface EventTakeoff {
  id: 3
  time: number
  initiator: EventUnit
  place: EventObject
  subPlace: 0
}

/**
 * Occurs when the game thinks an object is destroyed. Source: [https://wiki.hoggitworld.com/view/DCS_event_unit_lost](https://wiki.hoggitworld.com/view/DCS_event_unit_lost)
 */
interface EventUnitLost {
  id: 30
  time: number
  initiator: EventUnit
}

interface GetGroupsPayload {
  coalitionId: number
  groupCategory?: number
}
interface GetGroupsReturn {
  category: number
  coalition: number
  name: string
  id: number
  initialSize: number
  size: number
}
interface GetUnitsPayload {
  groupName: string
}

interface GetUnitsReturn {
  ammo: {
    count: number
    desc: {
      [key: string]: any
    }
  }[]
  callsign: string
  desc: { [key: string]: any }
  fuel: number
  hasRadar: boolean
  id: number
  inAir: boolean
  isActive: boolean
  life: number
  life0: number
  name: string
  position: Vector3
  sensors: { [key: string]: any }[]
  type: string
  velocity: DCS.Vector3
}

// declare namespace DCS {}
