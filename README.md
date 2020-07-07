# web-bluetooth-test

Demo at https://hisschemoller.github.io/web-bluetooth-midi/

An app to test MIDI over Bluetooth in JavaScript.

- Scan for BLE peripheral devices that have the MIDI service UUID.
- Once selected subscribe to the notifications.
- Wait for incoming notifications that should be 5 bit timestamped MIDI messages.
- Play sine wave sound using MIDI pitch and velocity.
- Visual feedback of pitch and velocity.

Uses

- Web Bluetooth API
- Web Audio API

Web Bluetooth documentation:

- Web Bluetooth
  - https://webbluetoothcg.github.io/web-bluetooth/
- Web Bluetooth API
  - https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API
- Interact with Bluetooth devices on the Web
  - https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web
- Web Bluetooth Samples
  - https://googlechrome.github.io/samples/web-bluetooth/index.html