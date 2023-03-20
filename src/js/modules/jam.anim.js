
// Jam.anim

{
	init() {
		let APP = defjam;
		// fast references
		this.session.els = {};
		this.midi.els.playHead = window.find(".midi-note-editor .play-head");
		this.arrangement.els.playHead = window.find(".arr-layout .row-track .play-head");
	},
	dispatch(event) {
		let Self = Jam.anim,
			el;
		switch (event.type) {
			case "update":
				["midi", "session", "arrangement"].map(name => {
					if (Self[name]) Self[name].update(event);
				});
				break;
			case "turn-on":
				Self[event.name].isOn = true;
				if (Self[event.name].els.playHead) {
					// show play-head
					Self[event.name].els.playHead.addClass("on");
				}
				break;
			case "turn-off":
				Self[event.name].isOn = false;
				if (Self[event.name].els.playHead) {
					// hide play-head
					Self[event.name].els.playHead.removeClass("on");
				}
				break;
		}
	},
	midi: {
		els: {},
		isOn: false,
		update(event) {
			if (!this.isOn) return;
			// view animations
		}
	},
	session: {
		els: {},
		isOn: false,
		update(event) {
			if (!this.isOn) return;
			// view animations
		}
	},
	arrangement: {
		els: {},
		isOn: false,
		update(event) {
			if (!this.isOn) return;
			// view animations
			let left = 960 * event.progress;
			this.els.playHead.css({ transform: `translateX(${left}px)` });
		}
	}
}