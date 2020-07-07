
const ACTION = 'ACTION';
const CONNECT_BLUETOOTH = 'CONNECT_BLUETOOTH';
const HANDLE_MIDI_MESSAGE = 'HANDLE_MIDI_MESSAGE';

// actions
export default {

    CONNECT_BLUETOOTH,
    connectBluetooth: () => ({ type: CONNECT_BLUETOOTH }),

    HANDLE_MIDI_MESSAGE,
    handleMIDIMessage: (data0, data1, data2) => ({ type: HANDLE_MIDI_MESSAGE, data0, data1, data2 }),
};
