
const scanBtn = document.querySelector('.btn-scan');
const disconnectBtn = document.querySelector('.btn-disconnect');
const reconnectBtn = document.querySelector('.btn-reconnect');
scanBtn.addEventListener('click', requestDevice);
disconnectBtn.addEventListener('click', disconnectDevice);
reconnectBtn.addEventListener('click', reconnectDevice);

let device;

async function requestDevice() {
	const options = { 
		filters: [{
			namePrefix: 'BlenoService',
		} 
	]};
	try {
    console.log('Requesting Bluetooth Device...');
    console.log('with ' + JSON.stringify(options));
		device = await navigator.bluetooth.requestDevice(options);
		device.addEventListener('gattserverdisconnected', onDisconnected);
    console.log('> Name:             ' + device.name);
    console.log('> Id:               ' + device.id);
		console.log('> Connected:        ' + device.gatt.connected);
		if (!device.gatt.connected) {
			connectDevice();
		}
  } catch(error)  {
    console.log('No! ' + error);
  }
}

async function connectDevice() {
	console.log('Connecting to Bluetooth Device...');
  await device.gatt.connect();
  console.log('> Bluetooth Device connected');
}

function disconnectDevice() {
  if (!device) {
    return;
  }
  console.log('Disconnecting from Bluetooth Device...');
  if (device.gatt.connected) {
    device.gatt.disconnect();
  } else {
    console.log('> Bluetooth Device is already disconnected');
  }
}

function onDisconnected(event) {
  // Object event.target is Bluetooth Device getting disconnected.
  console.log('> Bluetooth Device disconnected');
}

function reconnectDevice() {
  if (!device) {
    return;
  }
  if (device.gatt.connected) {
    console.log('> Bluetooth Device is already connected');
    return;
  }
  try {
    connectDevice();
  } catch(error) {
    console.log('Oh no! ' + error);
  }
}
