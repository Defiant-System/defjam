
const Jam = {
	init() {
		// initial display
		this.display.init();
		// defaults
		this.stop();

		// temp
		this.meter1 = new Tone.Meter({ channels: 1 });
		let channel1 = new Tone.Channel().connect(this.meter1).toDestination();
		let data = {
				urls: {
					0: "3609.ogg", // kick
					1: "3612.ogg", // snare
					2: "3639.ogg", // hihat
					3: "3507.ogg", // clave
				},
				fadeOut: "4n",
				baseUrl: "/cdn/audio/samples/",
			},
			drumkit = new Tone.Players(data).connect(channel1),
			beat = 0,
			grid = [
				[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], // kick
				[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], // snare
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // hihat
				// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // hihat
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // clave
			];

		let seq = new Tone.Sequence((time, beat, a) => {
			grid.map((row, index) => {
				if (row[beat]) {
					drumkit.player(index).start(time, 0, "4n");
				}
			});
		}, [...Array(16)].map((e,i) => i)).start(0);

	},
	start() {
		this._stopped = false;

		// temp (rewind)
		// Tone.Transport.set({
		// 	position: 0
		// });

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
		if (!this.ctx) {
			let cvs = window.find(`.track[data-id="track-1"] .volume canvas`).addClass("ready");
			this.ctx = cvs[0].getContext("2d");
			this.ctx.fillStyle = "#182c40";
		}
		this.ctx.clearRect(0, 0, 6, 111);

		let p1 = (1-Math.clamp(Math.log(this.meter1.getValue() + 51) / Math.log(63), 0, 1)) * 111;
		this.ctx.fillRect(0, 0, 6, Math.round(p1));
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
