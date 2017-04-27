import test from 'ava';
import module from '../../index';

test('exports middleware', t => t.is(typeof module.middleware, 'function'));
test('exports handlePromiseAction', t => t.is(typeof module.handlePromiseAction, 'function'));
