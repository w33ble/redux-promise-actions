const { handleActions } = require('redux-actions');
const { identity } = require('@w33bletools/simpleutils');
const { onRequest, onSuccess, onError } = require('./helpers');

module.exports = function handlePromiseAction(type, reducer = identity, defaultState) {
  const finalReducer = (reducer == null) ? identity : reducer;
  const handlers = {
    [onRequest(type)]: finalReducer,
    [onSuccess(type)]: finalReducer,
    [onError(type)]: finalReducer,
  };

  return handleActions(handlers, defaultState);
};
