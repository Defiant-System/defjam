
@import "./modules/ux.js";
@import "./modules/audio.js";
@import "./modules/test.js";


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

		// DEV-ONLY-START
		Test.init();
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = defjam,
			el;
		//console.log(event);
		switch (event.type) {
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
	foot: @import "./sections/foot.js",
};

window.exports = defjam;
