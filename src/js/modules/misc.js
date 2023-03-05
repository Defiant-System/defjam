
// constants
const BASE_URL = "/cdn/audio/samples/";

const OCTAVE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const KEYS = {
	_keys: {},
	init() {
		let base = { "C": 24, "D": 26, "E": 28, "F": 29, "G": 31, "A": 33, "B": 35 };
		for (let octave=-2; octave<=8; octave++) {
			for (let k in base) {
				let key = base[k] + (octave * 12);
				this._keys[`${k}${octave}`] = key;
				this._keys[`${k}#${octave}`] = key+1;
			}
		}
	},
	midiNr(note) {
		return this._keys[note];
	},
	note(num) {
		for (let k in this._keys) {
			if (this._keys[k] === num) return k;
		}
		return "n/a";
	}
};
// auto init
KEYS.init();
