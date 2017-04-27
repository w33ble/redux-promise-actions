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

test('nextHandler must return a function to handle next', (t) => {
  t.is(typeof nextHandler, 'function');
  t.is(nextHandler.length, 1);
});

test('actionHandler must return a function to handle action', (t) => {
  const actionHandler = nextHandler();
  t.is(typeof actionHandler, 'function');
  t.is(actionHandler.length, 1);
});

// non-FSA checks
test('actionHandler must pass action to next if not a promise', (t) => {
  t.plan(1);
  const actionObj = {};

  const actionHandler = nextHandler(action => t.is(action, actionObj));
  actionHandler(actionObj);
});

test('actionHandler must return value as expected if a promise', (t) => {
  t.plan(1);
  const expected = 'rocks';
  const actionHandler = nextHandler();

  return actionHandler(Promise.resolve(expected)).then((action) => {
    t.is(action, expected);
  });
});

// FSA checks
test('actionHandler must pass FSA action to next if not a promise', (t) => {
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

test('actionHandler must return value as expected if FSA payload promise', (t) => {
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
  const actionHandler = nextHandler();
  const fsaActionObj = {
    type: 'test',
    payload: Promise.resolve(payload),
    meta: {
      testing: true,
    },
  };

  return actionHandler(fsaActionObj).then(action => t.deepEqual(action, expected));
});
