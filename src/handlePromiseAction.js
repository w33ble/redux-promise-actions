const { handleActions } = require('redux-actions');
const { identity } = require('@w33bletools/simpleutils');
const actionTypes = require('./actionTypes');

module.exports = function handlePromiseAction(type, reducer = identity, defaultState) {
  const actionValues = Object.keys(actionTypes).map(key => actionTypes[key]);
  const handlers = actionValues.reduce((acc, actionType) => Object.assign(acc, {
    [`${type}_${actionType}`]: reducer,
  }), {});
  return handleActions(handlers, defaultState);
};
