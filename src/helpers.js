const { request, ok, error } = require('./actionTypes');

exports.onRequest = actionType => `${actionType}_${request}`;
exports.onSuccess = actionType => `${actionType}_${ok}`;
exports.onError = actionType => `${actionType}_${error}`;
