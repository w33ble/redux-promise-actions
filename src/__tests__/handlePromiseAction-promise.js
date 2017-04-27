import test from 'ava';
import handlePromiseAction from '../handlePromiseAction';

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

test('should create REQUEST type reducer', (t) => {
  const checkType = `${type}_REQUEST`;
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

test('should create OK type reducer', (t) => {
  const checkType = `${type}_OK`;
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

test('should create ERROR type reducer', (t) => {
  const checkType = `${type}_ERROR`;
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
