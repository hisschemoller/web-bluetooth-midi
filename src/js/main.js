import { dispatch, getActions, getState, persist } from './store/store.js';
import { setup as setupControls } from './view/controls.js';
import { setup as setupBluetooth } from './bluetooth/bluetooth.js';

async function main() {
  setupControls();
  setupBluetooth();
  persist();
}

main();
