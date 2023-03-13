
// defjam.midi

{
	init() {
		// fast references
		this.els = {
			doc: $(document),
			el: window.find(".midi-note-editor"),
			lasso: window.find(".midi-note-editor .lasso"),
			pianoRoll: window.find(".row-body .col-left .body-frame"),
			noteHead: window.find(".row-head .col-right .body-frame"),
			noteBody: window.find(".row-body .col-right .body-frame"),
			noteFoot: window.find(".row-foot .col-right .body-frame"),
		};

		// modes: lasso, pencil
		this.mode = "lasso";

		// bind event handler
		window.find(".row-body").on("wheel", this.dispatch);
		this.els.noteBody.on("mousedown", this.doLasso);
		this.els.pianoRoll.on("mousedown mouseout mouseup", this.doPiano);
		this.els.el.find(".row-body .body-frame ul").on("mousedown", this.doNoteRuler);
		this.els.el.find(".col-right .body-frame ul").on("mousedown", this.doNoteBars);
	},
	dispatch(event) {
		let APP = defjam,
			Self = APP.midi,
			Drag = Self.drag,
			xClip,
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
					maxY: Self.els.noteBody.parent().prop("offsetHeight") - Self.els.noteBody.prop("offsetHeight"),
					maxX: Math.min(Self.els.noteBody.parent().prop("offsetWidth") - Self.els.noteBody.prop("offsetWidth"), 0),
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
			case "toggle-velocity-editor":
				value = event.el.hasClass("toggled");
				event.el.toggleClass("toggled", value);
				Self.els.el.toggleClass("show-velocity-editor", !value);
				break;
			case "render-clip":
				//  remove existing notes
				Self.els.pianoRoll.find("ul, ol").remove();
				Self.els.noteBody.find("b").remove();
				Self.els.noteFoot.find("b").remove();
				// toggle parent class
				Self.els.el.parent().toggleClass("empty", event.clipId);
				if (!event.clipId) return;

				xClip = event.file.data.selectSingleNode(`//Project//Clip[@id="${event.clipId}"]`);
				value = xClip.parentNode.selectNodes(`./Device/Pads/Pad[@sample]`).length;
				Self.els.el
					.toggleClass("clip-pads", value == 0)
					.css({
						"--oY": xClip.getAttribute("oY") +"px",
						"--oX": xClip.getAttribute("oX") +"px",
						"--keyH": xClip.getAttribute("keyH") +"px",
						"--noteW": xClip.getAttribute("noteW") +"px",
						"--bars": xClip.getAttribute("bars"),
						"--pads": value || "" ,
						"--c": xClip.parentNode.getAttribute("color"),
					});
				// render clip notes
				window.render({
					data: event.file.data,
					template: "clip-pads",
					match: `//Project//Clip[@id="${event.clipId}"]`,
					append: Self.els.pianoRoll,
				});
				// render notes
				window.render({
					data: event.file.data,
					template: "midi-notes",
					match: `//Project//Clip[@id="${event.clipId}"]`,
					append: Self.els.noteBody,
				});
				// render note velocity
				window.render({
					data: event.file.data,
					template: "midi-note-volume",
					match: `//Project//Clip[@id="${event.clipId}"]`,
					append: Self.els.noteFoot,
				});
				break;
		}
	},
	doPiano(event) {
		let APP = defjam,
			Self = APP.midi,
			Drag = Self.drag,
			keyboard,
			keyH,
			topIndex,
			octave,
			keys,
			key,
			top,
			width,
			trackId,
			el;
		// console.log(event);
		switch (event.type) {
			case "window.keystroke":
				// keyboard = {
				// 	a: "C3",
				// 	s: "D3",
				// 	d: "E3",
				// };
				// // play sound
				// key = keyboard[event.char];
				// if (key && Self.sampler) {
				// 	Self.sampler.triggerAttackRelease([key], 1, Tone.now(), .75);
				// }
				break;
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				el = Self.els.pianoRoll.find("ul");
				if (event.offsetX > +el.prop("offsetWidth")) {
					keyH = parseInt(Self.els.el.cssProp("--keyH"), 10);
					topIndex = Math.floor(event.offsetY / keyH);
					octave = Math.floor(topIndex / 12);
					keys = [...OCTAVE].reverse();
					key = keys[topIndex % keys.length] + (7 - octave).toString();
					top = (topIndex * keyH);
					width = key.includes("#") ? 25 : 32;
					trackId = "track-2";

					Self.drag = { trackId, key };

					if (key) {
						// triggerAttack
						Jam.track.triggerAttack(trackId, key);
					}
					// UI update
					Self.els.el.css({ "--pkT": `${top}px`, "--pkW": `${width}px` });
				}

				// bind event handlers
				Self.els.doc.on("mousemove mouseout mouseup", Self.doPiano);
				break;
			case "mousemove":
				break;
			case "mouseup":
				if (Drag.key) {
					// triggerRelease
					Jam.track.triggerRelease(Drag.trackId, Drag.key);
				}
				/* falls through */
			case "mouseout":
				// release key
				Self.els.el.css({ "--pkT": "", "--pkW": "", });
				// unbind event handlers
				Self.els.doc.off("mousemove mouseout mouseup", Self.doPiano);
				break;
		}
	},
	doNoteRuler(event) {
		APP = defjam,
			Self = APP.midi,
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
			Self = APP.midi,
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
			Self = APP.midi,
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
			Self = APP.midi,
			Drag = Self.drag,
			t, l, d;
		switch (event.type) {
			case "mousedown":
				// drag details
				let el = $(event.target),
					rEl = Self.els.el,
					details = {
						oY: parseInt(rEl.cssProp("--oY"), 10),
						oX: parseInt(rEl.cssProp("--oX"), 10),
						keyH: parseInt(rEl.cssProp("--keyH"), 10),
						noteW: parseInt(rEl.cssProp("--noteW"), 10),
						bars: parseInt(rEl.cssProp("--bars"), 10),
					},
					clickY = event.clientY,
					clickX = event.clientX,
					floor_ = Math.floor,
					name = "",
					onDone = () => {
						// sequence update
						let sequence = Self.dispatch({ type: "ui-to-sequence" });
						Jam.track.update({ id: "track-1", sequence });
					};

				t = floor_(event.offsetY / details.keyH),
				l = floor_(event.offsetX / details.noteW);
				d = 1;

				if (el.hasClass("body-frame")) {
					// add note
					el = el.append(`<b style="--t: ${t}; --l: ${l}; --d: ${d};">${name}</b>`);
				} else {
					// delete note
					el.remove();
					// UI to live sequence
					return onDone();
				}
				Self.drag = { el, d, l, details, onDone, clickY, clickX, floor_ };

				// prevent mouse from triggering mouseover
				APP.els.content.addClass("hide-cursor");
				// bind event handlers
				Self.els.doc.on("mousemove mouseup", Self.doPencil);
				break;
			case "mousemove":
				d = Drag.floor_((event.clientX - Drag.clickX) / Drag.details.noteW);
				l = Drag.l;

				if (d < 0) {
					l += d;
					d = Drag.l - l;
				} else if (d < 1) {
					d = 1;
				}
				Drag.el.css({ "--l": l, "--d": d });
				break;
			case "mouseup":
				// UI to live sequence
				Drag.onDone();
				// remove class
				APP.els.content.removeClass("hide-cursor");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.doPencil);
				break;
		}
	}
}
