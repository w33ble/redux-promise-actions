const { handleActions } = require('redux-actions');
const { identity } = require('@w33bletools/simpleutils');
const { onRequest, onSuccess, onError } = require('./helpers');

module.exports = function handlePromiseAction(type, reducer = identity, defaultState) {
  const handlers = {
    [onRequest(type)]: reducer,
    [onSuccess(type)]: reducer,
    [onError(type)]: reducer,
  };
  return handleActions(handlers, defaultState);
};
