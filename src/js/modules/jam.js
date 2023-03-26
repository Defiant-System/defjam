
const Jam = {
	display: @import "./jam-display.js",
	track: @import "./jam-track.js",
	anim: @import "./jam-anim.js",
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
		APP.foot.dispatch({ type: "set-height", node });

		// app UI: arrangement view - project duration
		APP.arrangement.dispatch({ type: "set-session-view", file });

		// save reference to file
		this._file = file;

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
						oscillator: { partials: [4, 2, 3, 4] },
						detune: 100,
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
	normalizeNotes() {
		let Self = this,
			xDoc = Self._file.data,
			xpTrack = xDoc.selectSingleNode(`//Tracks`),
			xDur = xDoc.selectSingleNode(`//Head/Duration`),
			val = xDur.getAttribute("value"),
			dLen = DUR.toBeats(val) - 4,
			beats = [...Array(dLen*4)].map((e, i) => i.toString());

		xpTrack.selectNodes(`.//Track/Lane//b`).map(xNote => {
			let cX = +xNote.parentNode.getAttribute("cX") * 4,
				bX = +xNote.getAttribute("b");
			xNote.setAttribute("bX", bX + cX);
		});

		beats.map((beat, i) => {
			let notes = xpTrack.selectNodes(`.//Track/Lane//b[@bX="${beat}"]`);
			if (notes.length > 1 || (notes.length && notes[0].getAttribute("s"))) {
				beats[i] = [...Array(16)].map((sE, sI) => `${beat}.${sI}`);
			}
		});

		return { xpTrack, beats };
	},
	start() {
		let APP = defjam,
			trackList = this.track._list,
			{ xpTrack, beats } = this.normalizeNotes();

		// change "flag"
		this._stopped = false;

		if (!this.sequence) {
			this.sequence = new Tone.Sequence((time, beat) => {
					let [b, s] = beat.split("."),
						xPath = `.//Track/Lane//b[@bX="${b}"]`;
					if (!s || s === "0") xPath += `[not(@s)]`;
					else if (s && +s > 0) xPath += `[@s="${s}"]`;

					xpTrack.selectNodes(xPath).map(xNote => {
						let xTrack = xNote.parentNode.parentNode.parentNode,
							oTrack = trackList[xTrack.getAttribute("id")],
							note = xNote.getAttribute("n"),
							dur = +xNote.getAttribute("d") +"n",
							vel = +xNote.getAttribute("v");
						if (oTrack.isDrumkit) note = [note];
						oTrack.instrument.triggerAttackRelease(note, dur, time, vel);
					});
				}, beats).start(0);
		}

		// start animations
		this.anim.dispatch({ type: "playing" });

		// return;
		// return console.log(beats);

		// start Tone transport
		// Tone.Transport.start();
		Tone.Transport.start("0", "4:1:1");
		// update / rendering
		this.update();
	},
	stop() {
		// stop all tracks
		Object.keys(this.track._list).map(id => {
			let oTrack = this.track._list[id];
			oTrack.isPlaying = false;
		});
		// change "flag"
		this._stopped = true;
		// stop animations
		this.anim.dispatch({ type: "stopped" });
		// stop Tone transport
		Tone.Transport.stop();
	},
	update() {
		if (this._stopped) return;
		// do calculations
		let bars = Tone.Transport.position.split(".")[0].split(":").map(i => (+i+1).toString()),
			seconds = Math.floor(Tone.Transport.seconds),
			sec = (seconds % 60).toString().padStart(2, "0"),
			min = Math.floor(seconds / 60).toString().padStart(2, "0"),
			hr = Math.floor(seconds / 3600).toString().padStart(2, "0"),
			time = `${hr} ${min} ${sec}`,
			tempo = Tone.Transport.bpm.value;
		if (bars[0].length < 2) bars[0] = " "+ bars[0];
		bars = bars.join(" ");

		// render display
		this.display.render({ bars, time, tempo });
		// update animations
		if (this.sequence) {
			this.anim.dispatch({
				type: "update",
				progress: this.sequence.progress,
			});
		}
		// raf
		requestAnimationFrame(this.update.bind(this));
	}
};
