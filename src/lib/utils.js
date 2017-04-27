export function isArray(arr) {
  return Array.isArray(arr);
}

export function isPlainObject(obj) {
  return (obj != null && typeof obj === 'object' && !isArray(obj));
}

export function isFunction(fn) {
  return typeof fn === 'function';
}

export function isString(obj) {
  return typeof obj === 'string';
}

export function isSymbol(obj) {
  return typeof obj === 'symbol';
}

export function identity(payload) {
  return payload;
}
