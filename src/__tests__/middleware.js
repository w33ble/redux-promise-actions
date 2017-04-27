import test from 'ava';
import middleware from '../middleware';

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

test('actionHandler passes FSA action to next if not a promise', (t) => {
  t.plan(1);
  const fsaActionObj = {
    type: 'test',
    payload: '12',
  };

  const actionHandler = nextHandler(action => t.is(action, fsaActionObj));
  actionHandler(fsaActionObj);
});
