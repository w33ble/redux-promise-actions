import test from 'ava';
import middleware from '../middleware';

let doDispatch;
let doGetState;
let nextHandler;
let payload;
let fsaActionObj;

test.beforeEach(() => {
  doDispatch = val => val;
  doGetState = () => ({});
  nextHandler = middleware({ dispatch: doDispatch, getState: doGetState });
  payload = 'fsa';
  fsaActionObj = {
    type: 'test',
    payload: Promise.resolve(payload),
  };
});

test.serial('calls onComplete on resolve, passing dispatch and getState', (t) => {
  t.plan(3);
  const onComplete = (dispatch, getState, results) => {
    t.is(dispatch, doDispatch);
    t.is(getState, doGetState);
    t.is(results, payload);
  };

  const actionObj = Object.assign({}, fsaActionObj, { meta: { onComplete } });
  const actionHandler = nextHandler();
  return actionHandler(actionObj);
});

test.serial('calls onFailure on reject, passing dispatch and getState', (t) => {
  t.plan(2);
  const onFailure = (dispatch, getState) => {
    t.is(dispatch, doDispatch);
    t.is(getState, doGetState);
  };

  const actionObj = Object.assign({}, fsaActionObj, {
    payload: Promise.reject('fail'),
    meta: { onFailure },
  });
  const actionHandler = nextHandler();
  return actionHandler(actionObj).catch(() => {}); // silence the rejected promise
});
