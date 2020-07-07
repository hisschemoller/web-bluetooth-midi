import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';

const rootEl = document.querySelector('#controls');
const scanBtn = rootEl.querySelector('.btn-scan');
const disconnectBtn = rootEl.querySelector('.btn-disconnect');
const reconnectBtn = rootEl.querySelector('.btn-reconnect');
const readBtn = document.querySelector('#controls .btn-read');
const writeBtn = document.querySelector('#controls .btn-write');
const subscribeBtn = document.querySelector('#controls .btn-subscribe');
const unsubscribeBtn = document.querySelector('#controls .btn-unsubscribe');
const resetKeyCombo = [];

export function setup() {
  addEventListeners();
}

function addEventListeners() {
  const actions = getActions();

  document.addEventListener(STATE_CHANGE, handleStateChanges);
  
  scanBtn.addEventListener('click', e => {
    dispatch(actions.connectBluetooth());
  });
  // disconnectBtn.addEventListener('click', disconnectDevice);
  // reconnectBtn.addEventListener('click', reconnectDevice);
  // readBtn.addEventListener('click', readCharacteristic);
  // writeBtn.addEventListener('click', writeCharacteristic);
  // subscribeBtn.addEventListener('click', subscribeToNotifications);
  // unsubscribeBtn.addEventListener('click', unsubscribeFromNotifications);
  document.addEventListener('keydown', e => {

    // don't perform shortcuts while typing in a text input.
    if (!(e.target.tagName.toLowerCase() == 'input' && e.target.getAttribute('type') == 'text')) {
      switch (e.keyCode) {
        
        // w
        case 87:
          console.log(getState());
          break;
      }
    }
  });
}

function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {
    case actions.ACTION:
      break;
  }
}
