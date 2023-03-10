
const Jam = {
	init() {
		// initial display
		this.display.init();
		// defaults
		this.stop();

		this.meter1 = new Tone.Meter({ channels: 1 });
		this.meter2 = new Tone.Meter({ channels: 1 });
		this.channel1 = new Tone.Channel().connect(this.meter1).toDestination();
		this.channel2 = new Tone.Channel().connect(this.meter2).toDestination();

		let data = {
				urls: {
					"C0": "3609.ogg", // kick
					"C1": "3612.ogg", // snare
					"C2": "3639.ogg", // hihat
					"C3": "3507.ogg", // clave
				},
				baseUrl: "/cdn/audio/samples/",
			},
			sampler = new Tone.Sampler(data).connect(this.channel1),
			grid1 = [
				[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], // kick
				[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], // snare
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // hihat
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // clave
			];

		
		let grid2 = [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
			synth = new Tone.AMSynth({
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
			}).connect(this.channel2);


		let seq = new Tone.Sequence((time, beat) => {
			grid1.map((row, index) => {
				if (row[beat]) {
					sampler.triggerAttackRelease([`C${index}`], "4n", time, 1)
				}
			});

			if (grid2[beat]) {
				synth.triggerAttackRelease(`C4`, "4n", time, 1)
			}
		}, [...Array(16)].map((e,i) => i)).start(0);

	},
	start() {
		this._stopped = false;
		Tone.Transport.start();
		this.update();
	},
	stop() {
		this._stopped = true;
		Tone.Transport.stop();
	},
	update() {
		if (this._stopped) return;
		// do calculations
		let bars = Tone.Transport.position.split(".")[0].split(":"),
			seconds = Math.floor(Tone.Transport.seconds),
			sec = (seconds % 60).toString().padStart(2, "0"),
			min = Math.floor(seconds / 60).toString().padStart(2, "0"),
			hr = Math.floor(seconds / 3600).toString().padStart(2, "0"),
			time = `${hr} ${min} ${sec}`;
		if (bars[0].length < 2) bars[0] = " "+ bars[0];
		bars = bars.join(" ");
		// render display
		this.display.render({ bars, time });
		// render whats need to be rendered
		this.render();
		// raf
		requestAnimationFrame(this.update.bind(this));
	},
	render() {
		if (!this.ctx1) {
			let cvs = window.find(`.track[data-id="track-1"] .volume canvas`).addClass("ready");
			this.ctx1 = cvs[0].getContext("2d");
			this.ctx1.fillStyle = "#182c40";
		}
		if (!this.ctx2) {
			let cvs = window.find(`.track[data-id="track-2"] .volume canvas`).addClass("ready");
			this.ctx2 = cvs[0].getContext("2d");
			this.ctx2.fillStyle = "#182c40";
		}
		this.ctx1.clearRect(0, 0, 6, 111);
		this.ctx2.clearRect(0, 0, 6, 111);

		let p1 = Math.log(this.meter1.getValue() + 51) / Math.log(63);
		if (isNaN(p1)) p1 = 0;
		this.ctx1.fillRect(0, 0, 6, Math.round((1 - p1) * 111));

		let p2 = Math.log(this.meter2.getValue() + 51) / Math.log(63);
		if (isNaN(p2)) p2 = 0;
		this.ctx2.fillRect(0, 0, 6, Math.round((1 - p2) * 111));
	},
	display: {
		init() {
			// toolbar display
			this.cvs = window.find(".win-caption-toolbar_ .display canvas");
			this.ctx = this.cvs[0].getContext("2d");
			this.width = this.cvs.prop("offsetWidth");
			this.height = this.cvs.prop("offsetHeight");
			// show bar/beat or time
			this.show = window.find(".win-caption-toolbar_ .display").hasClass("show-time") ? "time" : "bar-beat";
			// reset dim
			this.cvs.attr({
				width: this.width,
				height: this.height,
				"data-context": "display-menu",
			});
			// text defaults
			this.ctx.font = "17px Lucida Console";
			this.ctx.fillStyle = "#b7cbe0";
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "bottom";
			// initial render
			this.render();
		},
		render(data={}) {
			let time = data.time || `00 00 00`,
				bars = data.bars || ` 0 0 0`,
				tempo = data.tempo || `120`;
			// clear canvas
			this.ctx.clearRect(0, 0, this.width, this.height);

			switch (this.show) {
				case "bar-beat":
					this.ctx.fillText(bars, 44, 22);
					break;
				case "time":
					this.ctx.fillText(time, 54, 22);
					break;
			}
			// tempo
			this.ctx.fillText(tempo, 144, 22);
		}
	}
};
