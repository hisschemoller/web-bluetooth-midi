
const NOTE_ON = 144;
const NOTE_OFF = 128;
const numVoices = 32;
const pitches = new Array(127).fill(null);
const voices = [];
let audioCtx;
let voiceIndex = 0;

function createVoices() {
	for (let i = 0; i < numVoices; i++) {
		const gain = audioCtx.createGain();
		gain.connect(audioCtx.destination);

		voices.push({
			isPlaying: false,
			gain,
			osc: null,
			source: null,
		});
	}
}

/**
 * Converts a MIDI pitch number to frequency.
 * @param  {Number} midi MIDI pitch (0 ~ 127)
 * @return {Number} Frequency (Hz)
 */
function mtof(midi) {
		if (midi <= -1500) return 0;
		else if (midi > 1499) return 3.282417553401589e+38;
		else return 440.0 * Math.pow(2, (Math.floor(midi) - 69) / 12.0);
};

export function playNote(nowToStartInSecs, type, pitch, velocity) {
	switch (type) {
		case NOTE_ON:
			startNote(nowToStartInSecs, pitch, velocity);
			break;
		case NOTE_OFF:
			stopNote(nowToStartInSecs, pitch, velocity);
			break;
	}
}

export function playSound(nowToStartInSecs, bufferId, pitch, velocity) {
  const startTime = audioCtx.currentTime + nowToStartInSecs;
  const voice = voices[voiceIndex];
  voiceIndex = ++voiceIndex % numVoices;

  if (voice.isPlaying) {
    console.log('isPlaying');
    voice.source.stop();
  }

  voice.isPlaying = true;
  voice.gain.gain.setValueAtTime(velocity / 127, startTime);
  voice.source = audioCtx.createBufferSource();
  voice.source.buffer = buffers.byId[bufferId].buffer;
  voice.source.playbackRate.setValueAtTime(2 ** ((pitch - 60) / 12), startTime);
  voice.source.connect(voice.gain);
  voice.source.start(startTime);
  voice.source.onended = function() {
    voice.isPlaying = false;
  }
}

export function setup() {
	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	createVoices();
}

function startNote(nowToStartInSecs, pitch, velocity) {
	stopNote(0, pitch, velocity);

	const startTime = audioCtx.currentTime + nowToStartInSecs;
  const voice = voices[voiceIndex];
	voiceIndex = ++voiceIndex % numVoices;
	
	voice.isPlaying = true;
	voice.osc = audioCtx.createOscillator();
	voice.osc.type = 'sine';
	voice.osc.frequency.setValueAtTime(mtof(pitch), startTime);
  voice.osc.connect(voice.gain);
  voice.osc.start(startTime);
	voice.gain.gain.setValueAtTime(velocity / 127, startTime);

	pitches[pitch] = voice;
}

function stopNote(nowToStopInSecs, pitch, velocity) {
	if (pitches[pitch]) {
		pitches[pitch].osc.stop(nowToStopInSecs);
		pitches[pitch] = null;
	}
}
