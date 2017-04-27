import test from 'ava';
import isFsa from '../lib/is_fsa';

test('return true on fsa', (t) => {
  const actions = [{
    type: 'test',
    payload: 'food',
  }, {
    type: 'test',
    payload: 'food',
    meta: 'meta string',
  }, {
    type: 'test',
    payload: 'food',
    meta: { obj: 'meta object' },
  }, {
    type: 'test',
    payload: 'food',
    error: new Error('err'),
  }, {
    type: Symbol('test'),
    payload: 'food',
    error: new Error('err'),
  }];

  actions.forEach(action => t.true(isFsa(action)));
});

test('return true on non-fsa', (t) => {
  const actions = [{
    type: 'test',
    payload: 'food',
    something: 'invalid prop',
  }, {
    type: [1],
    payload: 'food',
    meta: 'bad type',
  }, {
    type: () => {},
    payload: 'food',
    meta: { obj: 'another bad type' },
  }, {
    obj: 'just some object',
  }, 'string', Symbol('symbol')];

  actions.forEach(action => t.false(isFsa(action)));
});
