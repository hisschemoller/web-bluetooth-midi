import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';

export const REQUEST_DEVICE = 'REQUEST_DEVICE';

export function setup() {
  addEventListeners();
}

function addEventListeners() {
  document.addEventListener(STATE_CHANGE, handleStateChanges);
}

function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {
    case actions.ACTION:
      break;
  }
}
