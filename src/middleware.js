const { createAction } = require('redux-actions');
const { isPlainObject, isFunction } = require('@w33bletools/simpleutils');
const isFSA = require('./lib/is_fsa');

function isPromise(val) {
  return val && typeof val.then === 'function';
}

function isUndefined(val) {
  return typeof val === 'undefined';
}

function hasCallback(meta, name) {
  return (meta && isFunction(meta[name]));
}

function getActions(type, meta) {
  const metaObj = (isPlainObject(meta) || isUndefined(meta)) ? meta : { meta };

  return {
    request: createAction(`${type}_REQUEST`, null, () => Object.assign({}, metaObj, { loading: true })),
    ok: createAction(`${type}_OK`, null, () => Object.assign({}, metaObj, { loading: false })),
    error: createAction(`${type}_ERROR`, null, () => Object.assign({}, metaObj, { loading: false })),
  };
}

module.exports = function promiseMiddleware({ dispatch, getState }) {
  return next => (action) => {
    if (!isFSA(action)) {
      return isPromise(action) ? action.then(dispatch) : next(action);
    }

    const { request, ok, error } = getActions(action.type, action.meta);

    if (isPromise(action.payload)) {
      dispatch(request());

      return action.payload
      .then((result) => {
        if (hasCallback(action.meta, 'onComplete')) action.meta.onComplete(dispatch, getState, result);
        return dispatch(ok(result));
      })
      .catch((err) => {
        if (hasCallback(action.meta, 'onFailure')) action.meta.onFailure(dispatch, getState);
        dispatch(error(err));
        return Promise.reject(err);
      });
    }

    return next(action);
  };
};
