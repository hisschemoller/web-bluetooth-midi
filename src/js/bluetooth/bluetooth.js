import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';

const bluetoothServiceUUID = '03b80e5a-ede8-4b33-a751-6ce34ec4c700';
let device, server, service, characteristic;

function addEventListeners() {
  document.addEventListener(STATE_CHANGE, handleStateChanges);
}

/**
 * Bluetooth device scan, connect and subscribe.
 */
async function connect() {
  const options = {
    filters: [{
      services: [ bluetoothServiceUUID ],
    }],
  };
	try {
    console.log('requesting bluetooth device...');
		device = await navigator.bluetooth.requestDevice(options);
		device.addEventListener('gattserverdisconnected', e => {
      console.log('bluetooth device disconnected');
    });
    console.log('> bluetooth device found');
		if (!device.gatt.connected) {
      console.log('> bluetooth device connecting...');
      server = await device.gatt.connect();
      console.log('> bluetooth device connected');
      service = await server.getPrimaryService(bluetoothServiceUUID);
      console.log('> bluetooth service found');
      const characteristics = await service.getCharacteristics();
      characteristic = characteristics[0];
      console.log('> bluetooth characteristic found');
      if (characteristic.properties.notify) {
        console.log('> bluetooth characteristic has notifications');
        await characteristic.startNotifications();
        console.log('> bluetooth subscribed to notifications');
        characteristic.addEventListener('characteristicvaluechanged', onCharacteristicValueChanged);
      }
		}
  } catch (error)  {
    console.log('bluetooth error: ', error);
  }
}

/**
 * App state changed.
 * @param {Event} e Custom event.
 */
function handleStateChanges(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

    case actions.CONNECT_BLUETOOTH:
      connect();
      break;
  }
}

/**
 * 
 * @param {Event} e 
 */
function onCharacteristicValueChanged(e) {
  const { value } = e.target;
  let str = `${value.getUint8(0)}:${value.getUint8(1)}:${value.getUint8(2)}:${value.getUint8(3)}:${value.getUint8(4)}`;
  console.log('>> notification value: ', str);
  playNote(0, value.getUint8(2), value.getUint8(3), value.getUint8(4));
}

/**
 * Module setup.
 */
export function setup() {
  addEventListeners();
}
