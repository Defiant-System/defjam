
const Jam = {
	init() {
		let channel = new Tone.Channel().toDestination();

		let data = {
			urls: {
				0: "3609.ogg", // kick
				1: "3612.ogg", // snare
				2: "1841.ogg", // rim
				3: "3639.ogg", // hihat
			},
			fadeOut: "4n",
			baseUrl: "/cdn/audio/samples/",
		};
		let pads = new Tone.Players(data);
		
		pads.connect(channel);


		let beat = 0;
		let grid = [
				[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], // kick
				[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], // snare
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // rim
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // hihat
			];

		let repeat = time => {
			grid.map((row, index) => {
				let pad = pads[index],
					note = row[beat];
				if (note) {
					pads.player(index).start(time, 0, "4n");
				}
			});
			beat = (beat + 1) % 16;
		};


		Tone.Transport.bpm.value = 120;
		Tone.Transport.scheduleRepeat(repeat, "8n");
	}
};
