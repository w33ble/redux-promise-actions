const { createAction } = require('redux-actions');
const { isPlainObject, isFunction } = require('@w33bletools/simpleutils');
const actionTypes = require('./actionTypes');
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
  const loadingMeta = () => Object.assign({}, metaObj, { loading: true });
  const loadedMeta = () => Object.assign({}, metaObj, { loading: false });

  return {
    request: createAction(`${type}_${actionTypes.request}`, null, loadingMeta),
    ok: createAction(`${type}_${actionTypes.ok}`, null, loadedMeta),
    error: createAction(`${type}_${actionTypes.error}`, null, loadedMeta),
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
