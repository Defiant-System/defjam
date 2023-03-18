
const Jam = {
	display: @import "./jam.display.js",
	init() {
		// defaults
		this._stopped = true;
		// init sub objects
		Object.keys(this).filter(i => this[i].init).map(i => this[i].init());
	},
	loadProject(file) {
		let APP = defjam,
			node = file.data.selectSingleNode(`//Head/Tempo`),
			value = node.getAttribute("value") || 120;
		// song tempo / BPM
		Tone.Transport.bpm.value = +value;

		// app UI: browser view
		node = file.data.selectSingleNode(`//Head/Browser`);
		value = node ? +node.getAttribute("width") : 229;
		APP.browser.dispatch({ type: "set-width", value });

		// app UI: details view
		node = file.data.selectSingleNode(`//Head/Details`);
		value = node ? +node.getAttribute("height") : 420;
		APP.devices.dispatch({ type: "set-height", value });

		// loop tracks
		file.data.selectNodes(`//Tracks/Track`).map(xNode => {
			let id = xNode.getAttribute("id"),
				isDrumkit = 0,
				sequence,
				instrument,
				data = {
					urls: {},
					baseUrl: BASE_URL,
				};
			switch (xNode.getAttribute("type")) {
				case "sampler":
					let xPath = xNode.selectSingleNode(`./Device/Set[@xPath]`).getAttribute("xPath");
					window.bluePrint.selectNodes(xPath).map(xSample => {
						let i = +xSample.getAttribute("i"),
							n = +xSample.getAttribute("n");
						data.urls[KEYS.note(n)] = `${i}.ogg`;
					});
					instrument = new Tone.Sampler(data);
					break;
				case "synth":
					instrument = new Tone.PolySynth(Tone.Synth, {
						oscillator: { partials: [0, 2, 3, 4] }
					});
					break;
				case "drumkit":
					xNode.selectNodes(`./Device/Pads/Pad[@sample]`).map(xPad => {
						let key = xPad.getAttribute("key"),
							sample = xPad.getAttribute("sample");
						data.urls[key] = `${sample}.ogg`;
					});
					instrument = new Tone.Sampler(data);
					isDrumkit = 1;
					break;
			}
			// add track to jam
			this.track.add({ id, xNode, instrument, sequence, isDrumkit });
		});
	},
	track: {
		init() {
			this._list = [];
		},
		add(opt) {
			let meter = new Tone.Meter({ channels: 1 }),
				channel = new Tone.Channel().connect(meter).toDestination(),
				cvs = window.find(`.track[data-id="${opt.id}"] .volume canvas`),
				ctx = cvs[0].getContext("2d"),
				color = cvs.css("background-color");
			// canvas defaults
			ctx.fillStyle = cvs.css("background-color");
			// make canvas ready
			cvs.addClass("ready");
			// connect to channel
			opt.instrument.connect(channel);
			// add to list
			this._list.push({ ...opt, ctx, channel, meter, isPlaying: false });
			// reset volume eq
			if (Jam._stopped) Jam.render();
		},
		stop(id) {
			let track = this._list.find(el => el.id === id);
			if (track.sequence) {
				track.sequence.stop();
				delete track.sequence;
			}
			track.isPlaying = false;
		},
		playClip(id, clipId) {
			let track = this._list.find(el => el.id === id),
				xClip = track.xNode.selectSingleNode(`./Slot/Clip[@id="${clipId}"]`);
			// exit if already playing
			if (track.isPlaying) return;
			track.xClip = xClip;
			track.isPlaying = true;
			// start playing
			if (Jam._stopped) Jam.start();
		},
		play(id, key) {
			let track = this._list.find(el => el.id === id),
				tone = track.isDrumkit ? [key] : key;
			track.instrument.triggerAttackRelease(tone, "1n", Tone.now(), 1);
		},
		triggerAttack(id, key) {
			let track = this._list.find(el => el.id === id);
			track.instrument.triggerAttack(key, Tone.now(), 1);
		},
		triggerRelease(id, key) {
			let track = this._list.find(el => el.id === id);
			track.instrument.triggerRelease(key, Tone.now());
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
		
		
	},
	stop() {
		let APP = defjam;
		// stop all tracks
		this.track._list.map(oTrack => {
			if (oTrack.sequence) {
				oTrack.sequence.stop();
				delete oTrack.sequence;
			}
			oTrack.isPlaying = false;
		});
		// change "flag"
		this._stopped = true;
		// hide play-head
		APP.midi.els.playHead.removeClass("on");
		// stop Tone transport
		Tone.Transport.stop();
	},
	update() {
		if (this._stopped) return;
		// do calculations
		let APP = defjam,
			bars = Tone.Transport.position.split(".")[0].split(":"),
			seconds = Math.floor(Tone.Transport.seconds),
			sec = (seconds % 60).toString().padStart(2, "0"),
			min = Math.floor(seconds / 60).toString().padStart(2, "0"),
			hr = Math.floor(seconds / 3600).toString().padStart(2, "0"),
			time = `${hr} ${min} ${sec}`,
			tempo = Tone.Transport.bpm.value;
		if (bars[0].length < 2) bars[0] = " "+ bars[0];
		bars = bars.join(" ");
		
		// loop tracks
		this.track._list.map(oTrack => {
			if (oTrack.isPlaying && oTrack.sequence) {
				// setPlayhead
				let left = oTrack.clip.width * oTrack.sequence.progress + oTrack.clip.oX;
				// console.log( oTrack.clip.width, oTrack.clip.oX );
				APP.midi.els.playHead.css({ transform: `translateX(${left}px)` });
			}
		});

		// render display
		this.display.render({ bars, time, tempo });
		// render whats need to be rendered
		this.render();
		// raf
		requestAnimationFrame(this.update.bind(this));
	},
	render() {
		// setPlayhead
		// let left = oTrack.clip.width * oTrack.sequence.progress + oTrack.clip.oX;
		// console.log(  );
		// this.playHead.css({ transform: `translateX(${left}px)` });

		this.track._list.map(oTrack => {
			oTrack.ctx.clearRect(0, 0, 6, 111);
			let p1 = Math.log(oTrack.meter.getValue() + 51) / Math.log(63);
			if (isNaN(p1)) p1 = 0;
			oTrack.ctx.fillRect(0, 0, 6, Math.round((1 - p1) * 111));
		});
	}
};
