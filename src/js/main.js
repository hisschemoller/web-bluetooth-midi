
const scanBtn = document.querySelector('.btn-scan');
const disconnectBtn = document.querySelector('.btn-disconnect');
const reconnectBtn = document.querySelector('.btn-reconnect');
scanBtn.addEventListener('click', requestDevice);
disconnectBtn.addEventListener('click', disconnectDevice);
reconnectBtn.addEventListener('click', reconnectDevice);

const bluetoothServiceUUID = '27cf08c1-076a-41af-becd-02ed6f6109b9';
const valueToReportType = {
  1: 'Input Report',
  2: 'Output Report',
  3: 'Feature Report'
};
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

async function getCharacteristics(service) {
  console.log('Getting Characteristics...');
  const characteristics = await service.getCharacteristics();
  characteristics.forEach(characteristic => {
    console.log('>> Characteristic: ', characteristic);
    console.log('>> Characteristic.uuid: ', characteristic.uuid);
    getCharacteristicProperties(characteristic);
    getCharacteristicDescriptors(characteristic);
    readCharacteristic(characteristic);
    subscribeToNotifications(characteristic);
  });
  getDeviceInformation(characteristics);
}

async function readCharacteristic(characteristic) {
  console.log('>>>>> Characteristic readable: ', characteristic.properties.read);
  if (characteristic.properties.read) {
    characteristic.readValue().then(data => {
      console.log('>>>>> Characteristic readValue: ', data.getUint8());
    });
  }
}

async function subscribeToNotifications(characteristic) {
  console.log('>>>>> Characteristic notify: ', characteristic.properties.notify);
  if (characteristic.properties.notify) {
    await characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', onCharacteristicValueChanged);
  }
}

function onCharacteristicValueChanged(e) {
  let value = `${e.target.value.getUint8(0)}:${e.target.value.getUint8(1)}:${e.target.value.getUint8(2)}`;
  console.log('> Notification value: ', value);
}

async function getCharacteristicDescriptors(characteristic) {
  console.log('Getting Characteristic Descriptors...');
  const descriptors = await characteristic.getDescriptors();
  for (const descriptor of descriptors) {
    switch (descriptor.uuid) {

      case BluetoothUUID.getDescriptor('gatt.client_characteristic_configuration'):
        await descriptor.readValue().then(value => {
          console.log('> Client Characteristic Configuration:');
          let notificationsBit = value.getUint8(0) & 0b01;
          console.log('  > Notifications: ' + (notificationsBit ? 'ON' : 'OFF'));
          let indicationsBit = value.getUint8(0) & 0b10;
          console.log('  > Indications: ' + (indicationsBit ? 'ON' : 'OFF'));
        });
        break;

      case BluetoothUUID.getDescriptor('gatt.characteristic_user_description'):
        await descriptor.readValue().then(value => {
          let decoder = new TextDecoder('utf-8');
          console.log('> Characteristic User Description: ' + decoder.decode(value));
        });
        break;

      case BluetoothUUID.getDescriptor('report_reference'):
        await descriptor.readValue().then(value => {
          console.log('> Report Reference:');
          console.log('  > Report ID: ' + value.getUint8(0));
          console.log('  > Report Type: ' + getReportType(value));
        });
        break;

      default: console.log('> Unknown Descriptor: ' + descriptor.uuid);
    }
  }
}

function getCharacteristicProperties(characteristic) {
  console.log('Getting Characteristic Properties...');
  for (const p in characteristic.properties) {
    console.log('> Property: ', p, characteristic.properties[p]);
  }
}

async function getDeviceInformation(characteristics) {
  console.log('Getting Device Information Characteristics...');
  const decoder = new TextDecoder('utf-8');
  for (const characteristic of characteristics) {
    switch (characteristic.uuid) {

      case BluetoothUUID.getCharacteristic('manufacturer_name_string'):
        await characteristic.readValue().then(value => {
          console.log('> Manufacturer Name String: ' + decoder.decode(value));
        });
        break;

      case BluetoothUUID.getCharacteristic('model_number_string'):
        await characteristic.readValue().then(value => {
          console.log('> Model Number String: ' + decoder.decode(value));
        });
        break;

      case BluetoothUUID.getCharacteristic('hardware_revision_string'):
        await characteristic.readValue().then(value => {
          console.log('> Hardware Revision String: ' + decoder.decode(value));
        });
        break;

      case BluetoothUUID.getCharacteristic('firmware_revision_string'):
        await characteristic.readValue().then(value => {
          console.log('> Firmware Revision String: ' + decoder.decode(value));
        });
        break;

      case BluetoothUUID.getCharacteristic('software_revision_string'):
        await characteristic.readValue().then(value => {
          console.log('> Software Revision String: ' + decoder.decode(value));
        });
        break;

      case BluetoothUUID.getCharacteristic('system_id'):
        await characteristic.readValue().then(value => {
          console.log('> System ID: ');
          console.log('  > Manufacturer Identifier: ' +
              padHex(value.getUint8(4)) + padHex(value.getUint8(3)) +
              padHex(value.getUint8(2)) + padHex(value.getUint8(1)) +
              padHex(value.getUint8(0)));
          console.log('  > Organizationally Unique Identifier: ' +
              padHex(value.getUint8(7)) + padHex(value.getUint8(6)) +
              padHex(value.getUint8(5)));
        });
        break;

      case BluetoothUUID.getCharacteristic('ieee_11073-20601_regulatory_certification_data_list'):
        await characteristic.readValue().then(value => {
          console.log('> IEEE 11073-20601 Regulatory Certification Data List: ' + decoder.decode(value));
        });
        break;

      case BluetoothUUID.getCharacteristic('pnp_id'):
        await characteristic.readValue().then(value => {
          console.log('> PnP ID:');
          console.log('  > Vendor ID Source: ' + (value.getUint8(0) === 1 ? 'Bluetooth' : 'USB'));
          if (value.getUint8(0) === 1) {
            console.log('  > Vendor ID: ' + (value.getUint8(1) | value.getUint8(2) << 8));
          } else {
            console.log('  > Vendor ID: ' + getUsbVendorName(value.getUint8(1) | value.getUint8(2) << 8));
          }
          console.log('  > Product ID: ' + (value.getUint8(3) | value.getUint8(4) << 8));
          console.log('  > Product Version: ' + (value.getUint8(5) | value.getUint8(6) << 8));
        });
        break;

      default: console.log('> Unknown Characteristic: ' + characteristic.uuid);
    }
  }
}

function getReportType(value) {
  let v = value.getUint8(1);
  return v + (v in valueToReportType ? ' (' + valueToReportType[v] + ')' : 'Unknown');
}

async function getService() {
  console.log('Getting Services...');
  const services = await server.getPrimaryServices();
  console.log('> Bluetooth services', services);
  service = await server.getPrimaryService(bluetoothServiceUUID);
  console.log('> Bluetooth service', service);
  getCharacteristics(service);
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
