import { createAction } from 'redux-actions';
import { isFunction } from '@w33bletools/simpleutils';
import isFSA from './lib/is_fsa';

function isPromise(val) {
  return val && typeof val.then === 'function';
}

const getActions = (type, meta) => ({
  request: createAction(`${type}_REQUEST`, null, () => Object.assign({}, meta, { loading: true })),
  ok: createAction(`${type}_OK`, null, () => Object.assign({}, meta, { loading: false })),
  error: createAction(`${type}_ERROR`, null, () => Object.assign({}, meta, { loading: false })),
});

export default function promiseMiddleware({ dispatch, getState }) {
  return next => (action) => {
    if (!isFSA(action)) {
      return isPromise(action) ? action.then(dispatch) : next(action);
    }

    const { request, ok, error } = getActions(action.type, action.meta);

    if (isPromise(action.payload)) {
      dispatch(request());

      return action.payload
      .then((result) => {
        const hasCallback = (action.meta && isFunction(action.meta.callback));
        if (hasCallback) action.meta.callback(dispatch, getState, result);
        return dispatch(ok(result));
      })
      .catch((err) => {
        dispatch(error(err));
        return Promise.reject(err);
      });
    }

    return next(action);
  };
}
