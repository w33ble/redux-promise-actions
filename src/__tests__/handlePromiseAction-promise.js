import test from 'ava';
import handlePromiseAction from '../handlePromiseAction';
import { request, ok, error } from '../actionTypes';

// let actionCreator;
let type;
let defaultState;
let payload;
let fsaAction;

test.beforeEach(() => {
  type = 'TEST_TYPE';
  defaultState = { counter: 0 };
  payload = 7;
  fsaAction = {
    type,
    payload,
  };
});

test('should create request type reducer', (t) => {
  const checkType = `${type}_${request}`;
  const okAction = Object.assign({}, fsaAction, { type: checkType });

  const reducerFn = (state, action) => {
    if (action.type === checkType) {
      return Object.assign({}, state, { counter: state.counter + action.payload });
    }
    return state;
  };

  const reducer = handlePromiseAction(type, reducerFn, defaultState);
  t.deepEqual(reducer(undefined, okAction), { counter: 7 });
});

test('should create ok type reducer', (t) => {
  const checkType = `${type}_${ok}`;
  const okAction = Object.assign({}, fsaAction, { type: checkType });

  const reducerFn = (state, action) => {
    if (action.type === checkType) {
      return Object.assign({}, state, { counter: state.counter + action.payload });
    }
    return state;
  };

  const reducer = handlePromiseAction(type, reducerFn, defaultState);
  t.deepEqual(reducer(undefined, okAction), { counter: 7 });
});

test('should create error type reducer', (t) => {
  const checkType = `${type}_${error}`;
  const okAction = Object.assign({}, fsaAction, { type: checkType });

  const reducerFn = (state, action) => {
    if (action.type === checkType) {
      return Object.assign({}, state, { counter: state.counter + action.payload });
    }
    return state;
  };

  const reducer = handlePromiseAction(type, reducerFn, defaultState);
  t.deepEqual(reducer(undefined, okAction), { counter: 7 });
});
