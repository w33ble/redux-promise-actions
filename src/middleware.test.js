import test from 'ava';
import middleware from './middleware';

let doDispatch;
let doGetState;
let nextHandler;

test.beforeEach(() => {
  doDispatch = val => val;
  doGetState = () => ({});
  nextHandler = middleware({ dispatch: doDispatch, getState: doGetState });
});

test('must throw if argument is non-object', (t) => {
  const check = () => middleware();
  t.throws(check);
});

test('nextHandler returns a function to handle next', (t) => {
  t.is(typeof nextHandler, 'function');
  t.is(nextHandler.length, 1);
});

test('actionHandler returns a function to handle action', (t) => {
  const actionHandler = nextHandler();
  t.is(typeof actionHandler, 'function');
  t.is(actionHandler.length, 1);
});

// non-FSA checks
test('actionHandler passes action to next if not a promise', (t) => {
  t.plan(1);
  const actionObj = {};

  const actionHandler = nextHandler(action => t.is(action, actionObj));
  actionHandler(actionObj);
});

test('actionHandler returns value as expected if a promise', (t) => {
  t.plan(1);
  const expected = 'rocks';
  const actionHandler = nextHandler();

  return actionHandler(Promise.resolve(expected)).then((action) => {
    t.is(action, expected);
  });
});

// FSA checks
test('actionHandler passes FSA action to next if not a promise', (t) => {
  t.plan(1);
  const fsaActionObj = {
    type: 'test',
    payload: '12',
    error: null,
    meta: {},
  };

  const actionHandler = nextHandler(action => t.is(action, fsaActionObj));
  actionHandler(fsaActionObj);
});

test('actionHandler returns value as expected if FSA payload promise', (t) => {
  t.plan(1);
  const payload = 'rocks';
  const expected = {
    type: 'test_OK',
    payload,
    meta: {
      loading: false,
      testing: true,
    },
  };
  const fsaActionObj = {
    type: 'test',
    payload: Promise.resolve(payload),
    meta: {
      testing: true,
    },
  };

  const actionHandler = nextHandler();
  return actionHandler(fsaActionObj).then(action => t.deepEqual(action, expected));
});

test('actionHandler dispatches request & ok actions in order if resolved', (t) => {
  t.plan(2);
  let callIndex = 0;
  const actionTypes = ['test_REQUEST', 'test_OK'];

  doDispatch = (action) => {
    t.is(action.type, actionTypes[callIndex]);
    callIndex += 1;
  };
  nextHandler = middleware({ dispatch: doDispatch, getState: doGetState });

  const fsaActionObj = {
    type: 'test',
    payload: Promise.resolve('ok'),
  };

  const actionHandler = nextHandler();
  return actionHandler(fsaActionObj);
});


test('actionHandler dispatches request & error actions in order if rejected', (t) => {
  t.plan(2);
  let callIndex = 0;
  const actionTypes = ['test_REQUEST', 'test_ERROR'];

  doDispatch = (action) => {
    t.is(action.type, actionTypes[callIndex]);
    callIndex += 1;
  };
  nextHandler = middleware({ dispatch: doDispatch, getState: doGetState });

  const fsaActionObj = {
    type: 'test',
    payload: Promise.reject('nope'),
  };

  const actionHandler = nextHandler();
  return actionHandler(fsaActionObj)
  .catch(() => 'silence'); // silence the rejected promise
});

test('adding loading info to metadata onto the action', (t) => {
  t.plan(2);
  let callIndex = 0;

  doDispatch = (action) => {
    const metaObj = (callIndex === 0) ? { loading: true } : { loading: false };
    t.deepEqual(action.meta, metaObj);
    callIndex += 1;
  };
  nextHandler = middleware({ dispatch: doDispatch, getState: doGetState });

  const fsaActionObj = {
    type: 'test',
    payload: Promise.resolve('yup'),
  };

  const actionHandler = nextHandler();
  return actionHandler(fsaActionObj);
});

test('mixes metadata onto onto the action', (t) => {
  t.plan(2);
  let callIndex = 0;

  doDispatch = (action) => {
    const metaObj = (callIndex === 0) ? {
      loading: true,
      msg: 'i am metadata',
    } : {
      loading: false,
      msg: 'i am metadata',
    };
    t.deepEqual(action.meta, metaObj);
    callIndex += 1;
  };
  nextHandler = middleware({ dispatch: doDispatch, getState: doGetState });

  const fsaActionObj = {
    type: 'test',
    payload: Promise.resolve('yup'),
    meta: { msg: 'i am metadata' },
  };

  const actionHandler = nextHandler();
  return actionHandler(fsaActionObj);
});

test('mixes metadata onto onto the action, adds non-object meta to meta key', (t) => {
  t.plan(2);
  let callIndex = 0;

  doDispatch = (action) => {
    const metaObj = (callIndex === 0) ? {
      loading: true,
      meta: 'i am metadata',
    } : {
      loading: false,
      meta: 'i am metadata',
    };
    t.deepEqual(action.meta, metaObj);
    callIndex += 1;
  };
  nextHandler = middleware({ dispatch: doDispatch, getState: doGetState });

  const fsaActionObj = {
    type: 'test',
    payload: Promise.resolve('yup'),
    meta: 'i am metadata',
  };

  const actionHandler = nextHandler();
  return actionHandler(fsaActionObj);
});
