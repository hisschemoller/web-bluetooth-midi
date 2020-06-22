
const connectBtn = document.querySelector('.btn-connect');
connectBtn.addEventListener('click', requestDevice);

let device;

async function requestDevice() {
	console.log('connect');
	const options = { 
		filters: [{
			namePrefix: 'BlenoService',
		} 
	]};
	try {
    console.log('Requesting Bluetooth Device...');
    console.log('with ' + JSON.stringify(options));
		device = await navigator.bluetooth.requestDevice(options);
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
