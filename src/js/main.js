
@import "./ext/pathseg.js"

@import "./modules/ux.js";
@import "./modules/svg.js";
@import "./modules/jam.js";
@import "./modules/misc.js";
@import "./modules/audio.js";
@import "./classes/file.js";
@import "./modules/test.js";



const { Tone } = await window.fetch("~/js/bundle.js");

const defjam = {
	init() {
		// fast references
		this.els = {
			content: window.find(".content"),
		};
		// init auxiliary objects
		UX.init();
		Jam.init();
		Audio.init();
		// init sub objects
		Object.keys(this).filter(i => this[i].init).map(i => this[i].init());

		// DEV-ONLY-START
		Test.init();
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = defjam,
			file,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "window.keystroke":
				// temp pass along
				switch (event.char) {
					case "space":
						Self.toolbar.dispatch({ type: "toggle-play" });
						break;
					default:
						return Self.midi.dispatch(event);
				}
				break;
			case "window.keyup":
				return Self.midi.dispatch(event);
			case "window.close":
				Jam.stop();
				break;
			// custom events
			case "load-sample":
				// open application local sample file
				Self.openLocal(`~/samples/${event.name}`)
					.then(fsFile => {
						Self.File = new File(fsFile);
					});
				break;
			default:
				el = event.el || (event.origin ? event.origin.el : null);
				if (el) {
					let rEl = el.parents("[data-section]"),
						section = rEl.data("section");
					if (section) {
						return Self[section].dispatch(event);
					}
					if (el.parents(".win-caption-toolbar_").length) {
						return Self.toolbar.dispatch(event);	
					}
				}
		}
	},
	openLocal(url) {
		let parts = url.slice(url.lastIndexOf("/") + 1),
			[ name, kind ] = parts.split("."),
			file = new karaqu.File({ name, kind });
		// return promise
		return new Promise((resolve, reject) => {
			// fetch image and transform it to a "fake" file
			fetch(url)
				.then(resp => resp.blob())
				.then(blob => {
					let reader = new FileReader();
					reader.addEventListener("load", () => {
						// file info blob
						file.blob = blob;
						file.size = blob.size;
						// this will then display a text file
						file.data = $.xmlFromString(reader.result).documentElement;
						resolve(file);
					}, false);
					// get file contents
					reader.readAsText(blob);
				})
				.catch(err => reject(err));
		});
	},
	head: @import "./sections/head.js",
	toolbar: @import "./sections/toolbar.js",
	browser: @import "./sections/browser.js",
	session: @import "./sections/session.js",
	arrangement: @import "./sections/arrangement.js",
	devices: @import "./sections/devices.js",
	midi: @import "./sections/midi.js",
	foot: @import "./sections/foot.js",
	status: @import "./sections/status.js",
};

window.exports = defjam;
