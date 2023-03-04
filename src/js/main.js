
// constants
const OCTAVE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const KEYS = note => {
	let base = {
	    "C": 24,
	    "D": 26,
	    "E": 28,
	    "F": 29,
	    "G": 31,
	    "A": 33,
	    "B": 35,
	};

	let keys = {};
    for (let octave=-2; octave<=8; octave++) {
        for (let k in base) {
            let key = base[k] + (octave * 12);
            keys[`${k}b${octave}`] = key-1;
            keys[`${k}${octave}`] = key;
            keys[`${k}#${octave}`] = key+1;
        }
    }

console.log( keys );

	return keys[note];
};


KEYS(121);



@import "./modules/ux.js";
@import "./modules/audio.js";
@import "./modules/test.js";
@import "./classes/file.js";

const { Tone } = await window.fetch("~/js/bundle.js");

const defjam = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
		};
		// init auxiliary objects
		UX.init();
		Audio.init();
		// init sub objects
		Object.keys(this).filter(i => this[i].init).map(i => this[i].init());

		// temp
		this.File = new File;

		// DEV-ONLY-START
		Test.init();
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = defjam,
			el;
		//console.log(event);
		switch (event.type) {
			// system events
			case "window.keystroke":
				// temp pass along
				Self.midiEditor.doPiano(event);
				break;
			// custom events
			case "render-view":
				break;
			default:
				el = event.el;
				if (el) {
					let rEl = el.parents("[data-section]"),
						section = rEl.data("section");
					if (section) {
						return Self[section].dispatch(event);
					}
					if (el.hasClass("toolbar-tool_")) {
						return Self.toolbar.dispatch(event);	
					}
				}
		}
	},
	toolbar: @import "./sections/toolbar.js",
	browser: @import "./sections/browser.js",
	head: @import "./sections/head.js",
	session: @import "./sections/session.js",
	arrangement: @import "./sections/arrangement.js",
	midiEditor: @import "./sections/midiEditor.js",
	drumkit: @import "./sections/drumkit.js",
	foot: @import "./sections/foot.js",
};

window.exports = defjam;
