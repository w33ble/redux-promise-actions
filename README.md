# redux-promise-actions

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/w33ble/redux-promise-actions/master/LICENSE)
[![Build Status](https://travis-ci.org/w33ble/redux-promise-actions.svg?branch=master)](https://travis-ci.org/w33ble/redux-promise-actions)
[![npm](https://img.shields.io/npm/v/redux-promise-actions.svg)](https://www.npmjs.com/package/redux-promise-actions)

[Flux Standard Action](https://github.com/acdlite/flux-standard-action) promise utilities for Redux. 

Seemlessly handles actions with a Promise-based payload. Functions similar to [redux-promise](https://github.com/acdlite/redux-promise), but dispatches extra actions when met with a Promise as the payload. Includes a reducer helper to deal with the pending, complete, and failed states of the payload.

## Installation

Use npm, yarn, or whatever to install

```bash
npm install --save redux-promise-actions
```

## Usage

### Apply the Middleware

Apply the middleware to your Redux store. It works similarly to [redux-promise](https://github.com/acdlite/redux-promise), allowing you to simply use a Promise in your action's payload wihout any extra work.

```js
import { createStore, applyMiddleware } from 'redux';
import { middleware } from 'redux-promise-actions';
import rootReducer from './path/to/root_reducer';
const initialState = {};
const store = createStore(rootReducer, initialState, applyMiddleware(middleware));
```

### Create your action

This is best used with [redux-actions](https://github.com/acdlite/redux-actions), but any FSA-compliant action creator will work. 

```js
// using redux-actions
import { createAction } from 'redux-actions';
import { ADD_TODO } from '../actionTypes'

export addTodo = createAction(ADD_TODO, Promise.resolve);
```

Or you can create your own FSA-compliant action by hand.

```js
// creating an action by hand
import { ADD_TODO } from '../actionTypes'

export addTodo = (payload) => ({
  type: ADD_TODO, 
  payload: Promise.resolve(payload),
})
```

### Create your reducer

When you use an FSA-compliant action with a Promise payload, the middleware will turn your action into 3 different actions, one that fires immediately, one for the promise resolution, and one for the promise failure. You can use the FSA action's `meta` property to check the loading state of the action. 

The most seamless way to deal with these states is to use the `handlePromiseAction` reducer creator included in this module. The reducer is called at least twice, first *before* promise resultion, and again when it resolves or rejects.

```js
import { handlePromiseAction, isLoading, isResolved, isRejected } from 'redux-promise-actions';
import { ADD_TODO } from '../actionTypes'

handlePromiseAction(ADD_TODO, (state, action) => {
  // alternatively, use the action's 'meta.loading' property
  if (isLoading(action)) {
    // promise is still not resolved
  }

  // alternatively, use the action's 'meta.loading' and 'error' properties
  if (isResolved(action)) {
    // promise has resolved, reduce your state
  }

  // alternatively, use the action's 'meta.loading' and 'error' properties
  if (isRejected(action)) {
    // promise was rejected, handle the error somehow

  }

  return state;
})
```

### Create your reducer using action type helpers

If the reducer wrapper is too much for you, you can use the included helpers to generate the associated action types for you.

```js
import { onRequest, onSuccess, onError } from 'redux-promise-actions';
import { ADD_TODO } from '../actionTypes'


return reducer((state, action) => {
  switch(action.type) {
    case onRequest(ADD_TODO):
      // handle the request action
      break;
    case onSuccess(ADD_TODO):
      // handle the successful promise resolution
      break;
    case onError(ADD_TODO):
      // handle the promise rejection
      break;
  }
});
```

### Create your reducer completely by hand

If you rather write your reducers completely by hand, that's also possible. The actions types are named as follows:

#### `<type>_REQUEST`

This action fires immediately, before the promise resolves or rejects. `action.meta.loading` is `true`.

#### `<type>_SUCCESS`

This action fires when the promise successfully resolves. `action.meta.loading` is `false`.

#### `<type>_ERROR`

This action fires when the promise is rejected. `action.meta.loading` is `false`.

```js
import { handlePromiseAction } from 'redux-promise-actions';
import { ADD_TODO } from '../actionTypes'

return reducer((state, action) => {
  switch(action.type) {
    case ADD_TODO_REQUEST:
      // handle the request action
      break;

    case ADD_TODO_SUCCESS:
      // handle the successful promise resolution
      break;

    case ADD_TODO_ERROR:
      // handle the promise rejection
      break;
  }
})
```

### Dispatching on Completion or Error

If you need redux-thunk-like access to your store's `dispatch` or `getState` functions, you do that using the `meta` property of the action. There are two callbacks you can add to your promise actions:

#### `onComplete(dispatch, getState, resolvedPayload)`

This is called when the promise resolves successfully.

#### `onFailure(dispatch, getState)`

This is called when the promise rejects.

If you are using `redux-actions`, you can configure callbacks on your actions using the `metaCreator` function in `createAction`:

```js
// using redux-actions
import { createAction } from 'redux-actions';
import { ADD_TODO, ANOTHER_ACTION } from '../actionTypes'

export someOtherActionCreator = createAction(ANOTHER_ACTION);

export addTodo = createAction(ADD_TODO, Promise.resolve, () => {
  onComplete: (dispatch, getState, resovledPayload) => dispatch(someOtherActionCreator()),
  onFailure: (dispatch, getState) => dispatch(someOtherActionCreator()),
});
```

Or, create your FSA action by hand and add one or both of those callbacks to the `meta` property:

```js
// creating an action by hand
import { ADD_TODO } from '../actionTypes'

export addTodo = (payload) => ({
  type: ADD_TODO, 
  payload: Promise.resolve(payload),
  meta: {
    onComplete: (dispatch, getState, resovledPayload) => dispatch(someOtherActionCreator()),
    onFailure: (dispatch, getState, resovledPayload) => dispatch(someOtherActionCreator()),
  },
})
```
