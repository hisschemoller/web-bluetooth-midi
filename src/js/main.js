
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
  } catch(error)  {
    console.log('No! ' + error);
  }
}

