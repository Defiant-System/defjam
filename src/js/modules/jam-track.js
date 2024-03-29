
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
		lane.cvsH = +lane.cvs.prop("offsetHeight");
		lane.cvsW = +lane.cvs.prop("offsetWidth");
		lane.cvs.prop({ width: lane.cvsW, height: lane.cvsH });
		lane.ctx.fillStyle = lane.cvs.css("background-color");
		lane.ctx.fillRect(0, 0, lane.cvsW, lane.cvsH);
		lane.cvs.addClass("ready");
		// session view volume canvas
		chan.cvs = window.find(`.track[data-id="${opt.id}"] .volume canvas`);
		chan.ctx = chan.cvs[0].getContext("2d");
		chan.cvsH = +chan.cvs.prop("offsetHeight");
		chan.cvsW = +chan.cvs.prop("offsetWidth");
		chan.cvs.prop({ width: chan.cvsW, height: chan.cvsH });
		chan.ctx.fillStyle = chan.cvs.css("background-color");
		chan.ctx.fillRect(0, 0, chan.cvsW, chan.cvsH);
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
		let track = this._list[id],
			args = [Tone.now()];
		if (track.instrument.name !== "Synth") args.unshift(key);
		track.instrument.triggerRelease(...args);
	},
	updateAnalyserHeight(data) {
		let track = this._list[data.id],
			type = data.type || "lane",
			color = track[type].ctx.fillStyle || "#2d5276",
			width = +track[type].cvs[0].offsetWidth,
			height = +track[type].cvs[0].offsetHeight;
		track[type].cvsW = width;
		track[type].cvsH = height;
		track[type].cvs.prop({ width, height });
		track[type].ctx.fillStyle = color;
		track[type].ctx.fillRect(0, 0, width, height);
	},
	update(data) {
		let track = this._list[data.id];
		for (let key in data) {
			if (key === "id") continue;
			track[key] = data[key];
		}
	}
}