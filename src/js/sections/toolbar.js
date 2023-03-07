
// defjam.toolbar

{
	init() {
		// fast references
		this.els = {
			doc: $(document),
			el: window.find(".win-caption-toolbar_"),
			display: window.find(".win-caption-toolbar_ .display"),
			canvas: window.find(".win-caption-toolbar_ .display canvas"),
			btnRewind: window.find(`.toolbar-tool_[data-click="rewind"]`),
			btnForward: window.find(`.toolbar-tool_[data-click="forward"]`),
			btnStop: window.find(`.toolbar-tool_[data-click="stop"]`),
			btnPlay: window.find(`.toolbar-tool_[data-click="play"]`),
			btnRecord: window.find(`.toolbar-tool_[data-click="record"]`),
		};

		// defaults
		this.display = {
			show: this.els.display.hasClass("show-time") ? "time" : "barBeat",
		}

		// bind event handler
		this.els.display.on("mousedown", ".tempo", this.doDisplayTempo);

		// reset dim
		let width = this.els.canvas.prop("offsetWidth"),
			height = this.els.canvas.prop("offsetHeight");
		this.els.canvas.prop({ width, height });
		// display canvas
		this.cvs = this.els.canvas[0];
		this.ctx = this.cvs.getContext("2d");

		this.updateDisplay();
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
			case "toggle-play":
			case "play":
				value = Self.els.btnPlay.hasClass("tool-active_");
				Self.els.btnPlay.toggleClass("tool-active_", value);
				return !value;
		}
	},
	updateDisplay(data={}) {
		let APP = defjam,
			File = APP.File,
			els = this.els,
			cvs = this.cvs,
			ctx = this.ctx,
			width = cvs.width,
			tempo = data.tempo ? data.tempo : 120;
		els.canvas.prop({ width });

		// text defaults
		ctx.font = "17px Lucida Console";
		ctx.fillStyle = "#b7cbe0";
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";

		switch (this.display.show) {
			case "barBeat":
				ctx.fillText("001.1", 44, 23);
				break;
			case "time":
				ctx.fillText("00:00.01", 54, 23);
				break;
		}
		// tempo
		ctx.fillText(tempo, 144, 23);
	},
	doDisplayTempo(event) {
		let APP = defjam,
			Self = APP.toolbar,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				// prepare drag object
				let el = Self.els.el,
					value = APP.File._tempo,
					clickY = event.clientY,
					limit = {
						minY: 20,
						maxY: 100,
					},
					min_ = Math.min,
					max_ = Math.max;
				Self.drag = { el, clickY, value, limit, min_, max_ };
				
				// prevent mouse from triggering mouseover
				APP.els.content.addClass("hide-cursor");
				// bind event handlers
				Self.els.doc.on("mousemove mouseup", Self.doDisplayTempo);
				break;
			case "mousemove":
				// let oY = Drag.max_(Drag.min_(Drag.offsetY - Drag.clickY + event.clientY, Drag.limit.minY), Drag.limit.maxY);
				// tempo
				let tempo = Drag.value + Drag.clickY - event.clientY;
				Self.updateDisplay({ tempo });
				break;
			case "mouseup":
				// remove class
				APP.els.content.removeClass("hide-cursor");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.doDisplayTempo);
				break;
		}
	}
}
