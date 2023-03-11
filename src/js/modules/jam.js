
const Jam = {
	display: @import "./jam.display.js",
	init() {
		// defaults
		this._stopped = true;
		// init sub objects
		Object.keys(this).filter(i => this[i].init).map(i => this[i].init());
	},
	loadInstruments(file) {
		file.data.selectNodes(`//Tracks/Track`).map(xTrack => {
			let id = xTrack.getAttribute("id"),
				isDrumkit = 0,
				sequence = [],
				instrument,
				data = {
					urls: {},
					baseUrl: BASE_URL,
				};
			switch (xTrack.getAttribute("type")) {
				case "sampler": break;
				case "synth": break;
				case "drumkit":
					xTrack.selectNodes(`./Pads/Pad[@sample]`).map(xPad =>{
						let key = xPad.getAttribute("key"),
							sample = xPad.getAttribute("sample");
						data.urls[key] = `${sample}.ogg`;
					});
					instrument = new Tone.Sampler(data);
					isDrumkit = 1;
					break;
			}
			// add track to jam
			this.track.add(id, instrument, sequence, isDrumkit);
		});
	},
	track: {
		init() {
			this._list = [];
		},
		add(id, instrument, sequence, isDrumkit=0) {
			let meter = new Tone.Meter({ channels: 1 }),
				channel = new Tone.Channel().connect(meter).toDestination(),
				cvs = window.find(`.track[data-id="${id}"] .volume canvas`),
				ctx = cvs[0].getContext("2d"),
				color = cvs.css("background-color");
			// canvas defaults
			ctx.fillStyle = cvs.css("background-color");
			// make canvas ready
			cvs.addClass("ready");
			// connect to channel
			instrument.connect(channel);
			// add to list
			this._list.push({ id, ctx, instrument, sequence, channel, meter, isDrumkit });
			// reset volume eq
			if (Jam._stopped) Jam.render();
		},
		play(id, key) {
			let track = this._list.find(el => el.id === id),
				tone = track.isDrumkit ? [key] : key;
			track.instrument.triggerAttackRelease(tone, "1n", Tone.now(), 1);
		},
		update(data) {
			let track = this._list.find(el => el.id === data.id);
			for (let key in data) {
				if (key === "id") continue;
				track[key] = data[key];
			}
		}
	},
	start() {
		// change "flag"
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
		// change "flag"
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
