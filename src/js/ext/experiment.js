
let TypeDefaults = {
	  initialAttenuation: 0,
	  chorusEffectsSend: 0,
	  reverbEffectsSend: 0,
	  initialFilterFc: 13500,
	  initialFilterQ: 0,
	  attackVolEnv: -12000,
	  decayVolEnv: -12000,
	  sustainVolEnv: 0,
	  releaseVolEnv: -12000,
	  coarseTune: 0,
	  fineTune: 0,
	  pan: 0,
	};

let VKEYS = {
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
let KEYS = {
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


let Data;
let Synth;
let ENV;
let REF_FREQ = 8.17579892
let SAMPLE_DATA_POINTS = 32768;
let sampleRateContext = Tone.context.sampleRate;
let midiNote,
	isPercussion,
	startLoopOffset,
	startLoopCoarseOffset,
	endLoopOffset,
	endLoopCoarseOffset,
	multiplier,
	startSamp,
	endSamp,
	fadeIn,
	fadeOut,
	volume,
	detune,
	playbackRate;


let Site = {
	init() {
		$.getJSON("./web-scraping/data.json").then(data => {
			Data = data;
			
			// Cello: 560
			// Polysynth Pad: 3217
			// Glockenspiel: 170

			Site.dispatch({ type: "load-instrument", sampleId: 1204 });
		});

		// bind event handlers
		$(window).on("keydown keyup", Site.dispatch);
	},
	dispatch(event) {
		let key;
		// console.log( event );
		switch (event.type) {
			case "keydown":
				key = event.key.toUpperCase();
				if (KEYS[key] || !VKEYS[key]) return;
				KEYS[key] = true;


				// change instrument playback rate
				detune = Site.getPresetGeneratorMidiNoteSampleDetune(
						presetZone,
						instrumentZone,
						KEYS.midiNr(VKEYS[key]),
						sample,
						isPercussion
					);
				Synth.playbackRate = Tone.intervalToFrequencyRatio(detune / 100);


				Synth.start();
				break;
			case "keyup":
				key = event.key.toUpperCase();
				if (!KEYS[key] && !VKEYS[key]) return;
				delete KEYS[key];

				Synth.stop();
				break;

			case "load-instrument":
				sample = Site.getSampleById(event.sampleId);
				instrument = Site.getInstrumentBySampleId(event.sampleId);
				instrumentZone = Site.getZoneBySampleId(instrument, event.sampleId);
				preset = Site.getPresetByInstrument(instrument);
				presetZone = preset.generatorMaps;

				// console.log( sample );
				// console.log( instrument );
				// console.log( instrumentZone );
				// console.log( preset );

				midiNote = instrumentZone.overridingRootKey;
				isPercussion = false;
				
				startLoopOffset = instrumentZone.startLoopAddrsOffset || 0;
				startLoopCoarseOffset = instrumentZone.startLoopAddrsCoarseOffset || 0;
				endLoopOffset = 0;
				endLoopCoarseOffset = instrumentZone.endLoopAddrsCoarseOffset || 0;
				multiplier = sampleRateContext / sample.sampleRate
				startSamp = sample.startLoop + startLoopOffset + startLoopCoarseOffset / SAMPLE_DATA_POINTS;
				endSamp = sample.endLoop + endLoopOffset + endLoopCoarseOffset / SAMPLE_DATA_POINTS;


				fadeIn = 0.25;
				fadeOut = 0.25;
				volume = Site.getInstrumentZoneAttenuationGain(presetZone, instrumentZone);

				detune = Site.getPresetGeneratorMidiNoteSampleDetune(
						presetZone,
						instrumentZone,
						midiNote,
						sample,
						isPercussion
					);
				playbackRate = Tone.intervalToFrequencyRatio(detune / 100);



				// ENV = new Tone.AmplitudeEnvelope({
				// 		attack: 0.1,
				// 		decay: 0.2,
				// 		sustain: 1.0,
				// 		release: 0.8
				// 	}).toDestination();

				// let osc = new Tone.Oscillator().connect(ENV).start();

				let opt = {
						autostart: false,
						fadeIn,
						fadeOut,
						volume,
						playbackRate,
						url: `./web-scraping/samples/${sample.id}.ogg`,
					};

				opt.loop = instrumentZone.sampleMode;
				
				if (opt.loop) {
					opt.loopStart = new Tone.Time(startSamp * multiplier, "samples").toSeconds();
					opt.loopEnd = new Tone.Time(endSamp * multiplier, "samples").toSeconds();
				}

				Synth = new Tone.Player(opt).toDestination();

				// setTimeout(() => Synth.connect(ENV).start(), 1000);

				break;
		}
	},
	timeCentsToSeconds(value) {
		let zeroVal = -32768;
		value = value !== null ? value : zeroVal;
		return Math.pow(2, value / 1200);
	},
	centsToFreq(value) {
		return REF_FREQ * Site.timeCentsToSeconds(value);
	},
	presetZoneCreateEnvelope(presetZone, zone, context) {
		let attackVolEnv = Site.stackValues("attackVolEnv", presetZone, zone);
		let decayVolEnv = Site.stackValues("decayVolEnv", presetZone, zone);
		let sustainVolEnv = Site.stackValues("sustainVolEnv", presetZone, zone);
		let releaseVolEnv = Site.stackValues("releaseVolEnv", presetZone, zone);

		return createEnvelope({
			attackVolEnv,
			decayVolEnv,
			sustainVolEnv,
			releaseVolEnv,
			context
		});
	},
	getInstrumentZoneAttenuationGain(presetZone, instrumentZone) {
		let valueRaw = Site.stackValues("initialAttenuation", presetZone, instrumentZone);
		let value = Math.max(0, valueRaw);
		let gain = -value / 100;
		return gain;
	},
	getPresetGeneratorMidiNoteSampleDetune(presetZone, instrumentZone, midiNote, sample, isPercussion) {
		let { overridingRootKey } = instrumentZone;
		let rootKey = overridingRootKey !== undefined && overridingRootKey >= 0
			? overridingRootKey : isPercussion
			? midiNote : sample.originalPitch;
		
		let noteNameRoot = Tonal.Midi.midiToNoteName(rootKey);
		let noteNameTo = Tonal.Midi.midiToNoteName(midiNote);
		let intervalName = Tonal.distance(noteNameRoot, noteNameTo);
		let rootSemitones = Tonal.interval(intervalName).semitones;
		if (rootSemitones === undefined) {
			throw new Error("No semitone offset");
		}

		let coarseTune = Site.stackValues("coarseTune", presetZone, instrumentZone);
		let fineTune = Site.stackValues("fineTune", presetZone, instrumentZone);
		let cents = (rootSemitones + coarseTune) * 100 + sample.pitchCorrection + fineTune;

		return cents;
	},
	stackValues(value, presetZone, instrumentZone) {
		let base = instrumentZone[value] || TypeDefaults[value];
		let addend = presetZone[value] || 0
		return base + addend;
	},
	getPresetByInstrument(instr) {
		let insIndex = Data.instruments.findIndex(i => i == instr);
		let preset;

		Data.presets.map(p => {
			if (p.generatorMaps.find(m => m.instrument === insIndex)) {
				preset = p;
			}
		});

		return preset;
	},
	getSampleById(id) {
		return Data.samples.find(s => s.id === id);
	},
	getInstrumentBySampleId(id) {
		return Data.instruments.find(instr =>
			instr.zones.find(z => z.sampleId === id));
	},
	getZoneBySampleId(instr, id) {
		return instr.zones.find(z => z.sampleId === id);
	}
};

$(window).ready(Site.init);
