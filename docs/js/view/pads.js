import { dispatch, getActions, getState, STATE_CHANGE, } from '../store/store.js';

const rootEl = document.querySelector('.pads');
const padEls = rootEl.querySelectorAll('.pad');
const pitches = [67, 69, 71, 72, 60, 62, 64, 65];

/**
 * Add event listeners.
 */
function addEventListeners() {
	document.addEventListener(STATE_CHANGE, handleStateChanges);
}

/**
 * Handle MIDI message.
 * @param {Object} state 
 */
function handleMIDI(state) {
	const {data0, data1, data2 } = state;
	switch (data0) {
		case 144:
			startNote(data1, data2);
			break;
		
		case 128:
			stopNote(data1, data2);
			break;
	}
}

/**
 * App state changed.
 * @param {Event} e Custom event.
 */
function handleStateChanges(e) {
	const { state, action, actions, } = e.detail;
	switch (action.type) {
		case actions.HANDLE_MIDI_MESSAGE:
			handleMIDI(state);
			break;
	}
}

/**
 * Module setup at app start.
 */
export function setup() {
	addEventListeners();

	padEls.forEach((padEl, index) => {
		padEl.querySelector('.pad_label').textContent = pitches[index];
	});
}

function startNote(pitch, velocity) {
	const index = pitches.indexOf(pitch);
	if (index > -1 && index < pitches.length) {
		padEls.item(index).querySelector('.pad_info').textContent = velocity;
		padEls.item(index).classList.add('pad--active');
	}
}

function stopNote(pitch, velocity) {
	const index = pitches.indexOf(pitch);
	if (index > -1 && index < pitches.length) {
		padEls.item(index).classList.remove('pad--active');
	}
}
