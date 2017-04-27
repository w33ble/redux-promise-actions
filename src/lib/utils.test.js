import test from 'ava';
import { isArray, isPlainObject, isFunction, isString, isSymbol } from './utils';

function checkTypesFail(t, fn, types) {
  for (let idx = 0; idx < types.length; idx += 1) {
    t.false(fn(types[idx]));
  }
}

const types = [
  {},
  [],
  () => {},
  true,
  1,
  'str',
  null,
  undefined,
  NaN,
  Symbol('hello'),
];

test('isArray returns true for arrays', (t) => {
  t.true(isArray([]));
});

test('isArray returns false for non-arrays', (t) => {
  checkTypesFail(t, isArray, types.filter((_, i) => i !== 1));
});

test('isPlainObject returns true for object', (t) => {
  t.true(isPlainObject({}));
});

test('isPlainObject returns false for non-objects', (t) => {
  checkTypesFail(t, isPlainObject, types.filter((_, i) => i !== 0));
});

test('isFunction returns true for object', (t) => {
  const fn = () => {};
  t.true(isFunction(fn));
});

test('isFunction returns false for non-objects', (t) => {
  checkTypesFail(t, isFunction, types.filter((_, i) => i !== 2));
});

test('isString returns true for string', (t) => {
  t.true(isString('hello world'));
});

test('isString returns false for non-string', (t) => {
  checkTypesFail(t, isString, types.filter((_, i) => i !== 5));
});

test('isSymbol returns true for symbol', (t) => {
  t.true(isSymbol(Symbol('hello')));
});

test('isSymbol returns false for non-symbol', (t) => {
  checkTypesFail(t, isSymbol, types.filter((_, i) => i !== 9));
});
