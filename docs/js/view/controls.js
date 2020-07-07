import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';

const rootEl = document.querySelector('#controls');
const connectBtn = rootEl.querySelector('.btn-connect');
const messageEl = rootEl.querySelector('.ble-status');

/**
 * Add event listeners.
 */
function addEventListeners() {
  const actions = getActions();

  document.addEventListener(STATE_CHANGE, handleStateChanges);
  
  connectBtn.addEventListener('click', e => {
    dispatch(actions.bluetoothConnect());
  });
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

/**
 * App state changed.
 * @param {Event} e Custom event.
 */
function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

    case actions.BLUETOOTH_CONNECT:
      messageEl.textContent = 'Connecting...';
      connectBtn.setAttribute('disabled', 'disabled');
      break;

    case actions.BLUETOOTH_DISCONNECT:
      messageEl.textContent = 'Bluetooth disconnected.';
      connectBtn.removeAttribute('disabled');
      break;

    case actions.BLUETOOTH_ERROR:
      messageEl.textContent = 'Bluetooth error!';
      connectBtn.removeAttribute('disabled');
      break;
      
    case actions.BLUETOOTH_SUCCESS:
      messageEl.textContent = 'Bluetooth connected!';
      break;
  }
}

/**
 * Module setup at app start.
 */
export function setup() {
  addEventListeners();
}
