
// defjam.toolbar

{
	init() {

	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.toolbar,
			name,
			value,
			el;
		switch (event.type) {
			case "pencil":
				value = event.el.hasClass("tool-active_");
				// set midi editor mode
				APP.midiEditor.mode = value ? "lasso" : "pencil";
				// UI update toolbar tool
				return !value;
		}
	}
}
