import test from 'ava';
import helpers from '../helpers';

let payload;
let action;
let loadingAction;
let completedAction;

test.beforeEach(() => {
  payload = 'hello';
  action = {
    type: 'TEST_ACTION',
    payload,
  };
  loadingAction = Object.assign({}, action, { meta: { loading: true } });
  completedAction = Object.assign({}, action, { meta: { loading: false } });
});

['isLoading', 'isResolved', 'isRejected'].forEach((method) => {
  test(`${method} throws when missing meta property`, (t) => {
    const check = () => helpers[method](action);
    t.throws(check, 'Action does not have a meta property');
  });

  test(`${method} throws when missing loading property`, (t) => {
    const metaAction = Object.assign({}, action, { meta: { prop: 'val' } });
    const check = () => helpers[method](metaAction);
    t.throws(check, 'Action meta does not contain a loading property');
  });
});

// isLoading
test('isLoading returns true when loading', (t) => {
  t.true(helpers.isLoading(loadingAction));
});

test('isLoading returns false when loading', (t) => {
  t.false(helpers.isLoading(completedAction));
});

// isResolved
test('isResolved returns false when loading', (t) => {
  t.false(helpers.isResolved(loadingAction));
});

test('isResolved returns false when there is an error', (t) => {
  const failedAction = Object.assign({}, completedAction, { error: new Error('failed') });
  t.false(helpers.isResolved(failedAction));
});

test('isResolved returns true when failed', (t) => {
  t.true(helpers.isResolved(completedAction));
});

// isRejected
test('isRejected returns false when loading', (t) => {
  t.false(helpers.isRejected(loadingAction));
});

test('isRejected returns false when not failed', (t) => {
  t.false(helpers.isRejected(completedAction));
});

test('isRejected returns true when failed', (t) => {
  const failedAction = Object.assign({}, completedAction, { error: new Error('failed') });
  t.true(helpers.isRejected(failedAction));
});
