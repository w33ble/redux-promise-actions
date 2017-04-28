import test from 'ava';
import actionTypes from '../actionTypes';
import { onRequest, onSuccess, onError } from '../helpers';

test('onRequest wraps the action name', (t) => {
  const actionType = 'TEST_ACTION';
  const expect = `${actionType}_${actionTypes.request}`;
  t.is(onRequest(actionType), expect);
});

test('onSuccess wraps the action name', (t) => {
  const actionType = 'TEST_ACTION';
  const expect = `${actionType}_${actionTypes.ok}`;
  t.is(onSuccess(actionType), expect);
});

test('onError wraps the action name', (t) => {
  const actionType = 'TEST_ACTION';
  const expect = `${actionType}_${actionTypes.error}`;
  t.is(onError(actionType), expect);
});
