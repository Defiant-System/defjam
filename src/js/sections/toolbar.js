
// defjam.toolbar

{
	init() {
		// fast references
		this.els = {
			el: window.find(".win-caption-toolbar_"),
			display: window.find(".win-caption-toolbar_ .display"),
			canvas: window.find(".win-caption-toolbar_ .display canvas"),
		};
		// reset dim
		let width = this.els.canvas.prop("offsetWidth"),
			height = this.els.canvas.prop("offsetHeight");
		this.els.canvas.prop({ width, height });
		// display canvas
		this.cvs = this.els.canvas[0];
		this.ctx = this.cvs.getContext("2d");

		// text defaults
		this.ctx.font = "17px Lucida Console";
		this.ctx.fillStyle = "#b7cbe0";
		this.ctx.textBaseline = "bottom";

		this.dispatch({ type: "reset-display" });
	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.toolbar,
			name,
			value,
			el;
		switch (event.type) {
			case "reset-display":
				// bar / beat
				if (Self.els.display.hasClass("show-time")) Self.ctx.fillText("00:00.01", 13, 23);
				else Self.ctx.fillText("001.1", 17, 23);
				// tempo
				Self.ctx.fillText("120", 128, 23);
				break;
			case "pencil":
				value = event.el.hasClass("tool-active_");
				// set midi editor mode
				APP.midiEditor.mode = value ? "lasso" : "pencil";
				// UI update toolbar tool
				return !value;
		}
	}
}
