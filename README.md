# redux-promise-actions

[![Build Status](https://travis-ci.org/w33ble/redux-promise-actions.svg?branch=master)](https://travis-ci.org/w33ble/redux-promise-actions)

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
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { middleware } from 'redux-promise-actions';
const store = createStore(rootReducer, initialState, applyMiddleware(middleware));
```

### Create your action

This is best used with [redux-actions](https://github.com/acdlite/redux-actions), but any FSA-compliant action creator will work. 

```js
// using redux-actions
import { ADD_TODO } from '../actionTypes'
import { createAction } from 'redux-actions';

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

The most seamless way to deal with these states is to use the `handlePromiseAction` reducer creator included in this module.

```js
import { ADD_TODO } from '../actionTypes'
import { handlePromiseAction } from 'redux-promise-actions';


handlePromiseAction(ADD_TODO, (state, action) => {
  // reducer is called at least twice, first before promise resultion, 
  // and again when it resolves or rejects

  // use the action's 'meta.loading' and 'error' properties accordingly
  if (!action.meta.loading && !action.error) {
    // the promise is ready
    // the promise has resolved successfully
    // return your modified state
  } else {
    // the promise is ready
    // the promise rejected
    // handle handle the error somehow
  }

  return state;
})
```

You can also write your reducers by hand. The actions types are named as follows:

#### `<type>_REQUEST`

This action fires immediately, before the promise resolves or rejects. `action.meta.loading` is `true`.

#### `<type>_OK`

This action fires when the promise successfully resolves. `action.meta.loading` is `false`.

#### `<type>_ERROR`

This action fires when the promise is rejected. `action.meta.loading` is `false`.

```js
import { ADD_TODO } from '../actionTypes'
import { handlePromiseAction } from 'redux-promise-actions';

return reducer((state, action) => {
  switch(action.type) {
    case ADD_TODO_REQUEST:
      // happens before promise resultion
      break;

    case ADD_TODO_OK:
      // happens when the promise successfully resolves
      break;

    case ADD_TODO_ERROR:
      // happens when the promise rejected
      break;

    default:
      // some other action has happened
      return state;
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
import { ADD_TODO, ANOTHER_ACTION } from '../actionTypes'
import { createAction } from 'redux-actions';

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
