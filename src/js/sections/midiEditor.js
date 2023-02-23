
// defjam.midiEditor

{
	init() {
		// fast references
		this.els = {
			doc: $(document),
			el: window.find(".midi-note-editor"),
		};

		// bind event handler
		this.els.el.find(".row-body .body-frame ul").on("mousedown", this.doNoteRuler);
		this.els.el.find(".col-right .body-frame ul").on("mousedown", this.doNoteBars);
	},
	dispatch(event) {

	},
	doNoteRuler(event) {
		let APP = defjam,
			Self = APP.midiEditor,
			Drag = Self.drag,
			el;
		switch (event.type) {
			case "mousedown":
				break;
			case "mousemove":
				break;
			case "mouseup":
				break;
		}
	},
	doNoteBars(event) {
		let APP = defjam,
			Self = APP.midiEditor,
			Drag = Self.drag,
			el;
		switch (event.type) {
			case "mousedown":
				break;
			case "mousemove":
				break;
			case "mouseup":
				break;
		}
	}
}
