
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
				// prevent default behaviour
				event.preventDefault();
				// prepare drag object
				let el = Self.els.el,
					allH = el.find(".row-body .col-right .body-frame").prop("offsetHeight"),
					viewH = el.find(".row-body .col-right .box-body").prop("offsetHeight"),
					offsetY = parseInt(el.cssProp("--oY"), 10),
					clickX = event.clientX,
					clickY = event.clientY,
					min = { y: 0 },
					max = { y: viewH - allH },
					min_ = Math.min,
					max_ = Math.max;
				Self.drag = { el, clickX, clickY, offsetY, min, max, min_, max_ };
				console.log( viewH, allH );
				// prevent mouse from triggering mouseover
				APP.els.content.addClass("hide-cursor");
				// bind event handlers
				Self.els.doc.on("mousemove mouseup", Self.doNoteRuler);
				break;
			case "mousemove":
				let oY = Drag.max_(Drag.min_(Drag.offsetY - Drag.clickY + event.clientY, Drag.min.y), Drag.max.y);
				Drag.el.css({ "--oY": `${oY}px` });
				break;
			case "mouseup":
				// remove class
				APP.els.content.removeClass("hide-cursor");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.doNoteRuler);
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
