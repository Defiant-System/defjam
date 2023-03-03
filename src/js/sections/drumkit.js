
// defjam.drumkit

{
	init() {
		// Glockenspiel
		// "G#4": "170.ogg",
		// "G#6": "171.ogg",

		this.sampler = new Tone.Sampler({
			urls: {
				"F#7": "1.ogg",
				"A3": "21.ogg",
				"D#4": "24.ogg",
			},
			baseUrl: "/cdn/audio/samples/"
		}).toDestination();

	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.drumkit,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "play-pad":
				// let synth = new Tone.Synth().toDestination();
				// synth.triggerAttackRelease("C4", "8n");
				Self.sampler.triggerAttackRelease([event.arg], 1);
				break;
		}
	}
}
