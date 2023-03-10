
const Jam = {
	display: @import "./jam.display.js",
	init() {
		// defaults
		this._stopped = true;
		// init sub objects
		Object.keys(this).filter(i => this[i].init).map(i => this[i].init());
	},
	track: {
		init() {
			this._list = [];
		},
		add(id, instrument, sequence, isDrumkit=0) {
			let meter = new Tone.Meter({ channels: 1 }),
				channel = new Tone.Channel().connect(meter).toDestination(),
				cvs = window.find(`.track[data-id="${id}"] .volume canvas`).addClass("ready"),
				ctx = cvs[0].getContext("2d");
			// canvas defaults
			ctx.fillStyle = "#182c40";
			// connect to channel
			instrument.connect(channel);
			// add to list
			this._list.push({ id, ctx, instrument, sequence, channel, meter, isDrumkit });
			// reset volume eq
			if (Jam._stopped) Jam.render();
		},
		update(data) {
			let track = this._list.find(el => data.id === el.id);
			for (let key in data) {
				if (key === "id") continue;
				track[key] = data[key];
			}
		}
	},
	start() {
		this._stopped = false;

		// prepare sequence grid
		this._loop = new Tone.Sequence((time, beat) => {
			this.track._list.map(track => {
				if (track.isDrumkit) {
					track.sequence.map((lane, index) => {
						if (lane[beat]) {
							track.instrument.triggerAttackRelease([`C${index}`], "4n", time, 1);
						}
					});
				} else if (track.sequence[beat]) {
					track.instrument.triggerAttackRelease(track.sequence[beat], "4n", time, 1)
				}
			});
		}, [...Array(16)].map((e,i) => i)).start(0);

		Tone.Transport.start();
		this.update();
	},
	stop() {
		this._stopped = true;
		this._loop.stop();
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
		this.track._list.map(track => {
			track.ctx.clearRect(0, 0, 6, 111);
			let p1 = Math.log(track.meter.getValue() + 51) / Math.log(63);
			if (isNaN(p1)) p1 = 0;
			track.ctx.fillRect(0, 0, 6, Math.round((1 - p1) * 111));
		});
	}
};
