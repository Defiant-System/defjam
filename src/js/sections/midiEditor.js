
// defjam.midiEditor

{
	init() {
		// fast references
		this.els = {
			doc: $(document),
			el: window.find(".midi-note-editor"),
			lasso: window.find(".midi-note-editor .lasso"),
		};

		// modes: lasso, pencil
		this.mode = "lasso";

		// bind event handler
		this.els.el.find(".row-body .col-right .body-frame").on("wheel", this.dispatch);
		this.els.el.find(".row-body .col-right .body-frame").on("mousedown", this.doLasso);
		this.els.el.find(".row-body .body-frame ul").on("mousedown", this.doNoteRuler);
		this.els.el.find(".col-right .body-frame ul").on("mousedown", this.doNoteBars);
	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.midiEditor,
			Drag = Self.drag,
			limit,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// native events
			case "wheel":
				el = Self.els.el;
				limit = {
					minY: 0,
					minX: 0,
					maxY: el.find(".row-body .col-left .box-body").prop("offsetHeight") - el.find(".row-body .col-left .body-frame").prop("offsetHeight"),
					maxX: Math.min(el.find(".row-head .col-right .box-body").prop("offsetWidth") - el.find(".row-head .col-right .body-frame").prop("offsetWidth"), 0),
				};
				// default values
				value = {
					"--oY": parseInt(el.cssProp("--oY"), 10),
					"--oX": parseInt(el.cssProp("--oX"), 10),
				};
				value["--oY"] = Math.max(Math.min(value["--oY"] - event.deltaY, limit.minY), limit.maxY);
				value["--oX"] = Math.max(Math.min(value["--oX"] - event.deltaX, limit.minX), limit.maxX);
				// add prefix
				value["--oY"] = value["--oY"] +"px";
				value["--oX"] = value["--oX"] +"px";
				// UI apply
				el.css(value);
				break;
			// custom events
			case "get-details":
				el = Self.els.el;
				Self.details = {
					oY: parseInt(el.cssProp("--oY"), 10),
					oX: parseInt(el.cssProp("--oX"), 10),
					keyH: parseInt(el.cssProp("--keyH"), 10),
					noteW: parseInt(el.cssProp("--noteW"), 10),
					bars: parseInt(el.cssProp("--bars"), 10),
				};
				break;
		}
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
					allH = el.find(".row-body .col-left .body-frame").prop("offsetHeight"),
					viewH = el.find(".row-body .col-left .box-body").prop("offsetHeight"),
					offsetY = parseInt(el.cssProp("--oY"), 10),
					clickX = event.clientX,
					clickY = event.clientY,
					limit = {
						minY: 0,
						maxY: viewH - allH,
					},
					min_ = Math.min,
					max_ = Math.max;
				Self.drag = { el, clickX, clickY, offsetY, limit, min_, max_ };
				
				// prevent mouse from triggering mouseover
				APP.els.content.addClass("hide-cursor");
				// bind event handlers
				Self.els.doc.on("mousemove mouseup", Self.doNoteRuler);
				break;
			case "mousemove":
				let oY = Drag.max_(Drag.min_(Drag.offsetY - Drag.clickY + event.clientY, Drag.limit.minY), Drag.limit.maxY);
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
				// prevent default behaviour
				event.preventDefault();
				
				// prepare drag object
				let el = Self.els.el,
					allW = el.find(".row-head .col-right .body-frame").prop("offsetWidth"),
					viewW = el.find(".row-head .col-right .box-body").prop("offsetWidth"),
					offsetX = parseInt(el.cssProp("--oX"), 10),
					clickX = event.clientX,
					clickY = event.clientY,
					limit = {
						minX: 0,
						maxX: Math.min(viewW - allW, 0),
					},
					min_ = Math.min,
					max_ = Math.max;
				Self.drag = { el, clickX, clickY, offsetX, limit, min_, max_ };
				
				// prevent mouse from triggering mouseover
				APP.els.content.addClass("hide-cursor");
				// bind event handlers
				Self.els.doc.on("mousemove mouseup", Self.doNoteBars);
				break;
			case "mousemove":
				let oX = Drag.max_(Drag.min_(Drag.offsetX - Drag.clickX + event.clientX, Drag.limit.minX), Drag.limit.maxX);
				Drag.el.css({ "--oX": `${oX}px` });
				break;
			case "mouseup":
				// remove class
				APP.els.content.removeClass("hide-cursor");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.doNoteBars);
				break;
		}
	},
	doLasso(event) {
		let APP = defjam,
			Self = APP.midiEditor,
			Drag = Self.drag,
			el;
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				// proxy event depending on mode
				if (Self.mode === "pencil") return Self.doPencil(event);

				// prepare drag object
				let el = Self.els.lasso.removeClass("hidden"),
					pEl = Self.els.el,
					oY = parseInt(el.cssProp("--oY"), 10),
					oX = parseInt(el.cssProp("--oX"), 10),
					cY = event.offsetY,
					cX = event.offsetX,
					eX = event.clientX,
					eY = event.clientY,
					limit = {
						minY: 0,
						maxY: 500,
					},
					min_ = Math.min,
					max_ = Math.max,
					notes = Self.els.lasso.parent().find("b").map(note => ({
						el: $(note).removeClass("selected"),
						top: note.offsetTop,
						left: note.offsetLeft,
						th: note.offsetTop + note.offsetHeight,
						lw: note.offsetLeft + note.offsetWidth
					}));
				Self.drag = { el, notes, oX, oY, cX, cY, eX, eY, limit, min_, max_ };
				
				// prevent mouse from triggering mouseover
				APP.els.content.addClass("hide-cursor");
				// bind event handlers
				Self.els.doc.on("mousemove mouseup", Self.doLasso);
				break;
			case "mousemove":
				let top = Drag.cY,
					left = Drag.cX,
					height = event.clientY - Drag.eY,
					width = event.clientX - Drag.eX;

				if (width < 0) {
					left += width;
					width = Drag.eX - event.clientX;
				}

				if (height < 0) {
					top += height;
					height = Drag.eY - event.clientY;
				}

				Drag.notes.map(note => {
					let isOn = top <= note.th && note.top <= top + height && 
								left <= note.lw && note.left <= left + width;
					note.el.toggleClass("selected", !isOn);
				});

				// UI update
				Drag.el.css({ top, left, width, height });
				break;
			case "mouseup":
				Drag.el.addClass("hidden").css({ width: 0, height: 0 });
				// remove class
				APP.els.content.removeClass("hide-cursor");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.doLasso);
				break;
		}
	},
	doPencil(event) {
		let APP = defjam,
			Self = APP.midiEditor,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":

				let el = $(event.target);
				if (el.hasClass("body-frame")) {
					// refresh details
					Self.dispatch({ type: "get-details" });

					let name = "A4",
						t = Math.floor(event.offsetY / Self.details.keyH),
						l = Math.floor(event.offsetX / Self.details.noteW),
						d = 2;
					// add note
					el.append(`<b style="--t: ${t}; --l: ${l}; --d: ${d};">${name}</b>`);
				} else {
					// delete note
					el.remove();
				}

				// prevent mouse from triggering mouseover
				// APP.els.content.addClass("hide-cursor");
				// bind event handlers
				// Self.els.doc.on("mousemove mouseup", Self.doPencil);
				break;
			case "mousemove":
				
				break;
			case "mouseup":
				// remove class
				APP.els.content.removeClass("hide-cursor");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.doPencil);
				break;
		}
	}
}