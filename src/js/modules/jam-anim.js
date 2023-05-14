
// Jam.anim

{
	init() {
		// fast references
		this.parts = ["devices", "midi", "session", "arrangement"];
		this.devices.els = {};
		this.session.els = {};
		
		this.midi.els.playHead = window.find(".midi-note-editor .play-head");
		this.midi.els.lengthSpan = window.find(".midi-note-editor .row-head .length-span");
		this.midi.els.loopSpan = window.find(".midi-note-editor .row-head .loop-span");

		this.arrangement.els.playHead = window.find(".arr-layout .row-track .play-head");
		this.arrangement.els.lengthSpan = window.find(".arr-layout .row-ruler .length-span");
		this.arrangement.els.loopSpan = window.find(".arr-layout .row-ruler .loop-span");

		// console.log( this.arrangement.els.lengthSpan.css("width") );
	},
	dispatch(event) {
		let Self = Jam.anim,
			value;
		// console.log(event);
		switch (event.type) {
			case "update":
				Self.parts.map(name => {
					let obj = Self[name];
					if (obj.isOn) obj.update(event);
				});
				break;
			case "playing":
			case "stopped":
				Self.parts.map(name => Self.dispatch({ type: `${name}-${event.type}` }));
				break;

			case "devices-playing":
			case "devices-stopped":
				break;
			case "devices-turn-on":
				// auto stop session view animations
				Self.dispatch({ type: "midi-turn-off" });
				// defaults
				Self.devices.isOn = true;
				break;
			case "devices-turn-off":
				// turn off flag
				delete Self.devices.isOn;
				break;

			// show play-head
			case "midi-playing":
				// Self.midi.els.playHead.addClass("on");
				break;
			// hide play-head
			case "midi-stopped":
				// Self.midi.els.playHead.removeClass("on");
				break;
			case "midi-turn-on":
				// auto stop session view animations
				Self.dispatch({ type: "devices-turn-off" });
				// defaults
				// Self.midi.isOn = true;
				// Self.midi.width = parseInt(Self.midi.els.lengthSpan.css("width"), 10);
				break;
			case "midi-turn-off":
				// turn off flag
				delete Self.midi.isOn;
				break;

			case "session-playing":
				Self.session.tracks = Object.keys(Jam.track._list).map(id => Jam.track._list[id]);
				break;
			case "session-stopped":
				// reset analyser "height"
				Object.keys(Jam.track._list).map(id =>
					Jam.track._list[id].chan.ctx.fillRect(0, 0, 1e3, 1e3));
				break;
			case "session-turn-on":
				// auto stop session view animations
				Self.dispatch({ type: "arrangement-turn-off" });
				// defaults
				Self.session.isOn = true;
				break;
			case "session-turn-off":
				// turn off flag
				delete Self.session.isOn;
				break;

			// show play-head
			case "arrangement-playing":
				Self.arrangement.els.playHead.addClass("on");
				Self.arrangement.tracks = Object.keys(Jam.track._list).map(id => Jam.track._list[id]);
				Self.arrangement.width = parseInt(Self.arrangement.els.lengthSpan.css("width"), 10);
				break;
			// hide play-head
			case "arrangement-stopped":
				Self.arrangement.els.playHead.removeClass("on");
				// reset analyser "height"
				Object.keys(Jam.track._list).map(id =>
					Jam.track._list[id].lane.ctx.fillRect(0, 0, 1e3, 1e3));
				break;
			case "arrangement-turn-on":
				// auto stop session view animations
				Self.dispatch({ type: "session-turn-off" });
				// defaults
				Self.arrangement.isOn = true;
				break;
			case "arrangement-turn-off":
				// turn off flag
				delete Self.arrangement.isOn;
				break;
		}
	},
	devices: {
		els: {},
		isOn: false,
		update(event) {
			// view animations
		}
	},
	midi: {
		els: {},
		isOn: false,
		update(event) {
			// view animations
			let left = this.width * event.progress;
			this.els.playHead.css({ transform: `translateX(${left}px)` });
		}
	},
	session: {
		els: {},
		isOn: false,
		update(event) {
			// view animations
			this.tracks.map(track => {
				let w = track.chan.cvsW,
					h = track.chan.cvsH,
					t = Math.round((1 - Tone.dbToGain(track.meter.getValue())) * h);
				track.chan.ctx.fillRect(0, 0, w, h);
				track.chan.ctx.clearRect(0, t, w, h);
			});
		}
	},
	arrangement: {
		els: {},
		isOn: false,
		update(event) {
			// view animations
			let left = this.width * event.progress;
			this.els.playHead.css({ transform: `translateX(${left}px)` });

			this.tracks.map(track => {
				let w = track.lane.cvsW,
					h = track.lane.cvsH,
					t = Math.round((1 - Tone.dbToGain(track.meter.getValue())) * h);
				track.lane.ctx.fillRect(0, 0, w, h);
				track.lane.ctx.clearRect(0, t, w, h);
			});
		}
	}
}
