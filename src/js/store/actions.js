
const BLUETOOTH_CONNECT = 'BLUETOOTH_CONNECT';
const BLUETOOTH_DISCONNECT = 'BLUETOOTH_DISCONNECT';
const BLUETOOTH_ERROR = 'BLUETOOTH_ERROR';
const BLUETOOTH_SUCCESS = 'BLUETOOTH_SUCCESS';
const HANDLE_MIDI_MESSAGE = 'HANDLE_MIDI_MESSAGE';

// actions
export default {

    BLUETOOTH_CONNECT,
    bluetoothConnect: () => ({ type: BLUETOOTH_CONNECT }),

    BLUETOOTH_DISCONNECT,
    bluetoothDisconnect: () => ({ type: BLUETOOTH_DISCONNECT }),

    BLUETOOTH_ERROR,
    bluetoothError: () => ({ type: BLUETOOTH_ERROR }),

    BLUETOOTH_SUCCESS,
    bluetoothSuccess: () => ({ type: BLUETOOTH_SUCCESS }),

    HANDLE_MIDI_MESSAGE,
    handleMIDIMessage: (data0, data1, data2) => ({ type: HANDLE_MIDI_MESSAGE, data0, data1, data2 }),
};
