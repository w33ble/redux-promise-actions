import test from 'ava';
import handlePromiseAction from '../handlePromiseAction';

// let actionCreator;
let type;
let defaultState;

test.beforeEach(() => {
  type = 'TEST_TYPE';
  defaultState = { counter: 0 };
});

test('throws when defaultState is not defined', (t) => {
  const check = () => handlePromiseAction(type, () => null);
  const err = t.throws(check);
  t.regex(err.message, /defaultState.+should be defined/);
});

test('throws if reducer is the wrong type', (t) => {
  const wrongTypeReducers = [1, 'string', []];

  wrongTypeReducers.forEach((wrong) => {
    const check = () => handlePromiseAction(type, wrong, {});
    const err = t.throws(check);
    t.regex(err.message, /Expected.+function or object/);
  });
});

test('uses identity function with null reducer', (t) => {
  const okTypeReducers = [null, undefined];
  const action = {
    type: 'TEST',
    payload: 100,
  };

  okTypeReducers.forEach((ok) => {
    const reducer = handlePromiseAction(type, ok, defaultState);
    t.deepEqual(reducer(undefined, action), { counter: 0 });
  });
});

test('exports a reducer function', (t) => {
  const reducer = handlePromiseAction(type, () => null, defaultState);
  t.is(typeof reducer, 'function');
});

test('returns state if type does not match', (t) => {
  const reducer = handlePromiseAction('NOPE', () => null, {});
  const state = { hello: 'world' };
  t.is(reducer(state, { type }), state);
});

test('uses defaultState when state is undefined', (t) => {
  const reducer = handlePromiseAction('NOPE', () => null, defaultState);
  t.is(reducer(undefined, { type }), defaultState);
});
