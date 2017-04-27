import { isPlainObject, isString, isSymbol } from './utils';

function isValidKey(key) {
  return [
    'type',
    'payload',
    'error',
    'meta',
  ].indexOf(key) > -1;
}

export default function isFSA(action) {
  const validActionType = (isString(action.type) || isSymbol(action.type));
  return (isPlainObject(action) && validActionType && Object.keys(action).every(isValidKey));
}
