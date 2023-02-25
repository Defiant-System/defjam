
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
				return !value;
		}
	}
}
