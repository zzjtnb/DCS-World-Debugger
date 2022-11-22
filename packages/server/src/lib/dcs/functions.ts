import { createMessage, sendMessage } from '../message'

/**
 * Allows to execute any function in the lua `Node.function` table
 * @typeParam T  The type of the arguments you want to pass to the function.
 * @typeParam R  The type of the result you expect.
 * @param functionName The name of the function you want to execute
 * @param args The arguments you want to pass to the function
 */
export const executeFunction = <T, R>(functionName: string, args: T) =>
  new Promise<R>((resolve, reject) =>
    sendMessage(
      createMessage<R>(
        'function',
        {
          functionName,
          args,
        },
        result => resolve(result),
      ),
    ),
  )
/**
 * Allows to retrieve informations about groups from a coalition
 * @param coalitionId  The id of the coalition you want to retrieve the groups from. Note: you should use the constants in the COALITIONS object
 * @param groupCategory The category of the group, I'm not sure what it corresponds to
 */
export const getGroups = (coalitionId: number, groupCategory?: number) =>
  executeFunction<GetGroupsPayload, GetGroupsReturn[]>('getGroups', {
    coalitionId,
    groupCategory,
  })
/**
 * Allows to retrieve informations about units from a group
 * @param groupName The name of the group you want to retrieve the units from
 */
export const getUnits = (groupName: string) =>
  executeFunction<GetUnitsPayload, GetUnitsReturn[]>('getUnits', { groupName })

export const executeDebug = (data: anyObj) => {
  return new Promise((resolve, reject) => sendMessage(createMessage('debug', data, result => resolve(result))))
}
