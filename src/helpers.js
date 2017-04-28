const { request, ok, error } = require('./actionTypes');

// action type name helpers
exports.onRequest = actionType => `${actionType}_${request}`;
exports.onSuccess = actionType => `${actionType}_${ok}`;
exports.onError = actionType => `${actionType}_${error}`;

// action promise status helpers
const getMetaValue = (action, name) => {
  if (!action.meta) throw new Error('Action does not have a meta property');
  return action.meta[name];
};
exports.isLoading = (action) => {
  const loading = getMetaValue(action, 'loading');
  if (typeof loading === 'undefined') {
    throw new Error('Action meta does not contain a loading property');
  }
  return loading;
};
exports.isResolved = action => !exports.isLoading(action) && !Boolean(action.error);
exports.isRejected = action => !exports.isLoading(action) && Boolean(action.error);
