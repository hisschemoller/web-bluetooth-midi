import { dispatch, getActions, getState, persist } from './store/store.js';
import { setup as setupAudio } from './audio/audio.js';
import { setup as setupBluetooth } from './bluetooth/bluetooth.js';
import { setup as setupControls } from './view/controls.js';
import { setup as setupPads } from './view/pads.js';

async function main() {
  setupAudio();
  setupBluetooth();
  setupControls();
  setupPads();
  persist();
}

main();
