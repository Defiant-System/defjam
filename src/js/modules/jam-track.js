
// Jam.track

{
	init() {
		this._list = {};
	},
	add(opt) {
		let meter = new Tone.Meter({ channels: 1 }),
			channel = new Tone.Channel().connect(meter).toDestination(),
			chan = {},
			lane = {};
		// arrangement view lane volume analyser canvas
		lane.cvs = window.find(`.lane[data-id="${opt.id}"] .vol-analyser canvas`);
		lane.ctx = lane.cvs[0].getContext("2d");
		lane.w = 5;
		lane.h = 61;
		lane.cvs.prop({ width: lane.w, height: lane.h });
		lane.ctx.fillStyle = lane.cvs.css("background-color");
		lane.ctx.fillRect(0, 0, lane.w, lane.h);
		lane.cvs.addClass("ready");
		// session view volume canvas
		chan.cvs = window.find(`.track[data-id="${opt.id}"] .volume canvas`);
		chan.ctx = chan.cvs[0].getContext("2d");
		chan.w = 6;
		chan.h = 111;
		chan.cvs.prop({ width: chan.w, height: chan.h });
		chan.ctx.fillStyle = chan.cvs.css("background-color");
		chan.ctx.fillRect(0, 0, chan.w, chan.h);
		chan.cvs.addClass("ready");

		// connect to channel
		opt.instrument.connect(channel);
		// save reference to list
		this._list[opt.id] = { ...opt, chan, lane, channel, meter, isPlaying: false };
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