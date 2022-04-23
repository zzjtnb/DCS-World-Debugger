const _this = this;
const {sendMessage, createMessage} = require('../message');

/**
 * Allows to retrieve informations about groups from a coalition
 * @param coalitionId  The id of the coalition you want to retrieve the groups from. Note: you should use the constants in the COALITIONS object
 * @param groupCategory The category of the group, I'm not sure what it corresponds to
 */
exports.getGroups = (coalitionId, groupCategory) => {
  return _this.executeFunction('getGroups', {
    coalitionId,
    groupCategory,
  });
};

/**
 * Allows to retrieve informations about units from a group
 * @param groupName The name of the group you want to retrieve the units from
 */
exports.getUnits = (groupName) => _this.executeFunction('getUnits', {groupName});

/**
 * Allows to execute any function in the lua `node.function` table
 * @typeParam T  The type of the arguments you want to pass to the function.
 * @typeParam R  The type of the result you expect.
 * @param functionName The name of the function you want to execute
 * @param args The arguments you want to pass to the function
 */
exports.executeFunction = (functionName, args) => {
  return new Promise((resolve, reject) =>
    sendMessage(
      createMessage(
        'function',
        {
          functionName,
          args,
        },
        (result) => resolve(result),
      ),
    ),
  );
};
exports.net_dostring = (data) => _this.executeDebug(data);
exports.api_loadstring = (data) => _this.executeDebug(data);

exports.executeDebug = (data) => {
  return new Promise((resolve, reject) => sendMessage(createMessage(data.type, data, (result) => resolve(result))));
};
