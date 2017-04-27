const { isPlainObject, isString, isSymbol } = require('@w33bletools/simpleutils');

function isValidKey(key) {
  return [
    'type',
    'payload',
    'error',
    'meta',
  ].indexOf(key) > -1;
}

module.exports = function isFSA(action) {
  const validActionType = (isString(action.type) || isSymbol(action.type));
  return (isPlainObject(action) && validActionType && Object.keys(action).every(isValidKey));
};
