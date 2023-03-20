
// Jam.track

{
	init() {
		this._list = {};
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
		// save reference to list
		this._list[opt.id] = { ...opt, ctx, channel, meter, isPlaying: false };
		// reset volume eq
		if (Jam._stopped) Jam.render();
	},
	stop(id) {
		let track = this._list[id];
		if (track.sequence) {
			track.sequence.stop();
			delete track.sequence;
		}
		track.isPlaying = false;
	},
	playClip(id, clipId) {
		let track = this._list[id],
			xClip = track.xNode.selectSingleNode(`./Slot/Clip[@id="${clipId}"]`);
		// exit if already playing
		if (track.isPlaying) return;
		track.xClip = xClip;
		track.isPlaying = true;
		// start playing
		if (Jam._stopped) Jam.start();
	},
	play(id, key) {
		let track = this._list[id],
			tone = track.isDrumkit ? [key] : key;
		track.instrument.triggerAttackRelease(tone, "1n", Tone.now(), 1);
	},
	triggerAttack(id, key) {
		let track = this._list[id];
		track.instrument.triggerAttack(key, Tone.now(), 1);
	},
	triggerRelease(id, key) {
		let track = this._list[id];
		track.instrument.triggerRelease(key, Tone.now());
	},
	update(data) {
		let track = this._list[data.id];
		for (let key in data) {
			if (key === "id") continue;
			track[key] = data[key];
		}
	}
}