
const scanBtn = document.querySelector('.btn-scan');
const disconnectBtn = document.querySelector('.btn-disconnect');
const reconnectBtn = document.querySelector('.btn-reconnect');
scanBtn.addEventListener('click', requestDevice);
disconnectBtn.addEventListener('click', disconnectDevice);
reconnectBtn.addEventListener('click', reconnectDevice);

const bluetoothServiceUUID = '27cf08c1-076a-41af-becd-02ed6f6109b9';
let device, server, service;

async function requestDevice() {
	const options = { 
		filters: [{
			namePrefix: 'BlenoService',
    }],
    optionalServices: [ bluetoothServiceUUID ],
  };
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
  } catch (error)  {
    console.log('No! ' + error);
  }
}

async function getCharacteristics(service) {
  console.log('Getting Characteristics...');
  const characteristics = await service.getCharacteristics();
  characteristics.forEach(characteristic => {
    console.log('>> Characteristic: ' + characteristic.uuid, getSupportedProperties(characteristic));
  });
}

async function connectDevice() {
	console.log('Connecting to Bluetooth Device...');
  server = await device.gatt.connect();
  console.log('> gatt', device.gatt);
  console.log('> server', server);
  console.log('> Bluetooth Device connected');
  getService();
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

async function getService() {
  console.log('Getting Services...');
  const services = await server.getPrimaryServices();
  console.log('> Bluetooth services', services);
  service = await server.getPrimaryService(bluetoothServiceUUID);
  console.log('> Bluetooth service', service);
  getCharacteristics(service);
}

function getSupportedProperties(characteristic) {
  let supportedProperties = [];
  for (const p in characteristic.properties) {
    if (characteristic.properties[p] === true) {
      supportedProperties.push(p.toUpperCase());
    }
  }
  return '[' + supportedProperties.join(', ') + ']';
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
