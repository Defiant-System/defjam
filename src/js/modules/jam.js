
const Jam = {
	init() {

		this.meter1 = new Tone.Meter({ channels: 1 });
		this.meter2 = new Tone.Meter({ channels: 1 });

		this.channel1 = new Tone.Channel().connect(this.meter1).toDestination();
		this.channel2 = new Tone.Channel().connect(this.meter2).toDestination();

		// channel 1
		let data = {
				urls: {
					0: "3609.ogg", // kick
					1: "3612.ogg", // snare
					2: "3639.ogg", // hihat
				},
				fadeOut: "4n",
				baseUrl: "/cdn/audio/samples/",
			},
			drumkit = new Tone.Players(data).connect(this.channel1),
			beat = 0,
			grid = [
				[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], // kick
				[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], // snare
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // hihat
			],
			repeat1 = time => {
				grid.map((row, index) => {
					if (row[beat]) {
						drumkit.player(index).sync().start(time, 0, "4n");
					}
				});
				beat = (beat + 1) % 16;
			};

		// channel 2
		let data2 = {
				urls: {
					0: "3507.ogg", // clave
				},
				fadeOut: "4n",
				baseUrl: "/cdn/audio/samples/",
			},
			pad2 = new Tone.Players(data2).connect(this.channel2),
			grid2 = [
				[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0], // clave
			],
			repeat2 = time => {
				grid2.map((row, index) => {
					if (row[beat]) {
						pad2.player(index).sync().start(time, 0, "4n");
					}
				});
			};

		Tone.Transport.bpm.value = 120;
		Tone.Transport.scheduleRepeat(repeat1, "8n");
		Tone.Transport.scheduleRepeat(repeat2, "8n");

		let el1, el2;

		new Tone.Loop(time => {
			if (!el1) {
				el1 = window.find(`.track[data-id="track-1"] .volume`);
				el2 = window.find(`.track[data-id="track-2"] .volume`);
			}

			let p1 = Math.clamp(Math.log(this.meter1.getValue() + 51) / Math.log(63), 0, 1),
				p2 = Math.clamp(Math.log(this.meter2.getValue() + 51) / Math.log(63), 0, 1);

			// el1.css({ "--v": `${Math.round( -p1 * 100 )}%` });
			// el2.css({ "--v": `${Math.round( -p2 * 100 )}%` });

		}, "64n").start(0);
	}
};
