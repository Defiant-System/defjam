
let Test = {
	init() {
		// window.find(`.ball-button[data-click="show-arrangement-view"]`).trigger("click");
		window.find(`.foot-midi`).trigger("click");
		// window.find(`.foot-devices`).trigger("click");

		// window.find(`.channel:nth(3)`).trigger("click");
		// window.find(`.toolbar-tool_[data-click="pencil"]`).trigger("click");

		// window.find(`.panel-left .drums-body .leaf:nth(0) .icon-folder`).trigger("click");
		// setTimeout(() => window.find(`.chWrapper .leaf:nth(0)`).trigger("click"), 200);

		// setTimeout(() => defjam.midi.doPiano({ type: "window.keystroke", char: "a" }), 1000);
		// setTimeout(() => defjam.midi.doPiano({ type: "window.keystroke", char: "s" }), 1300);
		// setTimeout(() => defjam.midi.doPiano({ type: "window.keystroke", char: "d" }), 1600);

		// defjam.session.dispatch({ type: "render-file" });

		setTimeout(() => window.find(`.slots b[data-id="clip-1-0"]`).trigger("click"), 500);
		// setTimeout(() => window.find(`.slots b[data-id="clip-2-1"]`).trigger("click"), 500);


		// setTimeout(this.jam, 100);


		// setTimeout(() => window.find(`.toolbar-tool_[data-click="play"]`).trigger("click"), 500);
		// setTimeout(() => window.find(`.toolbar-tool_[data-click="play"]`).trigger("click"), 3000);
	},
	jam() {
		let instrument,
			sequence;

		// drumkit
		instrument = new Tone.Sampler({
			urls: {
				"C0": "3609.ogg", // kick
				"C1": "3612.ogg", // snare
				"C2": "3639.ogg", // hihat
				"C3": "3507.ogg", // clave
			},
			baseUrl: "/cdn/audio/samples/",
		});
		sequence = [
			[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], // kick
			[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], // snare
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // hihat
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // clave
		];
		Jam.track.add("track-1", instrument, sequence, 1);


		/* polySynth 
		instrument = new Tone.PolySynth(Tone.Synth, {
				oscillator: { partials: [0, 2, 3, 4] }
			});
		sequence = ["b3",0,0,0,0,"c4",0,0,"d4",0,0,0,0,"C4",0,0];
		Jam.track.add("track-2", instrument, sequence);
		*/

		
		// simulating sequence update
		// defjam.midi.dispatch({ type: "drumkit-to-sequence" });


		/* amSynth
		instrument = new Tone.AMSynth({
				harmonicity: 2.5,
				volume: 15,
				oscillator: {
					type: "fatsawtooth"
				},
				envelope: {
					attack: 0.1,
					decay: 0.2,
					sustain: 0.2,
					release: 0.3
				},
				modulation: {
					type: "square"
				},
				modulationEnvelope: {
					attack: 0.5,
					decay: 0.01
				}
			});
		sequence = ["b3",0,0,0,0,"c4",0,0,"d4",0,0,0,0,"C4",0,0];
		Jam.track.add("2", instrument, sequence);
		*/
	}
};
