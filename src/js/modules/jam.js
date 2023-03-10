
const Jam = {
	display: @import "./jam.display.js",
	init() {
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
				cvs = window.find(`.track[data-id="track-${id}"] .volume canvas`).addClass("ready"),
				ctx = cvs[0].getContext("2d");

			instrument.connect(channel);

			this._list.push({ id, ctx, instrument, sequence, channel, meter, isDrumkit });
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
	_stopped: true,
	stop() {
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
