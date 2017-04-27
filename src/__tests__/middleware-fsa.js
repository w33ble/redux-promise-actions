import test from 'ava';
import middleware from '../middleware';

let doDispatch;
let doGetState;
let nextHandler;
let payload;
let fsaActionObj;

function createActionTypeHandler(t, actionTypes) {
  let callIndex = 0;
  doDispatch = (action) => {
    t.is(action.type, actionTypes[callIndex]);
    callIndex += 1;
  };
  return middleware({ dispatch: doDispatch, getState: doGetState });
}

function createActionHandler(t, dispatchFn) {
  let callIndex = 0;
  doDispatch = (action) => {
    dispatchFn(action, callIndex);
    callIndex += 1;
  };
  return middleware({ dispatch: doDispatch, getState: doGetState });
}

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

test('actionHandler passes FSA action to next if not a promise', (t) => {
  t.plan(1);

  const actionObj = Object.assign({}, fsaActionObj, { payload: 'sync' });
  const actionHandler = nextHandler(action => t.is(action, actionObj));
  return actionHandler(actionObj);
});

test('actionHandler returns value as expected if FSA payload promise', (t) => {
  t.plan(1);
  const expected = {
    type: 'test_OK',
    payload,
    meta: {
      loading: false,
      testing: true,
    },
  };
  const actionObj = Object.assign({}, fsaActionObj, { meta: { testing: true } });

  const actionHandler = nextHandler();
  return actionHandler(actionObj).then(action => t.deepEqual(action, expected));
});

test('actionHandler dispatches request & ok actions in order if resolved', (t) => {
  t.plan(2);
  const actionTypes = ['test_REQUEST', 'test_OK'];

  nextHandler = createActionTypeHandler(t, actionTypes);

  const actionHandler = nextHandler();
  return actionHandler(fsaActionObj);
});

test('actionHandler dispatches request & error actions in order if rejected', (t) => {
  t.plan(2);
  const actionTypes = ['test_REQUEST', 'test_ERROR'];
  const action = Object.assign({}, fsaActionObj, { payload: Promise.reject('nope') });

  nextHandler = createActionTypeHandler(t, actionTypes);

  const actionHandler = nextHandler();
  return actionHandler(action).catch(() => 'silence'); // silence the rejected promise
});

test('adding loading info to metadata onto the action', (t) => {
  t.plan(2);

  nextHandler = createActionHandler(t, (action, callIndex) => {
    const metaObj = (callIndex === 0) ? { loading: true } : { loading: false };
    t.deepEqual(action.meta, metaObj);
  });

  const actionHandler = nextHandler();
  return actionHandler(fsaActionObj);
});

test('mixes metadata onto onto the action', (t) => {
  t.plan(2);

  nextHandler = createActionHandler(t, (action, callIndex) => {
    const metaObj = (callIndex === 0) ? {
      loading: true,
      msg: 'i am metadata',
    } : {
      loading: false,
      msg: 'i am metadata',
    };
    t.deepEqual(action.meta, metaObj);
  });

  const actionObj = Object.assign({}, fsaActionObj, { meta: { msg: 'i am metadata' } });
  const actionHandler = nextHandler();
  return actionHandler(actionObj);
});

test('mixes metadata onto onto the action, adds non-object meta to meta key', (t) => {
  t.plan(2);

  nextHandler = createActionHandler(t, (action, callIndex) => {
    const metaObj = (callIndex === 0) ? {
      loading: true,
      meta: 'i am metadata',
    } : {
      loading: false,
      meta: 'i am metadata',
    };
    t.deepEqual(action.meta, metaObj);
  });

  const actionObj = Object.assign({}, fsaActionObj, { meta: 'i am metadata' });
  const actionHandler = nextHandler();
  return actionHandler(actionObj);
});
