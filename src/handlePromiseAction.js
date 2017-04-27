const { handleActions } = require('redux-actions');
const { identity } = require('@w33bletools/simpleutils');

module.exports = function handlePromiseAction(type, reducer = identity, defaultState) {
  return handleActions({
    [`${type}_REQUEST`]: reducer,
    [`${type}_OK`]: reducer,
    [`${type}_ERROR`]: reducer,
  }, defaultState);
};
