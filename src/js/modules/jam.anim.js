
// Jam.anim

{
	init() {
		// fast references
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
			el;
		switch (event.type) {
			case "update":
				["midi", "session", "arrangement"].map(name => {
					let obj = Self[name];
					if (obj.isOn) obj.update(event);
				});
				break;

			case "midi-turn-on":
				// defaults
				Self.midi.isOn = true;
				Self.midi.width = parseInt(Self.midi.els.lengthSpan.css("width"), 10);
				// show play-head
				Self.midi.els.playHead.addClass("on");
				break;
			case "midi-turn-off":
				Self.midi.isOn = false;
				// hide play-head
				Self.midi.els.playHead.removeClass("on");
				break;

			case "session-turn-on":
				// auto stop session view animations
				Self.dispatch({ type: "arrangement-turn-off" });
				// defaults
				Self.session.isOn = true;
				break;
			case "session-turn-off":
				Self.session.isOn = false;
				break;

			case "arrangement-turn-on":
				// auto stop session view animations
				Self.dispatch({ type: "session-turn-off" });
				// defaults
				Self.arrangement.isOn = true;
				Self.arrangement.width = parseInt(Self.arrangement.els.lengthSpan.css("width"), 10);
				// show play-head
				Self.arrangement.els.playHead.addClass("on");
				break;
			case "arrangement-turn-off":
				Self.arrangement.isOn = false;
				// hide play-head
				Self.arrangement.els.playHead.removeClass("on");
				break;
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
			/*
			Object.keys(this.track._list).map(id => {
				let oTrack = this.track._list[id];
				oTrack.ctx.clearRect(0, 0, 6, 111);
				let p1 = Math.log(oTrack.meter.getValue() + 51) / Math.log(63);
				if (isNaN(p1)) p1 = 0;
				oTrack.ctx.fillRect(0, 0, 6, Math.round((1 - p1) * 111));
			});
			*/
		}
	},
	arrangement: {
		els: {},
		isOn: false,
		update(event) {
			// view animations
			let left = this.width * event.progress;
			this.els.playHead.css({ transform: `translateX(${left}px)` });
		}
	}
}
