const {v4} = require('uuid');
const {getStore} = require('./store/store');
const {mutate, mutationNames} = require('./store/mutation');
/** @internal */
exports.executeCallback = (callbackId, args) => {
  if (!callbackId) {
    return;
  }
  const callbacks = getStore().callbacks;
  const callback = callbacks.get(callbackId);
  if (!callback) {
    console.error('ERROR: No callback found for id: ', callbackId);
    return;
  }
  callbacks.delete(callbackId);
  callback(args || {});
  mutate(mutationNames.SET_CALLBACKS, {callbacks});
};

/** @internal */
exports.storeCallback = (callback) => {
  if (!callback) {
    return;
  }
  const callbackId = v4().toString();
  const callbacks = getStore().callbacks;
  callbacks.set(callbackId, callback);
  mutate(mutationNames.SET_CALLBACKS, {callbacks});
  return callbackId;
};
