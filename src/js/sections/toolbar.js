
// defjam.toolbar

{
	init() {
		// fast references
		this.els = {
			// el: window.find(".toolbar-group_").parent(),
			display: window.find(".toolbar-group_.display"),
			canvas: window.find(".toolbar-group_.display canvas"),
			btnRewind: window.find(`.toolbar-tool_[data-click="rewind"]`),
			btnForward: window.find(`.toolbar-tool_[data-click="forward"]`),
			btnStop: window.find(`.toolbar-tool_[data-click="stop"]`),
			btnPlay: window.find(`.toolbar-tool_[data-click="play"]`),
			btnRecord: window.find(`.toolbar-tool_[data-click="record"]`),
			btnLoop: window.find(`.toolbar-tool_[data-click="loop"]`),
			btnMetronome: window.find(`.toolbar-tool_[data-click="metronome"]`),
			btnPencil: window.find(`.toolbar-tool_[data-click="pencil"]`),
			btnPianoKeys: window.find(`.toolbar-tool_[data-click="piano-keys"]`),
		};

		// bind event handler
		this.els.display.on("mousedown", ".tempo", this.doDisplayTempo);

	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.toolbar,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "pencil":
				value = event.el.hasClass("tool-active_");
				// set midi editor mode
				APP.midi.mode = value ? "lasso" : "pencil";
				// UI update toolbar tool
				return !value;
			case "toggle-play":
			case "play":
				value = Self.els.btnPlay.hasClass("tool-active_");
				Self.els.btnPlay.toggleClass("tool-active_", value);

				if (value) Jam.stop();
				else Jam.start();

				return !value;
			case "stop":
				if (Self.els.btnPlay.hasClass("tool-active_")) {
					Self.els.btnPlay.removeClass("tool-active_");
				}
				APP.session.dispatch({ type: "stop-all" });

				Jam.stop();
				break;
			case "show-display":
				Self.els.display
					.removeClass("show-time show-bar-beat")
					.addClass(`show-${event.arg}`)
				Jam.display.show = event.arg;
				Jam.display.render();
				break;
			case "enable-toolbar":
				Self.els.display.find(".toolbar-field_").removeClass("blank-display");
				Object.keys(Self.els).map(key => Self.els[key].removeClass("tool-disabled_"));
				break;
			case "disable-toolbar":
				Self.els.display.find(".toolbar-field_").addClass("blank-display");
				Object.keys(Self.els).map(key => Self.els[key].addClass("tool-disabled_"));
				break;
		}
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
				let doc = $(document),
					el = Self.els.el,
					value = APP.File._tempo,
					render = Jam.display.render.bind(Jam.display),
					clickY = event.clientY,
					limit = {
						minY: 20,
						maxY: 100,
					},
					min_ = Math.min,
					max_ = Math.max;
				Self.drag = { doc, el, render, clickY, value, limit, min_, max_ };
				
				// prevent mouse from triggering mouseover
				APP.els.workarea.addClass("hide-cursor");
				// bind event handlers
				Self.drag.doc.on("mousemove mouseup", Self.doDisplayTempo);
				break;
			case "mousemove":
				// let oY = Drag.max_(Drag.min_(Drag.offsetY - Drag.clickY + event.clientY, Drag.limit.minY), Drag.limit.maxY);
				// tempo
				let tempo = Drag.value + Drag.clickY - event.clientY;
				Drag.render({ tempo });
				break;
			case "mouseup":
				// remove class
				APP.els.workarea.removeClass("hide-cursor");
				// unbind event handlers
				Self.drag.doc.off("mousemove mouseup", Self.doDisplayTempo);
				break;
		}
	}
}
