
const Jam = {
	init() {
		// initial display
		this.display.init();
		// defaults
		this.stop();

		// temp
		this.meter1 = new Tone.Meter({ channels: 1 });
		this.channel1 = new Tone.Channel().connect(this.meter1).toDestination();
		// channel 1
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
			drumkit = new Tone.Players(data).connect(this.channel1),
			beat = 0,
			grid = [
				[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], // kick
				[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], // snare
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // hihat
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // clave
			],
			clip1 = time => {
				grid.map((row, index) => {
					if (row[beat]) {
						drumkit.player(index).start(time, 0, "4n");
					}
				});
				beat = (beat + 1) % 16;
			};

		Tone.Transport.scheduleRepeat(clip1, "8n");

	},
	start() {
		this._stopped = false;
		Tone.Transport.start();
		this.update();
	},
	stop() {
		// temp (rewind)
		Tone.Transport.position = "0:0:0";

		this._stopped = true;
		Tone.Transport.stop();
	},
	update() {
		if (this._stopped) return;
		// do calculations
		let bars = Tone.Transport.position.split(".")[0].split(":");
		if (bars[0].length < 2) bars[0] = " "+ bars[0];
		this.display.render({ bars: bars.join(" ") });

		// render whats need to be rendered
		this.render();

		requestAnimationFrame(this.update.bind(this));
	},
	render() {
		
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
