
// constants
const BASE_URL = "/cdn/audio/samples/";

const OCTAVE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const DUR = {
	_val: {
		"16n": 1,
		"8n": 2,
		"4n": 4,
		"2n": 8,
		"1n": 16,
	},
	toBeats(val=1) {
		if (val == +val) {
			let [dBar, dBeat=0, d16=0] = val.toString().split(".").map(i => +i);
			return (dBar * 4) + dBeat + (d16 / 4) * 16;
		} else {
			let [dBar, dBeat=1, d16=1] = val.toString().split(".").map(i => +i);
			return (dBar * 4) + (dBeat-1) + ((d16-1) / 4);
		}
	}
};

const VKEYS = {
	"A": "C3",
	"W": "C#3",
	"S": "D3",
	"E": "D#3",
	"D": "E3",
	"F": "F3",
	"T": "F#3",
	"G": "G3",
	"Y": "G#3",
	"H": "A3",
	"U": "A#3",
	"J": "B3",
	"K": "C4",
	"O": "C#4",
	"L": "D4",
};

const KEYS = {
	_down: {},
	_keys: {},
	_vkeys: Object.keys(VKEYS),
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
